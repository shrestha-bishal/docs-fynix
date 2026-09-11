---
title: PasswordValidator
description: Validate password strength and return all applicable password errors.
---

# PasswordValidator

Use `PasswordValidator` when a password must satisfy multiple strength requirements at once.

## Create a rule

```php
Rule::password(string $field): PasswordValidator
```

## Methods

| Method | Description |
| --- | --- |
| `length(int $min, int $max)` | Configure the accepted password length. |
| `validate(mixed $value)` | Return the first password error or `null`. |
| `validateAll(mixed $value)` | Return all failed strength checks. |
| `validateFieldAll(mixed $value)` | Run shared and password-specific checks. |
| `required(bool $required = true)` | Mark the field as required. |
| `optional()` | Allow a missing password. |

## Example

```php
use Fynix\Rule;

$validator = Rule::password('password')
    ->length(8, 64);

$errors = $validator->validateFieldAll('abc');
```

Password checks include uppercase, lowercase, number, special character, and length requirements. Use `validateFieldAll()` to show a complete checklist to a user.