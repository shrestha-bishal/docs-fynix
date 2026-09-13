---
title: prohibitedIf()
description: Reject a value when another DTO field has a matching value.
---

`prohibitedIf($field, $value)` rejects a non-empty value when the other field strictly equals the given value.

```php
$rules->string('nickname')
    ->optional()
    ->prohibitedIf('accountType', 'business');
```

The comparison is strict. When the condition matches, a non-null and non-empty value returns a `prohibited` error before type-specific validation runs.

```php
$registration = new Registration();
$registration->accountType = 'personal';
$registration->companyName = 'Acme';

$error = Rule::for($registration)
    ->string('companyName')
    ->optional()
    ->prohibitedIf('accountType', 'personal')
    ->validate();
```

The field may be empty in the prohibited context. Use `requiredIf()` when the desired behavior is to require a value instead.