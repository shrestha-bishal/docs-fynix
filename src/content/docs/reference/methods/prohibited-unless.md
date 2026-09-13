---
title: prohibitedUnless()
description: Reject a value unless another DTO field has a matching value.
---

`prohibitedUnless($field, $value)` rejects a non-empty value when the other field does not strictly equal the given value.

```php
$rules->string('businessLicense')
    ->optional()
    ->prohibitedUnless('accountType', 'business');
```

The comparison is strict. When the condition does not match, a non-null and non-empty value returns a `prohibited` error before type-specific validation runs.

```php
$registration = new Registration();
$registration->accountType = 'personal';
$registration->businessLicense = 'LIC-123';

$error = Rule::for($registration)
    ->string('businessLicense')
    ->optional()
    ->prohibitedUnless('accountType', 'business')
    ->validate();
```

The field is allowed only when the other field matches the expected value. Use `requiredUnless()` when the desired behavior is to require a value instead.