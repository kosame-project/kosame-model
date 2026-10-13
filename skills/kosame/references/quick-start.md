# QuickStart

## Flow

Database Connection -> Creating a Model -> Context Creation -> CRUD Operations

## Directory Structure

In the Quick Start, we'll create the project using this directory structure.

```
src/
├── data/
│   ├── db.ts
│   └── context.ts
└── models/
    └── user.ts
```

## Database Connection

### data/db.ts

```ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);
```

## Creating a Model

### models/user.ts

```ts
import { Model } from "kosame";
import { pgTable, serial, text } from "drizzle-orm/pg-core";

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

## Context Creation

### data/context.ts

```ts
import { createContext } from "kosame";
import { db } from "./db.js";
import { User } from "../models/user.js";

export const context = createContext(db, { users: User });
```

## CRUD Operations

```ts
const user = await context.users.add({ name: "kosame" });
const found = await context.users.find(user.id);
```
