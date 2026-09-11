---
title: UuidValidator
description: Validate versioned UUID strings.
---

# UuidValidator

```php
use Fynix\Rule;

$error = Rule::uuid('id')
    ->validateField('550e8400-e29b-41d4-a716-446655440000');
```

Fynix accepts UUIDs with versions 1 through 5 and the standard variant bits.