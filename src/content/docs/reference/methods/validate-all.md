---
title: validateAll()
description: Run the centralized Fynix validation pipeline and return every applicable error.
---

`validateAll()` runs the same centralized pipeline as `validate()` but returns every applicable `ValidationError` instead of only the first one.

## Example

```php
use Fynix\Rule;

$errors = Rule::password('password')
    ->length(12, 128)
    ->validateAll('abc');
```

This allows a form or API response to show all password policy violations together.

## Structured errors

Each result is a `ValidationError` with a field name, message, machine-readable code, and parameters:

```php
foreach ($errors as $error) {
    $payload[] = $error->toArray();
}
```

For complete DTO validation, `ValidationHandler::validate()` returns string messages by default. Pass `flattenErrorToString: false` when the object-level result should retain structured errors.

## Object-bound values

Bind the rule to an object to validate a property without passing the property value manually:

```php
$user = new User();
$user->password = 'abc';

$errors = Rule::for($user)
    ->password('password')
    ->length(12, 128)
    ->validateAll();
```

Use `validateAll()` for password policies, import validation, or API responses where showing every applicable issue is more useful than stopping at the first one. For complete DTO graphs, use `ValidationHandler::validate()` instead.
