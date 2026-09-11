---
title: Rule, RuleSet, and registry
description: Build immutable v3 rules and register them for DTO validation.
---

# Rule, RuleSet, and registry

Version 3 uses three related construction APIs. `Rule` is the public standalone facade, `Rule::on()` returns a class-scoped facade, and `RuleSet` is the facade supplied to registry factories.

## Standalone rules

```php
use Fynix\Rule;

$email = Rule::email('email')->max(255);
$age = Rule::integer('age')->min(18)->max(120);
$code = Rule::regex('code', '/^[A-Z]{3}-[0-9]{4}$/');
```

Use standalone rules for isolated form fields or request values.

## Scoped rules

```php
use Fynix\Rule;

$rule = Rule::on(User::class)
    ->string('firstName')
    ->min(2)
    ->max(50);
```

The owner class must exist and the property must be declared. Missing properties throw `UndeclaredPropertyException`; missing classes throw `UnknownClassException`.

## Registry factories

```php
use Fynix\RuleSet;
use Fynix\ValidationRegistry;

ValidationRegistry::register(
    User::class,
    static fn (RuleSet $rules): array => [
        $rules->string('firstName')->min(2)->max(50),
        $rules->email('email')->max(255),
        $rules->password('password')->min(8)->max(128),
    ]
);
```

`ValidationRegistry::register()` accepts a `Closure(RuleSet): array`. Each returned value must implement `Validatable`. Retrieve definitions with `ValidationRegistry::rulesFor()` and clear them with `ValidationRegistry::clear()`.

## Immutable configuration

Every fluent method returns a clone. Keep chaining, or reassign the result:

```php
use Fynix\Rule;

$rule = Rule::string('name');
$rule = $rule->min(2);
$rule = $rule->max(80);
```

The old mutable constructor style and `Rules::for()`/`RuleBuilder` API were removed in v3.

## Common constraints

| Method | Purpose |
| --- | --- |
| `label(string $label)` | Override the generated field label. |
| `required()` / `optional()` | Control missing-value behavior. |
| `in(array $values)` / `notIn(array $values)` | Allow or reject exact values. |
| `sameAs(string $field)` / `differentFrom(string $field)` | Compare fields in a registered object. |
| `requiredIf(string $field, mixed $value)` | Require a field when another field matches. |
| `requiredUnless(string $field, mixed $value)` | Require a field when another field does not match. |
| `prohibitedIf(string $field, mixed $value)` | Reject a value when another field matches. |
| `prohibitedUnless(string $field, mixed $value)` | Reject a value when another field does not match. |
| `validateField(mixed $value, ?object $data = null)` | Return the first error. |
| `validateFieldAll(mixed $value, ?object $data = null)` | Return all applicable errors. |

For combined rules, see [composable rules](./composable-rules).