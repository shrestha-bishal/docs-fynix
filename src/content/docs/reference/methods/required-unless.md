---
title: requiredUnless()
description: Require a field unless another DTO field has a matching value.
---

# `requiredUnless()`

`requiredUnless($field, $value)` makes a field required when the other field does not strictly equal the given value.

```php
$rules->string('taxId')
    ->optional()
    ->requiredUnless('customerType', 'individual');
```

Use this in a `RuleSet` registry factory so Fynix can inspect the owning DTO.