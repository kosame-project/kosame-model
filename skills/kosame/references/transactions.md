# Transactions

Kosame provides transaction functionality via `context.transaction(callback)`.

## How to Use

To define a transaction, call `context.transaction()` and pass a callback as an argument.

```ts
await context.transaction(async (txContext) => {
  const user = await txContext.users.add({ name: "kosame" });
});
```

### afterCommit()

`afterCommit(callback)` is a method that is called within a transaction's callback to register the processing you want to execute after a successful commit.

```ts
await context.transaction(async (txContext) => {
  const user = await txContext.users.add({ name: "kosame" });

  txContext.afterCommit(() => {
    console.log("The commit was successful.");
  });
});
```

### afterRollback()

`afterRollback(callback)` is a method that is called within a transaction's callback to register the processing you want to execute after a rollback occurs.

```ts
await context.transaction(async (txContext) => {
  const user = await txContext.users.add({ name: "kosame" });

  txContext.afterRollback(() => {
    console.log("It was rolled back.");
  });

  throw new Error("error");
});
```

## Differences Between Dialects

For databases other than SQLite, Drizzle’s native `db.transaction()` handles this. However, SQLite is an exception: with synchronous drivers such as `bun:sqlite` or `better-sqlite3`, passing an asynchronous callback to `db.transaction()` does not work correctly.
Therefore, for SQLite, this is resolved by manually issuing raw SQL `BEGIN`/`COMMIT`/`ROLLBACK` statements (and `SAVEPOINT` if nested).
