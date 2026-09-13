---
title: Validation handler and errors
description: Validate DTOs, nested objects, batches, and normalized error payloads with Fynix v3.
---


`ValidationHandler` is the object-level validation entry point. Register class rules once and then validate a DTO instance at the application boundary.

## Validate one object

```php
use Fynix\ValidationHandler;

$errors = ValidationHandler::validate($user);

if ($errors !== []) {
    // reject the request or render the messages into a form
}
```

By default, the result contains string messages while preserving nested object and collection paths. That is ideal for form rendering and simple request validation.

## Use explicit rules instead of the registry

The handler also accepts a rule list override.

```php
$errors = ValidationHandler::validate(
    $user,
    rules: [
        Rule::on(User::class)->string('firstName')->min(2)->max(50),
        Rule::on(User::class)->email('email'),
    ]
);
```

When `$rules` is provided, those rules win. When it is omitted, the handler uses `ValidationRegistry`.

## Structured errors

Pass a named argument to keep structured `ValidationError` objects:

```php
$errors = ValidationHandler::validate(
    $user,
    flattenErrorToString: false
);

foreach ($errors as $field => $issues) {
    foreach ((array) $issues as $issue) {
        echo $issue->code . ': ' . $issue->message;
    }
}
```

`ValidationError` exposes `field_name`, `rule`, `message`, `code`, `parameters`, and `toArray()`.

## Batch validation

```php
use Fynix\ValidationHandler;

$results = ValidationHandler::validateMany($user, $profile);

$byKey = ValidationHandler::validateManyAssoc([
    'user' => $user,
    'profile' => $profile,
]);
```

This is useful when you validate multiple DTOs in the same request lifecycle.

## Flatten nested errors

```php
$flat = ValidationHandler::validateAndFlatten($order);
// items.0.name => "Name is required."
```

`flattenValidationErrors()` converts nested arrays to dot-notation keys. This is especially useful for HTML forms and JSON APIs.

## Example response payload

```php
$errors = ValidationHandler::validate(
    $registration,
    flattenErrorToString: false
);

$response = [];
foreach ($errors as $field => $issues) {
    foreach ((array) $issues as $issue) {
        $response[] = $issue->toArray();
    }
}
```

This pattern is ideal for returning stable machine-readable validation payloads.

## Listeners

Use `ValidationListener` for metrics, logging, or tracing:

```php
ValidationHandler::addListener($listener);
$errors = ValidationHandler::validate($order);
ValidationHandler::clearListeners();
```

Listeners receive a callback before and after validation so you can instrument the object-level pipeline without mixing concerns into the validators themselves.