# Model Field Declarations

In Kosame, there are two ways to declare a model.
On this page, we’ll explain why we’ve provided two declaration methods and discuss the characteristics of each.

## declare

One way to declare models is to write `declare` statements one by one.
This approach makes the declarations easier to read, but it also involves duplicate definitions.
The fact that the declarations are easier to read is relative to declaration merging; this method allows you to write code in a way that feels more intuitive than declaring and merging `interface` and `class` definitions.
Since this feature might be confusing for those unfamiliar with declaration merging, we’ve also provided the `declare` style.

```ts
import { Model } from "kosame";

export class User extends Model {
  static table = usersTable;
  declare id: number;
  declare name: string;
}
```

## Declaration Merging

In the declaration merge approach, the code is written twice—once for `interface` and once for `class`.
TypeScript has a feature that automatically merges `interface` and `class` definitions with the same name,
so this syntax works without any issues.
A key feature of this approach is that it eliminates the need for duplicate definitions; however, compared to the `declare` syntax, it can be difficult for first-time users to understand.

```ts
import { Model } from "kosame";
import { InferSelectModel } from "drizzle-orm";

export interface User extends InferSelectModel<typeof usersTable> {}

export class User extends Model {
  static table = usersTable;
}
```

## About Recommendations

Kosame does not have a recommended declaration method, but if you want to write code intuitively, use `declare`. If you find that verbose, use `interface` (declaration merging).
