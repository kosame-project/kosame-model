# Hooks

Kosame provides hooks that are called before CRUD operations are executed and allow you to abort a write operation by throwing an exception.

## How to Use Hooks

### beforeCreate()

You use `beforeCreate()` by `overriding` it in the Model class. It is automatically called before `context.<collection>.add()` is executed, and you can prevent the write operation by throwing an exception.

```ts
override async beforeCreate() {
  if (!this.name.includes("kosame")) {
    throw new Error("Name must contain kosame");
  }
}
```

By the time `beforeCreate()` is called, `this.name` already contains the value to be inserted. In this code example, an exception is thrown to stop the write operation if the name does not contain `kosame`.

### beforeUpdate(changes)

You use `beforeUpdate()` by `overriding` it in the Model class. It is automatically called before the instance's `update()` method is executed, and you can prevent the write operation by throwing an exception. Since `changes` is passed by reference, any changes made within the hook will be reflected directly in the database write.

### beforeDelete()

You use `beforeDelete()` by `overriding` it in the Model class. It is automatically called before the instance's `delete()` method is executed, and you can prevent the write operation by throwing an exception.
