# Creating a Model

## About the Model

Kosame features a “Model” concept that Drizzle does not have. This is similar to the “Model” found in other ORMs, such as EF Core and Active Record, and it allows for implementation that more closely aligns with the design—a key feature of Kosame.

## How to Create

In Kosame, you generally create a `models` directory and then create individual tables within that directory.

```
src/
└── models/
    └── user.ts
```

### How to Write a Model

When creating a model, after defining the table in Drizzle, create a class that extends `Model` for the table you want to model. Then, within that class, link the table to the model using a declaration such as `static table = usersTable`.

```ts
export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export class User extends Model {
  static table = usersTable;
  declare id: number;
  declare name: string;
}
```

### To Those Who Think This Appears to Be a Duplicate Definition

If you feel that the definition in the previous chapter is redundant, I recommend the following approach.
You can resolve this redundancy by retrieving the type from the table created using Drizzle’s `InferSelectModel` and assigning it to the class you created.

```ts
import { InferSelectModel } from "drizzle-orm";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export interface User extends InferSelectModel<typeof usersTable> {}
export class User extends Model {
  static table = usersTable;
}
```

## Reasons for Using “declare”

When creating a model, you may use the `declare` keyword to declare fields within a class.
The `declare` keyword is removed during transpilation. While this may seem to defeat the purpose of the declaration, if you were to write `name: string = ""` instead of using `declare`, the initial value might remain after transpilation. Since this could cause conflicts with values automatically assigned by Kosame at runtime, we use `declare` to intentionally have the declaration removed during transpilation and avoid such conflicts.

## Why You Can't Create It Directly with “new”

You cannot create a Model directly using `new`.
The reason you cannot create a Model directly using `new` is Kosame’s context-based design philosophy.
Kosame has abandoned the approach of defining everything in the Model—as in Active Record—and instead requires that all operations go through the Context. If you create a Model directly using `new`, it cannot be generated via the Context. To maintain the context-based design, you cannot create Models using `new`.
