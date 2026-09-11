---
title: length()
description: Set inclusive minimum and maximum length limits.
---

# `length()`

Use `length($min, $max)` for string-like values and validators that expose length constraints.

```php
use Fynix\Rule;

$username = Rule::username('username')->length(3, 30);
$password = Rule::password('password')->length(8, 64);
```

Both limits are inclusive. The method returns a new immutable rule.