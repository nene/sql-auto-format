# SQL auto-format ![build status](https://github.com/nene/sql-auto-format/actions/workflows/build.yml/badge.svg)

Pretty-prints SQL code.

## Usage

The format() function takes an SQL string and config options:

```js
import { format } from "sql-auto-format";

console.log(format("SELECT * FROM person", { dialect: "sqlite" }));
```

and returns it in nicely formatted way:

```sql
SELECT
  *
FROM
  person
```
