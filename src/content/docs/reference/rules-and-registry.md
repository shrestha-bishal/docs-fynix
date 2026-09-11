---
title: Rules and registry
description: Learn how to register validation rules, build rule sets with the fluent API, and validate complex objects consistently.
---

# Rules and registry

The registry is the foundation of object-based validation in Fynix. It centralizes the relationship between a class and the rules that validate it.

## `nameof()` helper

PHP does not have a native `nameof()` operator, so Fynix provides a small helper that checks that the property exists on a class before you use it.

```php
use function Fynix\nameof;

$property = nameof(User::class, 'email');
```

If the property is missing, the helper throws an `InvalidArgumentException` immediately.

This is especially useful when you are building large DTO validations and want to fail early on typos.

## Fluent rule builder

The simplest way to define validation rules for a DTO is the fluent builder:

```php
use Fynix\Rules;
use Fynix\Validators\EmailValidator;
use function Fynix\nameof;

$rules = Rules::for(User::class)
    ->string(nameof(User::class, 'firstName'))
    ->min(2)
    ->max(50)
    ->email(nameof(User::class, 'email'))
    ->length(6, 180)
    ->rules();
```

### `RuleBuilder` method reference

```php
public static function for(string $className): RuleBuilder
public function string(string $propertyName): static
public function number(string $propertyName): static
public function email(string $propertyName): static
public function username(string $propertyName): static
public function phone(string $propertyName): static
public function password(string $propertyName): static
public function image(string $propertyName): static
public function images(string $propertyName): static
public function object(string $propertyName, string $className): static
public function objectArray(string $propertyName, string $className): static
public function min(int|float $value): static
public function max(int|float $value): static
public function length(int $min, int $max): static
public function isRequired(bool $required = true): static
public function required(): static
public function optional(): static
public function verifyDomain(bool $enabled = true): static
public function uniqueUsing(callable $checker): static
public function maxFileSizeMB(int $megabytes): static
public function rules(): array
```

### Builder semantics

- Every builder method creates a validator instance and stores it as the current rule.
- Configuration methods such as `min()`, `max()`, `optional()`, and `uniqueUsing()` mutate the most recently added validator.
- `rules()` returns the rule list as an array, ready to pass into `ValidationRegistry::register()` or to use directly in a validation workflow.
- If you call a constraint before creating a validator, the builder throws `InvalidArgumentException`.
- `object()` and `objectArray()` are especially important for nested DTO and collection validation.

### Constraint methods

- `min()`
- `max()`
- `length()`
- `isRequired()` / `required()` / `optional()`
- `verifyDomain()`
- `uniqueUsing()`
- `maxFileSizeMB()`

### Example with nested DTOs

```php
use Fynix\Rules;
use function Fynix\nameof;

$rules = Rules::for(User::class)
    ->string(nameof(User::class, 'firstName'))
    ->min(2)
    ->max(60)
    ->email(nameof(User::class, 'email'))
    ->length(6, 180)
    ->object(nameof(User::class, 'address'), Address::class)
    ->rules();
```

## Registering rules

Once a rule set is built, you register it using `ValidationRegistry::register()`.

```php
use Fynix\ValidationRegistry;
use Fynix\Rules;
use function Fynix\nameof;

ValidationRegistry::register(User::class, static fn (User $user): array => [
    (new StringValidator('First name', 'firstName'))->min(2)->max(60),
    (new EmailValidator('Email', 'email'))->length(6, 180),
    new ObjectValidator('address', Address::class),
]);
```

### `ValidationRegistry` method reference

```php
public static function register(string $className, callable $resolver): void
public static function getResolver(string $className): callable
public static function getRules(string $className, object $instance): array
public static function clearCache(): void
```

### Registry rules

- `register()` stores a resolver for a specific class.
- `getResolver()` retrieves the stored callable for a class.
- `getRules()` executes the resolver with the current instance and returns the validation rule array.
- `clearCache()` resets the registry; this is useful in tests and isolated application bootstrap scenarios.

If you prefer the fluent builder, you can do:

```php
ValidationRegistry::register(
    User::class,
    Rules::for(User::class)
        ->string(nameof(User::class, 'firstName'))
        ->min(2)
        ->max(60)
        ->email(nameof(User::class, 'email'))
        ->length(6, 180)
);
```

## Why use a registry?

The registry lets the library resolve validation rules by class rather than manually validating each field in controllers. This is particularly important for nested object trees and DTO graphs.

When a `ObjectValidator` sees a nested property, it resolves the registered rules for that class and validates it recursively.

## Rule registration pattern for real applications

A common pattern is to centralize registration in a bootstrapper or service provider:

```php
<?php

use Fynix\ValidationRegistry;
use Fynix\Validators\EmailValidator;
use Fynix\Validators\ObjectValidator;
use Fynix\Validators\StringValidator;

final class ValidationRuleProvider
{
    public static function register(): void
    {
        ValidationRegistry::register(Address::class, static fn (Address $address): array => [
            (new StringValidator('Street', 'street'))->min(3)->max(120),
            (new StringValidator('City', 'city'))->min(2)->max(80),
        ]);

        ValidationRegistry::register(User::class, static fn (User $user): array => [
            (new StringValidator('First name', 'firstName'))->min(2)->max(50),
            (new EmailValidator('Email', 'email'))->length(6, 180),
            new ObjectValidator('address', Address::class),
        ]);
    }
}
```

This keeps validation reusable and decoupled from your application views or controllers.

## Best practices

- Register rules once at boot time or service provider startup.
- Use `nameof()` whenever you reference a class property.
- Keep nested DTOs small and cohesive.
- Put business-specific validation rules in the registry rather than ad hoc checks in controllers.
- Reuse registered rules across forms and APIs.

The registry is not just an implementation detail -it is the structured path that makes Fynix scalable from a single form to a complex object graph.
