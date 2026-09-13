---
title: min()
description: Set a minimum length, numeric value, or collection size.
---

`min()` returns a new rule with a lower bound. Its meaning depends on the validator.

```php
use Fynix\Rule;

$name = Rule::string('name')->min(2);
$age = Rule::integer('age')->min(18);
$tags = Rule::array('tags')->min(1);
```

String-like validators use character length, numeric validators use value, and array or image validators use item count. Constraints must be non-negative where supported.

## Behavior

- Strings use character length.
- Numeric validators use the numeric value.
- Arrays and image collections use item count.
- The limit is inclusive, so a value equal to the minimum passes.
- The method is immutable and returns a new rule.

```php
$name = Rule::string('name')->min(2);

$name->validate('Al'); // null
$name->validate('A');  // length.min error
```

Use `length($min, $max)` when both bounds belong to the same rule.