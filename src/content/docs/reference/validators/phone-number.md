---
title: PhoneNumberValidator
description: Validate phone numbers with common separators and a normalized numeric form.
---

# PhoneNumberValidator

Use `PhoneNumberValidator` for phone numbers that may contain spaces, dashes, or a leading plus sign.

## Create a rule

```php
Rule::phoneNumber(string $field): PhoneNumberValidator
```

## Methods

| Method | Description |
| --- | --- |
| `length(int $min, int $max)` | Configure the accepted character length. |
| `required(bool $required = true)` | Mark the field as required. |
| `optional()` | Allow a missing number. |
| `validateField(mixed $value)` | Return the first error or `null`. |
| `validateFieldAll(mixed $value)` | Return every applicable error. |

## Example

```php
use Fynix\Rule;

$validator = Rule::phoneNumber('phone')
    ->length(10, 16);

$error = $validator->validateField('+1 555-010-0123');
```

The validator checks the input pattern and its sanitized numeric value. Non-string input and malformed numbers are rejected.