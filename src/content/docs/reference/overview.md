---
title: Reference overview
description: Understand the v3 building blocks of the Fynix validation engine.
---

# Reference overview

Fynix v3 separates rule construction from validation. Use `Rule` for standalone fields, `Rule::on()` or `RuleSet` for DTO-owned fields, and `ValidationHandler` when validating a complete object graph.

## The v3 flow

1. Create rules through `Rule`, `Rule::on()`, or a `RuleSet` factory.
2. Configure rules with immutable fluent methods.
3. Register DTO rules with `ValidationRegistry` when validating objects.
4. Call `ValidationHandler::validate()` at the application boundary.
5. Return strings for simple forms or `ValidationError` objects for API responses.

## Construction APIs

```php
use Fynix\Rule;

$standalone = Rule::string('firstName')->min(2)->max(50);
$scoped = Rule::on(User::class)->email('email')->max(255);
```

`Rule::on()` checks that the owner class and property exist. Direct validator constructors and the removed `Rules::for()` builder are not part of v3's public API.

## Registry API

```php
use Fynix\RuleSet;
use Fynix\ValidationRegistry;

ValidationRegistry::register(
    User::class,
    static fn (RuleSet $rules): array => [
        $rules->string('firstName')->min(2)->max(50),
        $rules->email('email')->max(255),
    ]
);
```

The registry factory receives a `RuleSet`, not a DTO instance. It returns `Validatable` rules for the registered class.

## Core classes

| Class | Responsibility |
| --- | --- |
| `Rule` | Construct standalone and scoped validators. |
| `ScopedRule` | Validate owner classes and declared properties while constructing rules. |
| `RuleSet` | Create scoped rules inside registry factories. |
| `ValidationRegistry` | Store and retrieve class rule definitions. |
| `ValidationHandler` | Validate objects, nested DTOs, arrays, and batches. |
| `ValidationError` | Carry field, message, code, and parameters. |
| `AllOf`, `AnyOf`, `Not` | Compose reusable validation rules. |

## Validator families

Fynix includes primitive validators (`string`, `boolean`, `integer`, `decimal`, `number`), format validators (`email`, `url`, `uuid`, `ipAddress`, `regex`, `phoneNumber`, `dateTime`), collection validators (`array`, `objectArray`), upload validators (`file`, `image`, `images`), and domain validators (`password`, `username`, `enum`, `object`).

Continue with [Rule, RuleSet, and registry](./rules-and-registry) or browse the [validator overview](./validators).