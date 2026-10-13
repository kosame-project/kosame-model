# Kosame install

### bun

```bash
bun add kosame
```

### npm

```bash
npm install kosame
```

## driver

You must install the database driver yourself. The current version of Kosame is v0.45.2, which provides the stable version of Drizzle.

### node-postgres

```bash
bun add drizzle-orm@^0.45.2 pg
bun add -D drizzle-kit@^0.45.2 @types/pg
```

### mysql2

```bash
bun add drizzle-orm@^0.45.2 mysql2
bun add -D drizzle-kit@^0.45.2
```

### libsql

```bash
bun add drizzle-orm@^0.45.2 @libsql/client
bun add -D drizzle-kit@^0.45.2
```

### better-sqlite3

```bash
bun add drizzle-orm@^0.45.2 better-sqlite3
bun add -D drizzle-kit@^0.45.2 @types/better-sqlite3
```
