# Points to Note for Each Dialect (pg / mysql / sqlite / D1)

Since Kosame is based on Drizzle, it cannot fully account for differences between databases.
This page covers the points to note for each one.

## Transactions

| Dialect                                | Details                                                                                               |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| PostgreSQL                             | `db.transaction()`                                                                                    |
| MySQL                                  | `db.transaction()`                                                                                    |
| SQLite (`better-sqlite3`/`bun:sqlite`) | Manually issue raw SQL `BEGIN`/`COMMIT`/`ROLLBACK` (use `SAVEPOINT` for nesting)                      |
| D1                                     | `db.transaction()` (It has not been verified whether D1 accepts internal `BEGIN`/`COMMIT` statements) |

Since `@libsql/client` is an asynchronous driver, it delegates to `db.transaction()`. For details, see [Transactions](transactions.md).

## context.raw and txContext.raw

| Dialect    | Details                                                                   |
| ---------- | ------------------------------------------------------------------------- |
| PostgreSQL | Separate connection                                                       |
| MySQL      | Separate connection                                                       |
| SQLite     | Single connection (`txContext.raw` and `context.raw` are the same object) |
| D1         | Unverified                                                                |

For more details, see [Escape Hatch](escape-hatch.md).

## Retrieving Rows After an INSERT

| Dialect    | Details                                                                   |
| ---------- | ------------------------------------------------------------------------- |
| PostgreSQL | `.returning()`                                                            |
| MySQL      | Use `$returningId()` to retrieve the primary key and perform a new SELECT |
| SQLite     | `.returning()`                                                            |
| D1         | `.returning()` (same as SQLite)                                           |

In MySQL, since rows cannot be retrieved after an INSERT on tables without a primary key, `add()` cannot be used.

## Type of deletedAtColumn()

| Dialect    | Details                    |
| ---------- | -------------------------- |
| PostgreSQL | `timestamp`                |
| MySQL      | `datetime`                 |
| SQLite     | `integer` (timestamp mode) |
| D1         | Same as SQLite             |

## import

| Dialect    | Details         |
| ---------- | --------------- |
| PostgreSQL | `kosame/pg`     |
| MySQL      | `kosame/mysql`  |
| SQLite     | `kosame/sqlite` |
| D1         | `kosame/sqlite` |
