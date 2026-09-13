---
title: StringValidator
description: Validate text fields with requiredness, HTML protection, and length constraints.
---


Use `StringValidator` for names, titles, descriptions, and other text values.

## Create a rule

```php
Rule::string(string $field): StringValidator
```

The name is used in messages. The property name is the key used in the DTO and returned errors.

## Methods

| Method | Description |
| --- | --- |
| `min(int|float $value)` | Set the minimum string length. |
| `max(int|float $value)` | Set the maximum string length. |
| `length(int $min, int $max)` | Set both length limits. |
| `required(bool $required = true)` | Mark the field as required. |
| `optional()` | Allow `null` or an empty value. |
| `validate(mixed $value)` | Return the first error or `null`. |
| `validateAll(mixed $value)` | Return every applicable error. |

## Example

```php
use Fynix\Rule;

$validator = Rule::string('displayName')
    ->length(2, 60)
    ->required();

$error = $validator->validate('A');
```

String validation rejects non-string values, HTML tag content, and values outside the configured range. See the [validator overview](../validators) for inherited methods and error behavior.