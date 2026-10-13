# Relations

Kosame provides relationship functionality using `hasMany` and `belongsTo`.
The design of these relationships does not use JOIN clauses; instead, it retrieves related records using batch queries with the IN clause.

## How to Establish Relationships

### hasMany()

The `hasMany()` relationship represents the “many” side of a relationship.
To use it, import `hasMany()` with `import { hasMany } from "kosame";`.
The arguments for `hasMany()` are a function that returns the target Model class and the `foreignKey`/`localKey`.
`foreignKey` is required, while `localKey` is optional. If omitted, the primary key of the parent table is used.

```ts
static relations = { posts: hasMany(() => Post, { foreignKey: "authorId" }) };
```

### belongsTo()

The `belongsTo()` relationship represents the "one" side of a relationship.
To use it, import `belongsTo()` with `import { belongsTo } from "kosame";`.
The arguments for `belongsTo()` are a function that returns the target Model class and the `foreignKey`/`targetKey`.
`foreignKey` is required, while `targetKey` is optional. If omitted, the primary key of the target table is used.

```ts
static relations = { author: belongsTo(() => User, { foreignKey: "authorId" }) };
```

### include

Use `include` when you want to retrieve related records along with the result returned by `find()`.
To use `include`, pass an array of key names for the relationships defined in `static relations` as an argument to `find()`.
The key names passed to `include` become the property names of the returned instance. If the relationship is via `hasMany()`, an array is returned; if via `belongsTo()`, a single instance is returned (or `undefined` if none exists).

```ts
const user = await context.users.find(id, { include: ["posts"] });
```

## Known Limitations

### Nest

You cannot retrieve nested relationships using `include`.
You need to be careful with systems—such as those designed to track which posts a user has commented on—because they involve nesting.

### Composite Keys Not Supported

This feature does not support tables that treat multiple columns collectively as a primary key or foreign key.

### Relationship with SoftDeletable

When using `SoftDeletable` in a relationship, both `hasMany` and `belongsTo` automatically exclude rows that have been soft-deleted.
There is no opt-out mechanism equivalent to `withDeleted` in `find()`.

## Reasons Not to Use JOIN

Kosame's relations do not use JOINs.
Why not? By using the `IN` clause, the fan-out problem is prevented in principle. This is a design decision based on the fact that this approach is safer because it also avoids the N+1 problem.
Furthermore, JOINs are not used because this approach eliminates the need to rely on Drizzle's `relations()` method.
