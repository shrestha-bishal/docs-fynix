---
title: validateField()
description: Return the first validation error for a single value.
---

# `validateField()`

Use `validateField()` when the first failure is enough for a field-level check.

```php
use Fynix\Rule;

$error = Rule::email('email')->validateField('invalid');

if ($error !== null) {
    echo $error->code;
}
```

The method returns a `ValidationError` or `null`. Pass the owning object as the second argument when evaluating cross-field constraints.