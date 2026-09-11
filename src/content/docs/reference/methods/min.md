---
title: min()
description: Set a minimum length, numeric value, or collection size.
---

# `min()`

`min()` returns a new rule with a lower bound. Its meaning depends on the validator.

```php
use Fynix\Rule;

$name = Rule::string('name')->min(2);
$age = Rule::integer('age')->min(18);
$tags = Rule::array('tags')->min(1);
```

String-like validators use character length, numeric validators use value, and array or image validators use item count. Constraints must be non-negative where supported.