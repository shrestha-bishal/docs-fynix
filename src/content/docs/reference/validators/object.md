---
title: ObjectValidator
description: Validate a nested DTO through the rules registered for its class.
---


Use `ObjectValidator` when one DTO contains another DTO or domain object.

## Create a rule

```php
Rule::object(string $field, string $targetClass): ObjectValidator
```

## Methods

| Method | Description |
| --- | --- |
| `required(bool $required = true)` | Require the nested object. |
| `optional()` | Allow the nested object to be missing. |
| `requiredState()` | Read the current requiredness. |

## Example

```php
use Fynix\RuleSet;
use Fynix\ValidationRegistry;

ValidationRegistry::register(User::class, static fn (RuleSet $rules): array => [
    $rules->object('address', Address::class),
]);
```

The nested class must have rules registered with `ValidationRegistry`. Fynix verifies the object type and then delegates validation to that class's rules.