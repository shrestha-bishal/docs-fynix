---
title: EmailValidator
description: Validate email syntax and optionally verify that the domain can receive mail.
---

# EmailValidator

Use `EmailValidator` for account, contact, and notification addresses.

## Create a rule

```php
Rule::email(string $field): EmailValidator
```

## Methods

| Method | Description |
| --- | --- |
| `length(int $min, int $max)` | Configure the accepted email length. |
| `verifyDomain(bool $enabled = true)` | Enable MX-record verification. |
| `required(bool $required = true)` | Mark the field as required. |
| `optional()` | Allow a missing email. |
| `validateField(mixed $value)` | Return the first error or `null`. |
| `validateFieldAll(mixed $value)` | Return every applicable error. |

## Example

```php
use Fynix\Rule;

$validator = Rule::email('email')
    ->length(6, 180)
    ->verifyDomain();

$error = $validator->validateField('person@example.com');
```

Syntax checks are always enabled. Domain verification is opt-in because DNS lookups add network cost and can make validation less deterministic.