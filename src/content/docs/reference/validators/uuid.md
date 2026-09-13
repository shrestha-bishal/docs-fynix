---
title: UuidValidator
description: Validate versioned UUID strings.
---


```php
use Fynix\Rule;

$error = Rule::uuid('id')
    ->validate('550e8400-e29b-41d4-a716-446655440000');
```

Fynix accepts UUIDs with versions 1 through 5 and the standard variant bits.