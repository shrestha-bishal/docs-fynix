---
id: examples/nested-order
title: Nested order validation
description: Validate an order with nested address and line-item DTOs using Fynix v3.
sidebar:
  order: 3
---


Object rules become especially valuable when a request contains collections of typed DTOs. The parent validates the shape, while each child resolves its own registered rules.

## DTOs

```php
final class LineItem
{
    public string $sku = '';
    public int $quantity = 0;
}

final class Order
{
    public string $reference = '';

    /** @var list<LineItem> */
    public array $items = [];
}
```

## Rules

```php
use Fynix\RuleSet;
use Fynix\ValidationHandler;
use Fynix\ValidationRegistry;

ValidationRegistry::register(
    LineItem::class,
    static fn (RuleSet $rules): array => [
        $rules->string('sku')->length(3, 30),
        $rules->integer('quantity')->min(1)->max(999),
    ],
);

ValidationRegistry::register(
    Order::class,
    static fn (RuleSet $rules): array => [
        $rules->string('reference')->length(8, 40),
        $rules->objectArray('items', LineItem::class)->min(1)->max(100),
    ],
);
```

## Invalid input

```php
$order = new Order();
$order->reference = 'A';
$order->items = [
    (function (): LineItem {
        $item = new LineItem();
        $item->sku = 'AB';
        $item->quantity = 0;
        return $item;
    })(),
];

$errors = ValidationHandler::validateAndFlatten($order);
```

## Returned result

```php
[
    'reference' => 'Reference is too short. This field must be at least 8 characters.',
    'items.0.sku' => 'Sku is too short. This field must be at least 3 characters.',
    'items.0.quantity' => 'Quantity must be at least 1.',
]
```

The `items.0.*` keys can be bound directly to repeated form rows or returned as field paths in an API response.
