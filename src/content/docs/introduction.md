---
id: introduction
title: Introduction
sidebar_position: 1
---

# Fynix -Modern validation for PHP DTOs and nested object graphs

Fynix is a framework-agnostic PHP validation library built for real-world applications that need more than simple scalar checks. It validates primitive values, uploaded files, nested DTOs, arrays of objects, and deeply structured domain models without forcing you into a specific framework.

Whether you are building an API, a form workflow, an import pipeline, or a domain service layer, Fynix gives you a consistent way to express rules, validate objects, and normalize errors for client output.

---

## Why Fynix?

Many validation libraries stop at basic field validation. Fynix is designed for the next layer:

- validating nested object properties and DTO graphs
- validating arrays of domain objects
- reusing validation rules centrally via a registry
- returning consistent structured errors for forms and APIs
- staying fast, explicit, and framework-agnostic

The result is a validation layer that remains clear as your app grows from simple forms to enterprise-grade domain models.

## Core strengths

- Primitive validation for strings, numbers, emails, usernames, passwords, and phone numbers
- File validation for single and multiple uploaded images
- Object validation for nested DTOs and domain models
- Array validation for collections of related objects
- Reusable class-level validation registration through `ValidationRegistry`
- Error flattening for form binding and JSON API responses
- Fluent configuration for expressive builder-style rule definitions

---

## Installation

Install with Composer:

```bash
composer require bishalshrestha/fynix
```

The library requires PHP 8.1 or newer and follows PSR-4 autoloading.

---

## Quick start

Define a DTO and register validation rules:

```php
<?php

use Fynix\ValidationRegistry;
use Fynix\ValidationHandler;
use Fynix\Validators\EmailValidator;
use Fynix\Validators\ObjectValidator;
use Fynix\Validators\StringValidator;

final class Address
{
    public string $street = '';
    public string $city = '';
}

final class User
{
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
$user->address = new Address();

$errors = ValidationHandler::validate($user);
print_r($errors);
```

You will receive a nested validation result structure, and you can flatten it when you need a form-friendly or API-friendly key layout.

---

## Common validation patterns

### Direct field validation

```php
use Fynix\Validators\StringValidator;

$error = (new StringValidator('First name', 'firstName'))
    ->min(2)
    ->max(50)
    ->validateField('A');
```

This is useful when validating an individual form field or a single request value.

### Validating all applicable errors on a field

```php
use Fynix\Validators\PasswordValidator;

$errors = (new PasswordValidator('Password', 'password'))
    ->validateFieldAll('abc');
```

This returns every applicable password error instead of only the first one.

### Validating nested objects

```php
use Fynix\ValidationHandler;

$errors = ValidationHandler::validate($dto);
```

Objects are resolved recursively through the registry, so nested validation rules remain reusable and consistent.

### Flattening errors for forms and APIs

```php
use Fynix\ValidationHandler;

$flat = ValidationHandler::flattenValidationErrors($errors);
```

This converts nested keys into a dot-notated structure such as `address.city`.

---

## Built-in validator categories

Fynix includes validators for:

- strings
- numbers
- emails
- phone numbers
- usernames
- passwords
- single images
- multiple images
- nested objects
- arrays of nested objects

See the validator reference pages for the complete API and examples.

---

## Recommended architecture

For medium and large applications, the strongest pattern is:

1. Create a DTO or request model.
2. Define validation rules for the class in `ValidationRegistry`.
3. Validate the object in a service or controller boundary.
4. Convert errors to a flat structure for UI or API output.

This gives you a clean separation between domain data and validation logic while keeping the codebase easy to extend.

---

## Example real-world use case

A checkout or order DTO may contain nested items and addresses, each with their own validation rules.

```php
final class Order
{
    public string $customerName = '';
    public array $items = [];
    public ?Address $deliveryAddress = null;
}
```

Fynix can validate all of the following together:

- required customer name
- valid email and phone data
- minimum and maximum array sizes
- nested address validation
- per-item validation in `items[]`

That is exactly where Fynix is most valuable.

---

## When to use Fynix

Use Fynix when you need:

- validation that matches domain model structure
- reusable validation logic across APIs and forms
- nested and object-based validation without framework coupling
- consistent, structured validation errors

It is a strong choice for PHP applications that care about correctness, maintainability, and clear validation boundaries.

---

## Next steps

- Read the [reference overview](/reference/overview)
- Explore the [built-in validators](/reference/validators)
- Learn the [rules and registry pattern](/reference/rules-and-registry)
- See how [ValidationHandler and errors](/reference/validation-handler) work in practice
- Review [advanced patterns](/reference/advanced-patterns) for complex DTO graphs

Fynix is intentionally compact, but its rules and orchestration layer scale well from small forms to large domain-driven applications.
