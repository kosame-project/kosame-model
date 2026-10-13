# Creating a Context

Kosame is based on a context-driven design philosophy; by passing the tables defined in the Model to the Context, it establishes the entry point for actually executing queries.

## How to Create

In Kosame, create a `data` directory and write the Context in context.ts.

```
src/
└── data/
    └── context.ts
```

### How to Write a Context

Call the `createContext` function to link the database and the model.

```ts
import { createContext } from "kosame";
import { db } from "./db.js";
import { User } from "../models/user.js";

export const context = createContext(db, {
  users: User,
});
```

### Built only once

When `createContext(db, schema)` is called, the `ModelCollection` is created by iterating over the schema, and the property `context.users` is defined. This is built immediately, rather than through lazy loading using a proxy. If it were proxy-based, the contents of `context.users` would only be built the first time it is accessed. Kosame is designed so that `context.users` and other properties exist as finalized objects at the moment `createContext()` is called. This stems from Kosame’s explicit design. However, `transaction()` is an exception: a new Context is created each time it is called.
