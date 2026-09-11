---
title: Advanced patterns
description: Use nested objects, custom rules, and batch validation patterns effectively in real-world PHP applications.
---

# Advanced patterns

Fynix is designed for real-world application complexity: nested DTOs, arrays of related objects, reusable validation, and arrays of uploaded files.

## Nested DTO validation

A nested DTO is a domain object referenced as a property on another object.

```php
final class Address
{
    public string $street = '';
    public string $city = '';
}

final class User
{
    public string $firstName = '';
    public ?Address $address = null;
}
```

Register the rules like this:

```php
use Fynix\ValidationRegistry;
use Fynix\Validators\ObjectValidator;
use Fynix\Validators\StringValidator;

ValidationRegistry::register(Address::class, static fn (Address $address): array => [
    (new StringValidator('Street', 'street'))->min(3)->max(120),
    (new StringValidator('City', 'city'))->min(2)->max(80),
]);

ValidationRegistry::register(User::class, static fn (User $user): array => [
    (new StringValidator('First name', 'firstName'))->min(2)->max(50),
    new ObjectValidator('address', Address::class),
]);
```

Then validate the parent object:

```php
use Fynix\ValidationHandler;

$errors = ValidationHandler::validate($user);
```

A nested object can fail independently without losing the surrounding context.

## Arrays of objects

Use `ObjectArrayValidator` for lists such as line items, attachments, or addresses.

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
```

```php
use Fynix\ValidationRegistry;
use Fynix\Validators\ObjectArrayValidator;
use Fynix\Validators\StringValidator;

ValidationRegistry::register(Item::class, static fn (Item $item): array => [
    (new StringValidator('Name', 'name'))->min(2)->max(80),
]);

ValidationRegistry::register(Order::class, static fn (Order $order): array => [
    (new ObjectArrayValidator('items', Item::class))->min(1)->max(10),
]);
```

This keeps list validation consistent across the entire application and allows you to flatten errors such as `items.0.name`.

## Optional nested structures

Optional nested values are useful when a field is not always present.

```php
new ObjectValidator('address', Address::class)->optional();
```

This means the nested object can be missing without creating a required-field error. It is a common requirement when a frontend form includes unrelated profile sections.

## Preventing circular recursion

Fynix keeps a visitation map while validating nested objects so recursive object graphs can be detected without infinite loops.

```php
final class Node
{
    public string $name = '';
    public ?Node $child = null;
}
```

The validation engine marks objects as visited during traversal, so a self-referential object graph does not trigger infinite recursion.

## Reusable validation strategies

A good project architecture is to centralize rule registration in one place. For example:

```php
final class ValidationRules
{
    public static function register(): void
    {
        ValidationRegistry::register(User::class, static fn (User $user): array => [
            (new StringValidator('First name', 'firstName'))->min(2)->max(50),
            (new StringValidator('Email', 'email'))->length(6, 180),
        ]);
    }
}
```

Then call `ValidationRules::register()` during application bootstrap or a service-provider registration step.

## Custom validation logic

Fynix’s built-in validators are intentionally simple, but you can layer custom business validation on top of them. The most common approach is to keep custom validators as dedicated classes and register them in the class rule collection.

```php
<?php

use Fynix\ValidationError;
use Fynix\Validators\ValidatorBase;

final class CustomStatusValidator extends ValidatorBase
{
    public function __construct(string $name, string $propertyName)
    {
        parent::__construct($name, $propertyName);
    }

    public function validate(mixed $fieldValue): ?ValidationError
    {
        if (!in_array($fieldValue, ['draft', 'published', 'archived'], true)) {
            return new ValidationError($this, "$this->name must be a valid status.", 'status.invalid');
        }

        return null;
    }
}
```

Then register it the same way as any other validator:

```php
ValidationRegistry::register(Post::class, static fn (Post $post): array => [
    new CustomStatusValidator('Status', 'status'),
]);
```

This keeps validation reusable and domain-specific without coupling the business model to a framework.

## Batch validation with many objects

For a bulk operation, use `validateMany()` or `validateManyAssoc()`.

```php
use Fynix\ValidationHandler;

$results = ValidationHandler::validateMany($user1, $user2, $user3);
```

For keyed results:

```php
$results = ValidationHandler::validateManyAssoc([
    'new-user' => $user1,
    'existing-user' => $user2,
]);
```

This is useful for import jobs, batch processing, and API bulk actions.

## Error normalization for forms and APIs

A consistent format matters. For example, after validating a request object you may want to normalize errors into a JSON schema-friendly payload:

```php
$errors = ValidationHandler::validate($dto);
$normalized = ValidationHandler::flattenValidationErrors($errors);

return [
    'success' => false,
    'errors' => $normalized,
];
```

This produces predictable keys and allows frontend code or API consumers to render form-level feedback consistently.

## Recommended architecture

A well-supported application layout is:

1. DTOs represent request or domain data.
2. Validation rules are registered using `ValidationRegistry`.
3. Services call `ValidationHandler::validate()` before persisting or processing.
4. Flattened errors are emitted to forms or API clients.
5. Business domains remain clean and testable.

This approach leads to cleaner controllers, easier debugging, and improved maintainability across medium and large PHP codebases.
