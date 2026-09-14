---
title: Fluent API overview
description: Configure Fynix rules with the public immutable fluent API.
---


Fynix rules are configured through an immutable fluent API. Start with a rule from the `Rule` facade, then chain constraints that describe the value or object field you want to validate.

```php
use Fynix\Rule;

$email = Rule::email('email')
    ->required()
    ->max(180);

$error = $email->validate('not-an-email');
```

Each configuration method returns a new rule. The original rule is unchanged, which makes it safe to reuse a base definition:

```php
$baseName = Rule::string('name')->min(2)->max(80);
$requiredName = $baseName->required();
$optionalName = $baseName->optional();
```

## Choose the binding style

Use a standalone rule when you already have a scalar value:

```php
$error = Rule::string('firstName')
    ->min(2)
    ->validate('A');
```

Use `Rule::for($object)` when the value belongs to an object instance:

```php
$error = Rule::for($user)
    ->string('firstName')
    ->min(2)
    ->validate();
```

Use `Rule::on(User::class)` or a `RuleSet` when defining reusable class-scoped rules:

```php
$rules = [
    Rule::on(User::class)->string('firstName')->min(2),
    Rule::on(User::class)->email('email')->max(180),
];
```

Use `ValidationHandler::validate()` when running several rules against a complete object. The handler calls the rules internally; do not add `->validate()` inside its rules array.

## Method groups

| Group | Methods | Use for |
| --- | --- | --- |
| Presentation | `label()` | Human-readable error labels |
| Presence | `required()`, `optional()` | Empty and missing values |
| Bounds | `min()`, `max()`, `length()` | Length, numeric, or collection limits |
| Value sets | `in()`, `notIn()` | Allow-lists and deny-lists |
| Cross-field | `sameAs()`, `differentFrom()` | Comparing fields on one object |
| Conditional presence | `requiredIf()`, `requiredUnless()` | Requiring fields based on another field or closure |
| Conditional prohibition | `prohibitedIf()`, `prohibitedUnless()` | Rejecting fields based on a field or closure |
| Conditional execution | `when()` | Running a complete validator only when a closure matches |
| Pipeline controls | `genericValidation()`, `withoutGenericValidation()` | Shared validation behavior |
| Execution | `validate()`, `validateAll()` | Running one rule |

Every method is documented in detail in this section. See [Rules, RuleSet, and registry](../rules-and-registry) for construction and registration, or begin with [label()](./label).

Conditional methods accept either a field/value pair or a closure receiving the
object being validated. `sameAs()` and `differentFrom()` accept closures that
return the comparison value. Use [`when()`](./when) to conditionally skip the
entire validator pipeline.
