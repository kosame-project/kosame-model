# Validation

When you configure a `static schema` in Kosame, it automatically validates data during both write and read operations.

## static schema

Kosame does not have its own schema definition DSL, so you'll need to create one yourself.
If you write a `static schema` (drizzle-zod's `createInsertSchema(table)`) in the Model, it will work.

```ts
import { createInsertSchema } from "drizzle-zod";

export class User extends Model {
  static table = usersTable;
  static schema = createInsertSchema(usersTable, {
    name: (schema) => schema.min(1),
  });
  declare id: number;
  declare name: string;
}
```

### Validation Timing

Validation runs during write and read operations.
Validation is performed during `add()`/`update()`/`save()` calls, during hydration in `find()`/`reload()`, and when retrieving relationships via `include`.

### In Case of Failure

If validation fails, an exception is thrown, and database operations and hydration are halted.
