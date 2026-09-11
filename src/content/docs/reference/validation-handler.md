---
title: Validation handler and errors
description: Validate DTOs, nested objects, batches, and normalized error payloads.
---

# Validation handler and errors

`ValidationHandler` is the object-level entry point. Register rules first, then validate a DTO instance.

## Validate one object

```php
use Fynix\ValidationHandler;

$errors = ValidationHandler::validate($user);

if ($errors !== []) {
    // Reject the request or render the messages.
}
```

The default result contains strings. Pass `false` to retain structured `ValidationError` objects:

```php
$errors = ValidationHandler::validate($user, false);

foreach ($errors as $field => $issues) {
    foreach ((array) $issues as $issue) {
        echo $issue->code . ': ' . $issue->message;
    }
}
```

## Batch validation

```php
$results = ValidationHandler::validateMany($user, $profile);

$byKey = ValidationHandler::validateManyAssoc([
    'user' => $user,
    'profile' => $profile,
]);
```

## Flatten nested errors

```php
$flat = ValidationHandler::validateAndFlatten($order);
// items.0.name => "Name is required."
```

`flattenValidationErrors()` converts nested arrays to dot-notation keys. This is useful for HTML forms and JSON API payloads.

## Structured errors

`ValidationError` exposes `rule`, `message`, `field_name`, `code`, `parameters`, and `toArray()`:

```php
$payload = $issue->toArray();
// ['field' => 'email', 'code' => 'email.invalid', ...]
```

## Listeners

Use `ValidationListener` for cross-cutting instrumentation:

```php
ValidationHandler::addListener($listener);
ValidationHandler::clearListeners();
```

Listeners receive `beforeValidate()` and `afterValidate()` callbacks around object validation.