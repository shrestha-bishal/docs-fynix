---
title: EnumValidator
description: Validate backed enum values or enum instances.
---

# EnumValidator

```php
use Fynix\Rule;

enum Status: string
{
    case Draft = 'draft';
    case Published = 'published';
}

$validator = Rule::enum('status', Status::class);
$error = $validator->validateField('draft');
```

The enum class must exist. Backed enum values and instances of the enum are accepted.