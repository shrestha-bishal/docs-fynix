---
title: Reference overview
description: Understand the core building blocks of the Fynix validation engine and how they work together.
---

# Reference overview

Fynix is designed around a small set of composable parts that work together to validate simple values, nested DTOs, and arrays of objects without coupling the library to a framework.

## Core building blocks

### Validators

Every validator is a small object responsible for one field or one rule family.

- `StringValidator` validates string values, length constraints, and HTML content checks.
- `NumberValidator` validates numeric values and ranges.
- `EmailValidator` validates email format and optional DNS verification.
- `PhoneNumberValidator` validates phone formatting and numeric content.
- `PasswordValidator` enforces strength requirements.
- `UsernameValidator` validates usernames and optional uniqueness checks.
- `ImageValidator` validates a single uploaded image file.
- `ImagesValidator` validates multiple uploaded images.
- `ObjectValidator` validates nested object properties.
- `ObjectArrayValidator` validates arrays of nested objects.

These classes inherit from `ValidatorBase`, which provides common behavior for requiredness, length checks, and generic HTML validation.

### Rule builder

The `Rules` facade and `RuleBuilder` class let you define rules for a DTO or class in a fluent, readable way:

```php
use Fynix\Rules;
use function Fynix\nameof;

$rules = Rules::for(User::class)
    ->string(nameof(User::class, 'firstName'))
    ->min(2)
    ->max(50)
    ->email(nameof(User::class, 'email'))
    ->min(6)
    ->max(180)
    ->rules();
```

This keeps rule descriptions near the domain model and makes large DTO validation easier to maintain.

### Validation registry

`ValidationRegistry` is the central place where class-to-rules mappings are registered. This allows nested validation to resolve the rules for a DTO automatically.

```php
use Fynix\ValidationRegistry;

ValidationRegistry::register(User::class, static fn (User $user): array => [
    (new StringValidator('First name', 'firstName'))->min(2)->max(50),
    (new EmailValidator('Email', 'email'))->optional(),
]);
```

### Validation handler

`ValidationHandler` orchestrates validation for a whole object instance, resolves nested validators, and merges all errors.

```php
use Fynix\ValidationHandler;

$errors = ValidationHandler::validate($user);
```

By default, validation errors are returned as a flattened associative structure where the key is the field name and the value is either a string message or an array of nested messages.

### Error objects

When you pass `false` as the second argument,
`ValidationHandler::validate()` returns structured `ValidationError` objects instead of plain strings.

```php
$errors = ValidationHandler::validate($user, false);
foreach ($errors as $field => $issue) {
    $issue = (array) $issue;
    foreach ($issue as $error) {
        echo $error->code . ': ' . $error->message;
    }
}
```

Each `ValidationError` includes:

- `field_name`
- `code`
- `message`
- `parameters`
- `rule`
- `toArray()`

## Validation lifecycle

The normal flow is:

1. Define a DTO class.
2. Register validation rules for that DTO with `ValidationRegistry`.
3. Build the object instance from your request or domain data.
4. Run `ValidationHandler::validate($dto)`.
5. Inspect the returned error structure and either render it or reject the request.

This pattern is especially powerful for layered application design where validation logic stays separate from business logic.

## Recommended patterns

- Keep validation definitions close to DTOs or service providers.
- Use `nameof()` to catch property typos early.
- Prefer nested `ObjectValidator` and `ObjectArrayValidator` definitions for complex domain models.
- Use `flattenValidationErrors()` for form binding and UI rendering.
- Use `validateFieldAll()` when a single field can produce multiple, equally relevant errors.

## Practical example

```php
<?php

use Fynix\Rules;
use Fynix\ValidationHandler;
use Fynix\ValidationRegistry;
use Fynix\Validators\EmailValidator;
use Fynix\Validators\ObjectValidator;
use Fynix\Validators\StringValidator;
use function Fynix\nameof;

final class Address {
    public string $street = '';
    public string $city = '';
}

final class User {
    public string $firstName = '';
    public string $email = '';
    public ?Address $address = null;
}

ValidationRegistry::register(Address::class, static fn (Address $address): array => [
    (new StringValidator('Street', 'street'))->min(3)->max(120),
    (new StringValidator('City', 'city'))->min(2)->max(80),
]);

ValidationRegistry::register(User::class, static fn (User $user): array => [
    (new StringValidator('First name', 'firstName'))->min(2)->max(50),
    (new EmailValidator('Email', 'email'))->length(6, 180),
    new ObjectValidator('address', Address::class),
]);

$user = new User();
$user->firstName = 'A';
$user->email = 'not-an-email';

$errors = ValidationHandler::validate($user);
print_r($errors);
```

The library is intentionally lightweight, reusable, and framework-agnostic while still supporting the kinds of nested validation patterns common in real-world PHP applications.
