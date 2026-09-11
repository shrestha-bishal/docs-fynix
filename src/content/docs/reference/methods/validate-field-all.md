---
title: validateFieldAll()
description: Return every applicable validation error for a single value.
---

# `validateFieldAll()`

Use `validateFieldAll()` when users should see every problem at once, especially for passwords or composite rules.

```php
use Fynix\Rule;

$errors = Rule::password('password')
    ->length(8, 64)
    ->validateFieldAll('abc');

foreach ($errors as $error) {
    echo $error->message;
}
```

The method returns a list of `ValidationError` objects. It is also used internally by object-level validation.