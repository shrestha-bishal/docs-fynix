---
title: Advanced patterns
description: Use nested DTOs, arrays, conditional constraints, listeners, and batch validation in Fynix v3.
---

# Advanced patterns

## Arrays of DTOs

```php
final class Item
{
    public string $name = '';
}

final class Order
{
    /** @var list<Item> */
    public array $items = [];
}

ValidationRegistry::register(
    Item::class,
    static fn (RuleSet $rules): array => [
        $rules->string('name')->min(2)->max(80),
    ]
);

ValidationRegistry::register(
    Order::class,
    static fn (RuleSet $rules): array => [
        $rules->objectArray('items', Item::class)->min(1)->max(50),
    ]
);
```

Errors can be flattened to keys such as `items.0.name`.

## Arrays of scalar values

Use `ArrayValidator::each()` when every item in a plain array has the same rule:

```php
use Fynix\Rule;

$tags = Rule::arrayOf('tags')
    ->min(1)
    ->max(10)
    ->each(Rule::string('tag')->length(2, 30));
```

## Conditional and cross-field rules

```php
ValidationRegistry::register(
    Registration::class,
    static fn (RuleSet $rules): array => [
        $rules->string('accountType')->in(['personal', 'business']),
        $rules->string('companyName')
            ->optional()
            ->requiredIf('accountType', 'business'),
        $rules->string('passwordConfirmation')->sameAs('password'),
        $rules->string('nickname')->prohibitedIf('accountType', 'business'),
    ]
);
```

Available conditional methods are `requiredIf()`, `requiredUnless()`, `prohibitedIf()`, and `prohibitedUnless()`. Related-field methods are `sameAs()` and `differentFrom()`.

## Reusable value constraints

```php
use Fynix\Rule;

$status = Rule::string('status')
    ->in(['draft', 'published'])
    ->notIn(['archived']);
```

## Batch validation

```php
use Fynix\ValidationHandler;

$results = ValidationHandler::validateMany($firstUser, $secondUser);
$namedResults = ValidationHandler::validateManyAssoc([
    'first' => $firstUser,
    'second' => $secondUser,
]);
```

## Validation listeners

Implement `ValidationListener` when you need logging, metrics, or tracing around validation:

```php
ValidationHandler::addListener($listener);
$errors = ValidationHandler::validate($order);
ValidationHandler::clearListeners();
```

Listeners receive the instance before validation and the resulting errors afterward.

## Cyclic object graphs

Fynix tracks visited object instances while traversing nested DTOs. Self-referencing graphs therefore stop safely instead of recursing forever.