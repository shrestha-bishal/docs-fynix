---
title: length()
description: Set inclusive minimum and maximum length limits.
---

Use `length($min, $max)` for string-like values and validators that expose length constraints.

```php
use Fynix\Rule;

$username = Rule::username('username')->length(3, 30);
$password = Rule::password('password')->length(8, 64);
```

Both limits are inclusive. The method returns a new immutable rule.

`length()` applies to validators with length or count constraints. For strings it checks character count; for arrays and collections it checks item count.

```php
$password = Rule::password('password')->length(12, 64);

$password->validate('short'); // length or password policy error
$password->validate('A-secure-password-123'); // null
```

Use `min()` or `max()` when only one side of the range is needed. Bounds must be non-negative, and the minimum cannot exceed the maximum.