<div align="center">
<img width="214" height="70" alt="kosame" src="https://raw.githubusercontent.com/kosame-project/kosame-orm/main/src/logo/kosameMojiLogo.png" />
</div>

<div align="center">
<h3>
A Drizzle-based ORM with a model-driven approach.
</h3>
</div>

[日本語版はこちら](./README.ja.md)

## Features

- Class-based Models on top of Drizzle (`class User extends Model {}`)
- DbContext-style API (`context.users.find()`) plus instance methods (`user.save()`)
- Associations (`hasMany`/`belongsTo`) via batched `IN (...)` queries — no JOINs
- Hooks: `beforeCreate` / `beforeUpdate` / `beforeDelete`
- Transactions with nesting (`context.transaction()`), `afterCommit` / `afterRollback`
- Mixins (e.g. `SoftDeletable`)
- Schema validation via zod (`drizzle-zod`), on write and on every read
- Escape hatch to the raw Drizzle `db`/`tx` (`context.raw`)
- PostgreSQL, MySQL, SQLite (including Cloudflare D1)

## Install

### bun

```bash
bun add kosame
```

### npm

```bash
npm install kosame
```
