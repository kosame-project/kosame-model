# Mixins

Kosame does not provide its own implementation of the mixin mechanism; instead, it uses the standard TypeScript mixin function pattern to implement it.

## How Mixins Work

### TypeScript Mixins

Kosame has no mixin mechanism of its own, so you can use the standard TypeScript mixin pattern as-is.

```ts
function WithTimestamp<TBase extends Constructor<Model>>(Base: TBase) {
  abstract class WithTimestampMixin extends Base {
    get createdAtLabel() {
      return "Date and Time Created";
    }
  }
  return WithTimestampMixin;
}
```

### `Constructor<T>`

The type for the standard mixin pattern is `new (...args) => T`, but since the Model itself is an `abstract class`, this type does not work. Therefore, Kosame resolves this issue by providing a dedicated type called `Constructor<T>` (`abstract new (...args: any[]) => T`).

## SoftDeletable

`SoftDeletable` is a feature that, rather than completely deleting data from the database, stores a date and time in a column such as `deletedAt` to make it appear as if the data has been deleted.

### Instructions for Use

Define the `deletedAt` column in the table using `deletedAtColumn()`, and apply it to the model using `SoftDeletable(Model)`. Import `deletedAtColumn()` from sources such as `kosame/pg`, depending on the dialect.

```ts
import { Model, SoftDeletable } from "kosame";
import { deletedAtColumn } from "kosame/pg";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  deletedAt: deletedAtColumn(),
});

class User extends SoftDeletable(Model) {
  static table = usersTable;
}
```

### delete() and hardDelete()

`delete()` does not actually delete the record; instead, it updates the `deletedAt` field with a date and time. To perform a permanent deletion, use `hardDelete()`.

### Automatic Exclusion When Fetching

For models that have `SoftDeletable` applied, deleted rows are automatically excluded from both `find()` queries and relations retrieved via `include`. Simply having a column named `deletedAt` is not enough to exclude these rows; this behavior is only effective when `SoftDeletable` is applied.
