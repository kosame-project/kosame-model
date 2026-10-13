# What is Kosame?

Kosame is a data framework based on Drizzle.
Kosame is a framework developed to make Drizzle—as a tool—easier to operate and to enable development that is closer to the design intent.
It retains Drizzle’s lightness and simplicity while providing the structure expected of a framework.

## The Philosophy of Drizzle

As part of Drizzle’s philosophy, we refer to existing ORMs as “data frameworks.”
Drizzle advocates for a “headless ORM.” This means that Drizzle is based on the philosophy of stripping away the intrusive elements found in existing ORM projects.

### Why data-framework?

The reason Kosame provides rules (guidelines) is that we believe ORMs should have them.
We take the view that if there are no rules (guidelines), SQL is sufficient.
Issues such as writing style and data types can be handled by external tools like Kysely.
However, we believe it is necessary to provide rules (guidelines) that these tools cannot fully cover, which is why Kosame provides rules (guidelines) as a data framework.
