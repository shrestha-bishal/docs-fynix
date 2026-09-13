---
title: BooleanValidator
description: Validate strict boolean values.
---


```php
use Fynix\Rule;

$validator = Rule::boolean('isActive');
$error = $validator->validate(true);
```

The validator accepts only `true` or `false`; strings such as `'true'` and integers such as `1` are rejected. Use `optional()` to allow a missing value.