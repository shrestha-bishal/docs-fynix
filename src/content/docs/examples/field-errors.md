---
id: examples/field-errors
title: Field and API errors
description: Compare validate() and validateAll() for standalone Fynix values.
sidebar:
    order: 4
---


Use a standalone `Rule` when a value does not need a registered DTO. `validate()` returns the first error. `validateAll()` returns every applicable error from the same pipeline.

## First error

```php
use Fynix\Rule;

$error = Rule::string('displayName')
    ->min(3)
    ->max(80)
    ->validate('A');
```

Returned value:

```php
$error->toArray();

[
    'field' => 'displayName',
    'code' => 'length.min',
    'message' => 'Display Name is too short. This field must be at least 3 characters.',
    'parameters' => ['min' => 3],
]
```

## All applicable errors

Password rules are a good use case for `validateAll()` because a user benefits from seeing the complete policy checklist:

```php
use Fynix\Rule;

$errors = Rule::password('password')
    ->length(12, 128)
    ->validateAll('abc');

$result = array_map(
    static fn ($error): array => $error->toArray(),
    $errors,
);
```

Representative result:

```php
[
    [
        'field' => 'password',
        'code' => 'length.min',
        'message' => 'Password is too short. This field must be at least 12 characters.',
        'parameters' => ['min' => 12],
    ],
    [
        'field' => 'password',
        'code' => 'password.uppercase',
        'message' => 'Password must contain at least one uppercase letter.',
        'parameters' => [],
    ],
    [
        'field' => 'password',
        'code' => 'password.lowercase',
        'message' => 'Password must contain at least one lowercase letter.',
        'parameters' => [],
    ],
    [
        'field' => 'password',
        'code' => 'password.number',
        'message' => 'Password must contain at least one number.',
        'parameters' => [],
    ],
    [
        'field' => 'password',
        'code' => 'password.special',
        'message' => 'Password must contain at least one special character.',
        'parameters' => [],
    ],
]
```

## When the object is the boundary

For a complete DTO, use the handler instead of manually combining field results:

```php
$errors = ValidationHandler::validate(
    $registration,
    flattenErrorToString: false,
);
```

That keeps nested traversal, registry resolution, and error formatting in one place.
