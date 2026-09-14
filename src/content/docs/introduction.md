---
id: introduction
title: Introduction
description: Install Fynix v3 and validate PHP DTOs, nested objects, arrays, and structured input with clear, immutable rules.
sidebar_position: 1
---


Fynix is a framework-agnostic PHP validation engine for DTOs, request objects, files, arrays, and deeply nested object graphs. It is designed for modern PHP applications that need clear validation rules, structured error reports, and fluent type-safe configuration.

## Why Fynix

Fynix keeps validation explicit and composable:

- immutable rule configuration through fluent methods
- strong separation between rule construction and runtime validation
- validatable DTOs, nested objects, and arrays of objects
- structured error objects for APIs and string output for forms
- no public constructor-based validator instantiation in v3

## Installation

```bash
composer require bishalshrestha/fynix
```

Fynix requires PHP 8.1 or newer.

## What's new in v3.1

Fynix v3.1 adds closure-based conditions, a `when()` method for conditional
validators, and a compatibility builder for v2 rule definitions. Registered
rules can also read declared public, protected, and private DTO properties.

Use `when()` when the whole rule should run only for a matching object:

```php
$companyName = Rule::for($order)
    ->string('companyName')
    ->min(10)
    ->when(static fn (Order $order): bool => $order->shippingMethod === 'business');
```

Conditional methods also accept a closure that receives the object being
validated:

```php
$internationalCode = Rule::on(Order::class)
    ->string('internationalCode')
    ->optional()
    ->requiredIf(
        static fn (Order $order): bool =>
            $order->shippingMethod === 'business' && $order->isInternational,
    );
```

For existing v2 definitions, `Rules::for()` and `RuleBuilder` remain available
as a compatibility layer. New definitions should use `RuleSet`:

```php
use Fynix\Rules;

$rules = Rules::for(Order::class)
    ->string('shippingMethod')
    ->required()
    ->rules();
```

## The v3 workflow

Fynix v3 has three primary layers:

1. Define rules with `Rule`, `Rule::on()`, or `RuleSet`.
2. Register them with `ValidationRegistry` when you want reusable DTO rules.
3. Validate objects through `ValidationHandler`.

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

This keeps validation rules close to the class they belong to while preserving a single validation engine at the application boundary.

## Choose a validation style

Use a standalone rule when you have a value, but no object:

```php
use Fynix\Rule;

$error = Rule::string('firstName')
    ->min(2)
    ->validate('A');
```

Here the rule is not bound to an object, so `validate()` receives the value to check.

Use `validateAll()` instead of `validate()` when a field can produce multiple issues:

```php
$errors = Rule::password('password')
    ->length(8, 64)
    ->validateAll('abc');
```

When the value belongs to the current object, use `Rule::for($this)` for the same standalone checks:

```php
final class User
{
    public string $firstName = '';
    public string $password = '';

    public function firstNameError(): ?ValidationError
    {
        return Rule::for($this)
            ->string('firstName')
            ->min(2)
            ->max(50)
            ->validate();
    }

    public function passwordErrors(): array
    {
        return Rule::for($this)
            ->password('password')
            ->length(8, 64)
            ->validateAll();
    }
}
```

Because `Rule::for($this)` is bound to the object, both methods read their values from `$this`; you do not pass `$this->firstName` or `$this->password` to `validate()` or `validateAll()`.

Use `ValidationHandler` when validating an object with several rules. The handler calls the rules internally, so do not add `->validate()` to the rules array:

```php
use Fynix\Rule;
use Fynix\ValidationHandler;

$user = new User();
$user->firstName = '';
$user->email = 'not-an-email';

$errors = ValidationHandler::validate(
    $user,
    rules: [
        Rule::for($user)->string('firstName')->min(2)->max(50),
        Rule::for($user)->email('email')->max(180),
    ],
);
```

The handler calls these rules internally, so do not add `->validate()` to the rules array. `Rule::for($user)` binds each rule to one object instance.

For a domain-specific rule, extend `ValidatorBase`. Pass `$this` into `ValidationError` to keep the validator metadata attached, and use `$this->name` for the field's display label:

```php
use Fynix\ValidationError;
use Fynix\Validators\ValidatorBase;

final class EvenNumberValidator extends ValidatorBase
{
    protected function validateValue(mixed $fieldValue): ?ValidationError
    {
        if (!is_int($fieldValue) || $fieldValue % 2 !== 0) {
            return new ValidationError($this, "$this->name must be even.", 'number.even');
        }

        return null;
    }
}
```

If `rules:` is supplied, it takes precedence over the registry. If it is omitted, the handler uses the registered rules.

For a reusable class-level definition, put the rules in one method and call that method from a separate validation method:

```php
use Fynix\Rule;
use Fynix\ValidationHandler;

final class User
{
    public string $firstName = '';
    public string $email = '';

    public static function rules(): array
    {
        return [
            Rule::on(self::class)->string('firstName')->min(2)->max(50),
            Rule::on(self::class)->email('email')->max(180),
        ];
    }

    public function validationErrors(): array
    {
        return ValidationHandler::validate($this, rules: self::rules());
    }
}

$user = new User();
$user->firstName = '';
$user->email = 'not-an-email';

$errors = $user->validationErrors();
```

`Rule::on(self::class)` defines reusable class-scoped rules. The separate `validationErrors()` method supplies those rules to the handler for the current object. For a rule built directly from an object, use `Rule::for($this)`; `Rule::on($this)` is not valid because `on()` expects a class name, not an object.

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

Nested rules are resolved recursively. Use `optional()` when a nested object may be absent.

## Structured errors and flattening

By default, `ValidationHandler::validate()` returns string messages. Use a named argument to keep `ValidationError` objects instead:

```php
$errors = ValidationHandler::validate(
    $customer,
    flattenErrorToString: false
);
```

For UI form binding or JSON APIs, flatten nested output with dot notation:

```php
$flat = ValidationHandler::validateAndFlatten($customer);
// address.city => "City is required."
```

## Extend the validation engine

When a domain rule is specific to your application, extend `ValidatorBase` and keep the custom check inside the same validation pipeline. Pass `$this` to `ValidationError` so Fynix retains the validator and field metadata, and use `$this->name` for the human-readable label configured by the rule.

```php
use Fynix\ValidationError;
use Fynix\Validators\ValidatorBase;

final class EvenNumberValidator extends ValidatorBase
{
    protected function validateValue(mixed $fieldValue): ?ValidationError
    {
        if (!is_int($fieldValue) || $fieldValue % 2 !== 0) {
            return new ValidationError(
                $this,
                "$this->name must be even.",
                'number.even',
            );
        }

        return null;
    }
}
```

The base class still handles requiredness, normalization, common constraints, labels, and structured error output. Your subclass only supplies the domain-specific rule.

## Next steps

- Learn the [v3 rule and registry API](/reference/rules-and-registry).
- Browse the [validator overview](/reference/validators).
- Read about [nested and batch validation](/reference/advanced-patterns).
- See [handler and error output](/reference/validation-handler).