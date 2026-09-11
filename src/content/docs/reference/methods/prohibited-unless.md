---
title: prohibitedUnless()
description: Reject a value unless another DTO field has a matching value.
---

# `prohibitedUnless()`

`prohibitedUnless($field, $value)` rejects a non-empty value when the other field does not strictly equal the given value.

```php
$rules->string('businessLicense')
    ->optional()
    ->prohibitedUnless('accountType', 'business');
```

The failure code is `prohibited`.