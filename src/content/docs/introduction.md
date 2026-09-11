---
id: introduction
title: Introduction
description: Install Fynix v3 and validate PHP DTOs, nested objects, and structured input.
sidebar_position: 1
---

# Fynix v3

Fynix is a framework-agnostic PHP validation engine for typed DTOs, request objects, files, collections, and nested object graphs.

## Installation

```bash
composer require bishalshrestha/fynix
```

Fynix requires PHP 8.1 or newer.

## The three-step workflow

1. Define rules through `RuleSet`.
2. Register the rule factory with `ValidationRegistry`.
3. Validate a DTO with `ValidationHandler`.

```php
<?php

use Fynix\RuleSet;
use Fynix\ValidationHandler;
use Fynix\ValidationRegistry;

final class User
{
    public string $firstName = '';
    public string $email = '';
}

ValidationRegistry::register(
    User::class,
    static fn (RuleSet $rules): array => [
        $rules->string('firstName')->min(2)->max(50),
        $rules->email('email')->max(180),
    ]
);

$user = new User();
$user->firstName = 'A';
$user->email = 'not-an-email';

$errors = ValidationHandler::validate($user);
```

Registry factories receive a `RuleSet`, not the DTO instance. Fynix v3 creates rules through `Rule`, `Rule::on()`, and `RuleSet`; direct validator constructors are no longer public.

## Validate a single field

```php
use Fynix\Rule;

$error = Rule::string('firstName')
    ->min(2)
    ->validateField('A');
```

Use `validateFieldAll()` when a field can report multiple failures, such as a password:

```php
$errors = Rule::password('password')
    ->length(8, 64)
    ->validateFieldAll('abc');
```

## Nested DTOs

```php
final class Address
{
    public string $city = '';
}

final class Customer
{
    public ?Address $address = null;
}

ValidationRegistry::register(
    Address::class,
    static fn (RuleSet $rules): array => [
        $rules->string('city')->min(2)->max(80),
    ]
);

ValidationRegistry::register(
    Customer::class,
    static fn (RuleSet $rules): array => [
        $rules->object('address', Address::class),
    ]
);
```

Nested rules are resolved recursively. Use `$rules->object(...)->optional()` when the nested value may be absent.

## Flatten errors

```php
$errors = ValidationHandler::validateAndFlatten($customer);
// address.city => "City is required."
```

For machine-readable responses, call `ValidationHandler::validate($customer, false)` and serialize each `ValidationError` with `toArray()`.

## Next steps

- Learn the [v3 rule and registry API](/reference/rules-and-registry).
- Browse the [validator overview](/reference/validators).
- Read about [nested and batch validation](/reference/advanced-patterns).
- See [handler and error output](/reference/validation-handler).