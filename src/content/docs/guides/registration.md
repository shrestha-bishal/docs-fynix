---
id: registration
title: Build a registration validator
description: Create a complete Fynix v3 registration flow with nested DTOs, conditional rules, and structured errors.
sidebar_position: 2
---


This guide walks through a realistic registration flow with a nested address object, conditional business rules, password validation, and API-friendly structured errors. It uses only Fynix v3's public APIs.

## 1. Install Fynix

```bash
composer require bishalshrestha/fynix
```

Fynix v3 requires PHP 8.1 or newer.

## 2. Define the DTOs

Keep the DTO explicit and typed. Fynix validates object properties by name, so each property should have a clear shape and a sensible default value.

```php
final class Address
{
    public string $street = '';
    public string $city = '';
    public string $postalCode = '';
}

final class Registration
{
    public string $accountType = 'personal';
    public string $email = '';
    public string $password = '';
    public string $passwordConfirmation = '';
    public ?string $companyName = null;
    public ?Address $address = null;
}
```

## 3. Register the rules

Register the nested `Address` rules first. Then register the parent `Registration` rules and delegate object validation to the nested class registration.

```php
use Fynix\RuleSet;
use Fynix\ValidationRegistry;

ValidationRegistry::register(
    Address::class,
    static fn (RuleSet $rules): array => [
        $rules->string('street')->length(3, 120),
        $rules->string('city')->length(2, 80),
        $rules->string('postalCode')->regex('/^[A-Z0-9 -]{3,12}$/'),
    ],
);

ValidationRegistry::register(
    Registration::class,
    static fn (RuleSet $rules): array => [
        $rules->string('accountType')->in(['personal', 'business']),
        $rules->email('email')->max(254),
        $rules->password('password')->length(12, 128),
        $rules->string('passwordConfirmation')->sameAs('password'),
        $rules->string('companyName')
            ->optional()
            ->requiredIf('accountType', 'business'),
        $rules->object('address', Address::class),
    ],
);
```

Rules are immutable. Each chaining method returns a configured clone, keeping the API predictable and safe across reuse.

## 4. Validate the request

Populate the DTO from your request mapper, then validate it at the application boundary.

```php
use Fynix\ValidationHandler;

$registration = new Registration();
$registration->accountType = 'business';
$registration->email = 'not-an-email';
$registration->password = 'short';
$registration->passwordConfirmation = 'different';
$registration->address = new Address();
$registration->address->city = 'A';

$errors = ValidationHandler::validate($registration);

if ($errors !== []) {
    // return a 422 response, render a form, or map messages to your framework
}
```

The default result is a nested structure of strings:

```php
[
    'email' => 'Email must be a valid email address.',
    'password' => 'Password must be at least 12 characters.',
    'passwordConfirmation' => 'Password Confirmation must be the same as Password.',
    'companyName' => 'Company Name is required.',
    'address' => [
        'street' => 'Street is required.',
        'city' => 'City must be at least 2 characters.',
    ],
]
```

## 5. Flatten errors for forms

When your template engine expects flat keys, flatten the nested payload:

```php
$flatErrors = ValidationHandler::validateAndFlatten($registration);

// address.street => "Street is required."
// address.city => "City must be at least 2 characters."
```

This is ideal for HTML forms and other UI layers that prefer dot-notation keys.

## 6. Return structured API errors

For JSON APIs, keep the structured `ValidationError` objects instead of string output:

```php
$errors = ValidationHandler::validate(
    $registration,
    flattenErrorToString: false,
);

$response = [];
foreach ($errors as $field => $issues) {
    foreach ((array) $issues as $issue) {
        $response[] = $issue->toArray();
    }
}
```

Each serialized error includes the field, rule, message, machine-readable code, and parameters. This is the most stable format for client libraries and API clients.

## 7. Validate a single field

For a form or request value that does not need a registered DTO, use `Rule` directly:

```php
use Fynix\Rule;

$error = Rule::email('email')->validate('not-an-email');

$allPasswordErrors = Rule::password('password')
    ->length(12, 128)
    ->validateAll('short');
```

Use `Rule::on(Registration::class)` when you want class-scoped rule construction and `Rule::for($registration)` when you want to validate a property on a concrete instance. Use `ValidationRegistry` and `ValidationHandler` when you are validating a reusable DTO or a model graph.
