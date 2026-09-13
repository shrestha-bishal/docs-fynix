---
title: ObjectArrayValidator
description: Validate arrays of nested DTOs with collection size limits.
---


Use `ObjectArrayValidator` for line items, addresses, attachments, and other collections of typed objects.

## Create a rule

```php
Rule::objectArray(string $field, string $targetClass): ObjectArrayValidator
```

## Methods

| Method | Description |
| --- | --- |
| `min(int $items)` | Set the minimum item count. |
| `max(int $items)` | Set the maximum item count. |
| `minItems()` | Read the configured minimum. |
| `maxItems()` | Read the configured maximum. |
| `required(bool $required = true)` | Require the collection. |
| `optional()` | Allow the collection to be missing. |
| `requiredState()` | Read the current requiredness. |

## Example

```php
use Fynix\RuleSet;

ValidationRegistry::register(Order::class, static fn (RuleSet $rules): array => [
    $rules->objectArray('items', Item::class)
        ->min(1)
        ->max(50),
]);
```

Every item must be an instance of the configured class and that class must have registered rules. Nested errors can be flattened to keys such as `items.0.name`.