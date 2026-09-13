---
id: examples/arrays
title: Array and collection validation
description: Validate arrays, collection size, and every item with Fynix.
sidebar:
  order: 3
---

Fynix supports both plain arrays and collections of typed DTOs. Validate the collection shape first, then add item rules or object rules when needed.

## Validate an array's size

```php
use Fynix\Rule;

$tags = Rule::array('tags')
    ->min(1)
    ->max(10)
    ->validate(['php', 'validation']);
```

For arrays, `min()` and `max()` count items. The limits are inclusive.

## Validate every scalar item

```php
$tags = Rule::arrayOf('tags')
    ->min(1)
    ->max(10)
    ->each(Rule::string('tag')->length(2, 30));

$errors = $tags->validateAll(['php', '']);
```

Use `arrayOf()` with `each()` when every item shares the same scalar rule.

## Numeric collections

```php
$quantities = Rule::arrayOf('quantities')
    ->each(Rule::integer('quantity')->min(1)->max(999));

$errors = $quantities->validateAll([2, 0, 4]);
```

The item rule runs for every value in the collection.

## Optional collections

```php
$attachments = Rule::arrayOf('attachments')
    ->optional()
    ->max(5)
    ->each(Rule::string('attachment')->max(255));

$errors = $attachments->validateAll(null); // []
```

Use `optional()` when the entire collection may be absent. Item rules apply only when a collection is present.

## Arrays of DTOs

```php
final class LineItem
{
    public string $sku = '';
    public int $quantity = 0;
}

$items = Rule::objectArray('items', LineItem::class)
    ->min(1)
    ->max(100);
```

Register `LineItem` rules so the handler can validate each object:

```php
ValidationRegistry::register(
    LineItem::class,
    static fn (RuleSet $rules): array => [
        $rules->string('sku')->length(3, 30),
        $rules->integer('quantity')->min(1)->max(999),
    ],
);

$errors = ValidationHandler::validate($order);
```

The handler preserves item indexes in the nested error output.

## Choosing the collection rule

- Use `array()` when only the collection itself needs validation.
- Use `arrayOf()` with `each()` for repeated scalar values.
- Use `objectArray()` for repeated typed DTOs.
- Use `ValidationHandler` when collection items have registered nested rules.
