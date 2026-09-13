---
title: IntegerValidator
description: Validate strict integers with optional inclusive bounds.
---


```php
use Fynix\Rule;

$validator = Rule::integer('age')->min(18)->max(120);
$errors = $validator->validateAll(17);
```

`min()` and `max()` are inclusive. Numeric strings and floating-point values are not integers.