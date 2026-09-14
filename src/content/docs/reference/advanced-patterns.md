---
title: Advanced patterns
description: Use nested DTOs, arrays, conditional constraints, listeners, and batch validation in Fynix v3.
---


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

### Closure conditions

Conditional methods accept a closure that receives the object currently being
validated. This is useful when a condition depends on more than one field:

```php
$rules->string('internationalCode')
    ->optional()
    ->requiredIf(
        static fn (Order $order): bool =>
            $order->shippingMethod === 'business' && $order->isInternational,
    );
```

Use `when()` to skip the entire validator unless the object satisfies a
predicate. It can gate type, length, requiredness, and other configuration:

```php
$rules->string('companyName')
    ->min(10)
    ->when(static fn (Order $order): bool => $order->shippingMethod === 'business');
```

Closures are also supported by `requiredUnless()`, `prohibitedIf()`,
`prohibitedUnless()`, `sameAs()`, and `differentFrom()`. Predicates run during
validation and receive the validated object, not the `RuleSet` factory.

## DTO property visibility

Registered validation can read declared public, protected, and private
properties. Property names are checked when rules are created; getters and
magic properties are not invoked automatically.

```php
final class Account
{
    private string $email = '';
}

ValidationRegistry::register(
    Account::class,
    static fn (RuleSet $rules): array => [
        $rules->email('email'),
    ],
);
```

## Reusable value constraints

```php
use Fynix\Rule;

$status = Rule::string('status')
    ->in(['draft', 'published'])
    ->notIn(['archived']);
```

## Custom validators

Extend `ValidatorBase` when a rule belongs to your domain rather than to a generic type. Return `ValidationError` with `$this` and build the message from `$this->name`; this keeps the custom error connected to the validator metadata and respects labels applied by the rule.

```php
use Fynix\ValidationError;
use Fynix\Validators\ValidatorBase;

final class EvenNumberValidator extends ValidatorBase
{
    protected function validateValue(mixed $fieldValue): ?ValidationError
    {
        if (!is_int($fieldValue) || $fieldValue % 2 !== 0) {
            return new ValidationError($this, "$this->name must be even.", 'number.even');
        }

        return null;
    }
}
```

The shared base pipeline runs before the custom type check, so requiredness and common fluent constraints remain available to the custom validator.

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