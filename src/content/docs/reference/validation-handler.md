---
title: Validation handler and errors
description: Understand how Fynix validates objects, flattens nested errors, and exposes structured validation results.
---

# Validation handler and errors

The orchestration layer is `ValidationHandler`. It is the entry point for validating an instance of a class after the rules are registered.

## `ValidationHandler::validate()`

```php
use Fynix\ValidationHandler;

$errors = ValidationHandler::validate($user);
```

### Method reference

```php
public static function validate(object $instance, bool $flattenErrorToString = true): array
public static function validateMany(object ...$instances): array
public static function validateManyAssoc(array $instances, bool $flattenErrorToString = true): array
public static function flattenValidationErrors(array $errors, string $parentKey = ''): array
public static function validateAndFlatten(object $instance): array
```

### Behavior details

`validate()` does the following:

1. Resolves the DTO’s registered rules.
2. Builds a per-field validation map.
3. Recurses into nested object or object-array properties.
4. Merges structure errors and field errors.
5. Returns the final result.

The method can return either:

- a flat message array when `$flattenErrorToString` is `true` (default)
- structured `ValidationError` objects when it is `false`

This flexibility is useful when your application needs either a user-facing validation payload or a machine-readable validation structure.

### Default return format

The default return format is a nested associative array where field names map to either a single string message or nested arrays.

```php
[
    'firstName' => 'First name is required.',
    'email' => 'Email must be a valid email address.',
    'address' => [
        'city' => 'City is required.',
    ],
];
```

## Structured validation errors

Pass `false` as the second argument to get `ValidationError` objects instead.

```php
$errors = ValidationHandler::validate($user, false);

foreach ($errors as $field => $error) {
    if (is_array($error)) {
        foreach ($error as $nestedError) {
            if ($nestedError instanceof \Fynix\ValidationError) {
                echo $nestedError->code . ':' . $nestedError->message;
            }
        }
        continue;
    }

    if ($error instanceof \Fynix\ValidationError) {
        echo $error->code . ':' . $error->message;
    }
}
```

### `ValidationError` method reference

```php
public function __construct(
    ?ValidatorBase $rule,
    string $message,
    string $code = 'validation.invalid',
    array $parameters = [],
    ?string $fieldName = null
)

public static function forField(
    string $fieldName,
    string $message,
    string $code = 'validation.invalid',
    array $parameters = []
): self

public function toArray(): array
```

This is especially useful for APIs, because each error object carries both the human message and the machine-readable code.

### `ValidationError` fields

The class exposes these properties:

- `rule`
- `message`
- `field_name`
- `code`
- `parameters`

It also exposes:

```php
$error->toArray();
```

which returns a normalized array like:

```php
[
    'field' => 'email',
    'code' => 'email.invalid',
    'message' => 'Email must be a valid email address.',
    'parameters' => [],
];
```

## Flattening nested errors

When binding validation errors to forms or JSON responses, dot-notation keys are often easier to work with.

```php
$flattened = ValidationHandler::flattenValidationErrors($errors);
```

Example:

```php
[
    'address.city' => 'City is required.',
    'items.0.name' => 'Name is required.',
    'email' => 'Email must be a valid email address.',
];
```

This is the same function used to convert nested validation arrays into a form-friendly structure.

## `validateAndFlatten()`

```php
$errors = ValidationHandler::validateAndFlatten($user);
```

This is a convenience method that validates the object and immediately flattens the result.

## Batch validation

You can validate several objects at once:

```php
$results = ValidationHandler::validateMany($user1, $user2, $user3);
```

For associative arrays keyed by a domain identifier:

```php
$results = ValidationHandler::validateManyAssoc([
    'user-1' => $user1,
    'user-2' => $user2,
]);
```

## Designing for UI and API output

The default output is suitable for direct controller checks or simple rendering, while `flattenValidationErrors()` and `ValidationError` objects are better for UI binding, JSON responses, and API documentation.

A common pattern is:

```php
$errors = ValidationHandler::validate($requestModel);
if ($errors !== []) {
    return response()->json([
        'errors' => ValidationHandler::flattenValidationErrors($errors),
    ]);
}
```

This produces a stable contract for consumers and keeps your frontend or API clients consistent.

## Error semantics and codes

Each validator emits a machine-readable code when possible. Examples include:

- `required`
- `email.invalid`
- `password.uppercase`
- `password.number`
- `username.taken`
- `object.invalid`
- `array.min`
- `array.max`
- `html.forbidden`

Using codes helps you do client-side translation or handle error categories centrally without depending on exact user-facing text.

## Rule of thumb

- Use the plain array return for quick checks in application code.
- Use flattened errors for forms and APIs.
- Use structured `ValidationError` objects for richer UIs and logging.
- Keep validation results consistent from controller to service boundary.

That separation makes Fynix practical in both server-rendered applications and API-first architectures.
