---
title: max()
description: Set a maximum length, numeric value, or collection size.
---

`max()` returns a new rule with an upper bound.

```php
use Fynix\Rule;

$title = Rule::string('title')->max(120);
$score = Rule::number('score')->max(100);
$items = Rule::arrayOf('items')->max(20);
```

The meaning follows the validator: text length, numeric value, or collection count.

## Behavior

- Strings use character length.
- Numeric validators use the numeric value.
- Arrays and image collections use item count.
- The limit is inclusive, so a value equal to the maximum passes.
- The method is immutable and returns a new rule.

```php
$title = Rule::string('title')->max(120);

$title->validate('A short title'); // null
$title->validate(str_repeat('x', 121)); // length.max error
```

Use `length($min, $max)` when both bounds belong to the same rule.