---
title: requiredIf()
description: Require a field when another DTO field has a matching value.
---

# `requiredIf()`

`requiredIf($field, $value)` makes a field required when the other field strictly equals the given value.

```php
$rules->string('companyName')
    ->optional()
    ->requiredIf('accountType', 'business');
```

Conditional rules need the DTO object, so use them in registered object validation.