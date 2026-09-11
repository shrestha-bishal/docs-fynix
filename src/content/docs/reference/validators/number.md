---
title: NumberValidator
description: Validate integer and floating-point values with numeric bounds.
---

# NumberValidator

Use `NumberValidator` for quantities, ages, prices, scores, and other numeric fields.

## Create a rule

```php
Rule::number(string $field): NumberValidator
```

## Methods

| Method | Description |
| --- | --- |
| `min(int|float $value)` | Set the inclusive lower bound. |
| `max(int|float $value)` | Set the inclusive upper bound. |
| `length(int $min, int $max)` | Configure inherited length limits when needed. |
| `required(bool $required = true)` | Mark the field as required. |
| `optional()` | Allow a missing value. |
| `validateField(mixed $value)` | Return the first error or `null`. |
| `validateFieldAll(mixed $value)` | Return every applicable error. |

## Example

```php
use Fynix\Rule;

$validator = Rule::number('quantity')
    ->min(1)
    ->max(1000);

$errors = $validator->validateFieldAll(0);
```

Bounds must be finite numbers. Non-numeric input and values outside the configured range produce validation errors.