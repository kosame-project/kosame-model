# Escape Hatch (context.raw)

For implementations that cannot be fully expressed in Kosame, we use an escape hatch.
The escape hatch allows you to write drizzle code directly.

## context.raw

To use the escape hatch, access `context.raw` and then write the drizzle code.

```ts
context.raw.select().from(usersTable).where(eq(usersTable.name, "kosame"));
```

### Return Value

`context.raw` does not use a Model instance because it executes Drizzle directly; therefore, you cannot use features provided by Kosame, such as validation and hooks.

### txContext.raw During a Transaction

`txContext.raw` automatically points to the `tx` handle for that transaction.
Since `better-sqlite3` and `bun:sqlite` use a single connection, `txContext.raw` and `context.raw` point to the same object.
