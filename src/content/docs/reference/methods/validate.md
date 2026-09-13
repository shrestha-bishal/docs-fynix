---
title: validate()
description: Run the centralized Fynix validation pipeline and return the first error.
---

`validate()` is the primary single-error entry point for every validator. It runs requiredness, normalization, shared constraints, conditional rules, and the validator-specific type check through one pipeline.

## Standalone value

```php
use Fynix\Rule;

$error = Rule::string('firstName')
    ->min(2)
    ->max(50)
    ->validate('A');
```

The method returns a `ValidationError` when validation fails, or `null` when the value is valid.

## Object-bound value

Bind the rule to an object when the value should be read from a property:

```php
$error = Rule::for($user)
    ->string('firstName')
    ->min(2)
    ->max(50)
    ->validate();
```

The bound object is also supplied to cross-field constraints such as `sameAs()` and `requiredIf()`.

## Complete object validation

Use `ValidationHandler::validate()` when the goal is to validate every rule registered for a DTO and its nested objects:

```php
$errors = ValidationHandler::validate($user);
```

`ValidatorBase::validate()` handles one rule. `ValidationHandler::validate()` handles the complete object graph.

## Pipeline order

The rule runs shared requiredness and normalization, HTML and length checks where applicable, common constraints, conditional rules, and then the validator-specific type check. `validate()` returns only the first error from that pipeline.

```php
$rule = Rule::string('displayName')
    ->label('Display name')
    ->required()
    ->min(3);

$error = $rule->validate('A');

if ($error !== null) {
    echo $error->code;
}
```

Use `validateAll()` when the caller needs every applicable error from the same rule.
