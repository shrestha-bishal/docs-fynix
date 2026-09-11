---
title: prohibitedIf()
description: Reject a value when another DTO field has a matching value.
---

# `prohibitedIf()`

`prohibitedIf($field, $value)` rejects a non-empty value when the other field strictly equals the given value.

```php
$rules->string('nickname')
    ->optional()
    ->prohibitedIf('accountType', 'business');
```

The failure code is `prohibited`.