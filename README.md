# SQL auto-format

Pretty-prints SQL code.

## Usage

The format() function takes an SQL string:

```js
import { format } from "sql-auto-format";

console.log(format("SELECT * FROM person"));
```

and returns it in nicely formatted way:

```sql
SELECT
  *
FROM
  person
```
