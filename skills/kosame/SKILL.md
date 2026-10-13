---
name: kosame
description: Use this whenever a project depends on the `kosame` npm package (look for `import ... from "kosame"`, `kosame/pg`, `kosame/mysql`, `kosame/sqlite`, or classes that `extends Model` with `static table`), or when asked to add Kosame to a Drizzle project. Covers defining Models, createContext, add/find/update/save/delete, hasMany/belongsTo with include, hooks, transactions with afterCommit, SoftDeletable, validation and context.raw. Kosame has its own API that is not Active Record, Prisma or Knex, so do not guess it: read this skill first.
---

# Kosame

Kosame adds a `Model` class and a `Context` on top of Drizzle. The Drizzle table stays the source of truth; a Model wraps one table, and every operation goes through a Context built from your Drizzle `db`.

This file is the short version: the rules that matter and where to look for details. The `references/` folder holds the full documentation pages; read the one you need rather than all of them.

## The shape of a Kosame project

```
src/
├── data/
│   ├── db.ts        # the drizzle db
│   └── context.ts   # createContext(db, { users: User })
└── models/
    └── user.ts      # drizzle table + class User extends Model
```

```ts
// models/user.ts
import { Model } from "kosame";
import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export class User extends Model {
  static table = usersTable;
  declare id: number;
  declare name: string;
}

// data/context.ts
import { createContext } from "kosame";
export const context = createContext(db, { users: User });

// usage
const user = await context.users.add({ name: "kosame" });
const found = await context.users.find(user.id);
```

## Rules to follow

- **Never `new` a Model.** Create rows with `context.<collection>.add(values)`; it returns an instance that includes database-generated values.
- **`static table` takes the Drizzle table object** (`usersTable`), not a table name string.
- **Declare fields with `declare`**, not initialisers. `name: string = ""` can leave an initial value behind after transpiling and clash with the values Kosame assigns at runtime. The alternative is interface declaration merging with `InferSelectModel` (see `references/model-field-declarations.md`); both are fine.
- **`find(pk)` takes only the primary key** and returns `undefined` when nothing matches. `reload()` throws instead.
- **Instance methods:** `update(changes)` takes a changes object and updates the instance in place; `save()` writes the instance's current property values; `delete()` removes the row.
- **Everything goes through the Context.** Inside `context.transaction(async (txContext) => { ... })` use `txContext`, not `context`. Register `txContext.afterCommit(fn)` / `txContext.afterRollback(fn)` for work that depends on the outcome.
- **Hooks** are overridden on the Model: `override async beforeCreate()`, `beforeUpdate(changes)` (changes are passed by reference, so edits are written), `beforeDelete()`. Throw to abort the write.
- **Relations** go in `static relations`: `hasMany(() => Post, { foreignKey: "authorId" })` and `belongsTo(() => User, { foreignKey: "authorId" })`; `foreignKey` is required. Load them with `find(id, { include: ["posts"] })`. They are fetched with batched `IN` queries, never JOINs.
- **Validation is opt-in:** set `static schema = createInsertSchema(table, refine?)` from `drizzle-zod`. It runs on `add`/`update`/`save` and on reads (hydration, `include`).
- **Soft delete:** `class User extends SoftDeletable(Model)` plus a `deletedAt: deletedAtColumn()` column imported from the dialect entry point (`kosame/pg`, `kosame/mysql` or `kosame/sqlite`). `delete()` then soft-deletes; use `hardDelete()` to remove the row. Having a `deletedAt` column alone does nothing.
- **Mixins** are plain TypeScript mixin functions. Use Kosame's `Constructor<T>` type, because `Model` is abstract.
- **`context.raw` is plain Drizzle.** Use it for anything Kosame cannot express; it returns plain rows and skips hooks and validation.
- **Name collisions:** if another library also exports `Model`, import with an alias: `import { Model as KosameModel } from "kosame"`.

## Recipes

Soft delete (the `deletedAt` column is named `deletedAt` in the database by default; pass a name to `deletedAtColumn("deleted_at")` for another):

```ts
import { Model, SoftDeletable } from "kosame";
import { deletedAtColumn } from "kosame/pg"; // or kosame/mysql, kosame/sqlite

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  deletedAt: deletedAtColumn(),
});

export class User extends SoftDeletable(Model) {
  static table = usersTable;
  declare id: number;
  declare name: string;
  declare deletedAt: Date | null;
}

await user.delete();     // soft delete
await user.hardDelete(); // real DELETE
```

Relations and `include`:

```ts
export class User extends Model {
  static table = usersTable;
  static relations = { posts: hasMany(() => Post, { foreignKey: "authorId" }) };
}
export class Post extends Model {
  static table = postsTable;
  static relations = { author: belongsTo(() => User, { foreignKey: "authorId" }) };
}
export const context = createContext(db, { users: User, posts: Post });

const user = await context.users.find(id, { include: ["posts"] }); // user.posts is an array
```

Hook:

```ts
export class User extends Model {
  static table = usersTable;
  override async beforeCreate() {
    if (this.name.length < 2) throw new Error("name too short");
  }
}
```

Transaction with work after the commit:

```ts
await context.transaction(async (txContext) => {
  const user = await txContext.users.add({ name, email });
  await txContext.posts.add({ authorId: user.id, title });
  txContext.afterCommit(async () => { await sendWelcomeEmail(email); });
});
```

Update by id (two round trips) and the one-statement alternative:

```ts
const user = await context.users.find(id);
if (user) await user.update({ name });

await context.raw.update(usersTable).set({ name }).where(eq(usersTable.id, id));
```

List rows (no collection API for it, so plain Drizzle):

```ts
const active = await context.raw.select().from(usersTable).where(isNull(usersTable.deletedAt));
```

## Known limits (do not work around them silently)

- The collection API is `add()` and `find(pk)` only. There is no multi-row query; for lists or filters use `context.raw`. Loading a relation for many rows one by one is slow (one call per row).
- There is no update-by-id on the collection: you need an instance first, so updating a row by id is `find(id)` then `update()`, two round trips (a plain Drizzle update is one). `update()` itself is a single UPDATE. For a one-statement update use `context.raw`.
- `include` cannot be nested, and composite primary or foreign keys are not supported.
- With `SoftDeletable`, soft-deleted rows are always excluded from relations; there is no `withDeleted` opt-out there.
- MySQL: tables without a primary key cannot use `add()` (rows are re-selected by primary key after insert).
- Cloudflare D1 transactions are not verified yet.

## Installing in a project

Kosame needs the Drizzle driver you already use, with the version Kosame was built for: `drizzle-orm@^0.45.2`. See `references/installation.md`.

## Where to read more

| Need | File |
|------|------|
| What Kosame is and why | `references/overview.md` |
| First working example | `references/quick-start.md` |
| Models, `declare`, why no `new` | `references/model.md` |
| `createContext` | `references/context.md` |
| add / find / update / save / reload / delete | `references/crud.md` |
| hasMany / belongsTo / include, limits | `references/relations.md` |
| Hooks | `references/hooks.md` |
| Transactions, afterCommit / afterRollback | `references/transactions.md` |
| Mixins, SoftDeletable | `references/mixins.md` |
| Validation (`static schema`) | `references/validation.md` |
| `context.raw` | `references/escape-hatch.md` |
| Two ways to declare fields | `references/model-field-declarations.md` |
| `Model` name collisions | `references/naming-collision.md` |
| pg / mysql / sqlite / D1 differences | `references/dialects.md` |
