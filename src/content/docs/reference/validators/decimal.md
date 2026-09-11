---
title: DecimalValidator
description: Validate strict floating-point values with optional inclusive bounds.
---

# DecimalValidator

```php
use Fynix\Rule;

$validator = Rule::decimal('price')->min(0.01)->max(99999.99);
$error = $validator->validateField(12.50);
```

This validator requires a PHP `float`; integers and numeric strings are rejected. Use `optional()` for nullable decimal fields.