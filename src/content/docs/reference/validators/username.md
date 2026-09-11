---
title: UsernameValidator
description: Validate usernames and optionally check them against an application data source.
---

# UsernameValidator

Use `UsernameValidator` when usernames must follow a predictable format and may need a uniqueness check.

## Create a rule

```php
Rule::username(string $field): UsernameValidator
```

## Methods

| Method | Description |
| --- | --- |
| `length(int $min, int $max)` | Configure the accepted length. |
| `uniqueUsing(callable $existsChecker)` | Report an error when the callback returns `true`. |
| `required(bool $required = true)` | Mark the field as required. |
| `optional()` | Allow a missing username. |
| `validateField(mixed $value)` | Return the first error or `null`. |
| `validateFieldAll(mixed $value)` | Return every applicable error. |

## Example

```php
use Fynix\Rule;

$validator = Rule::username('username')
    ->length(3, 30)
    ->uniqueUsing(static fn (string $value): bool =>
        $userRepository->existsByUsername($value)
    );

$errors = $validator->validateFieldAll('new_user');
```

Usernames accept letters, numbers, and underscores. The callback should return `true` when the value is already taken.