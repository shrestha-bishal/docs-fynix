---
id: examples/standalone
title: Standalone value validation
description: Validate individual values with Fynix rules without registering a DTO.
sidebar:
  order: 2
---

Use standalone rules when you are validating a request value, form field, command argument, or any value that does not need a registered object.

## Validate one value

```php
use Fynix\Rule;

$error = Rule::string('firstName')
    ->min(2)
    ->max(50)
    ->validate('A');
```

Pass the value to `validate()` because the rule is not bound to an object.

## Collect every issue

```php
$errors = Rule::password('password')
    ->length(12, 128)
    ->validateAll('abc');
```

Use `validateAll()` for password policies and other fields where the caller should see every applicable issue.

## Text and labels

```php
$error = Rule::string('postalCode')
    ->label('Postal code')
    ->length(5, 10)
    ->validate('12');
```

The label changes the human-readable message while `postalCode` remains the structured field name.

## Numeric values

```php
$age = Rule::integer('age')
    ->min(18)
    ->max(120)
    ->validate(17);

$price = Rule::decimal('price')
    ->min(0)
    ->validate(19.95);
```

Use `integer()` for whole numbers and `decimal()` when fractional values are valid.

## Allow-list and deny-list

```php
$status = Rule::string('status')
    ->in(['draft', 'published'])
    ->notIn(['deleted']);

$error = $status->validate('deleted');
```

`in()` and `notIn()` use strict comparisons.

## Formats

```php
$email = Rule::email('email')->validate('not-an-email');
$url = Rule::url('website')->validate('https://example.com');
$uuid = Rule::uuid('requestId')->validate('550e8400-e29b-41d4-a716-446655440000');
$ip = Rule::ipAddress('clientIp')->validate('2001:db8::1');
$code = Rule::regex('inviteCode', '/^[A-Z]{3}-[0-9]{4}$/')->validate('ABC-1234');
```

Each format rule can be combined with presence, labels, and bounds.

## Enum values

```php
enum AccountType: string
{
    case Personal = 'personal';
    case Business = 'business';
}

$error = Rule::enum('accountType', AccountType::class)
    ->validate(AccountType::Business);
```

## Direct object binding

When a value belongs to an object but you only want to validate one property, use `Rule::for()`:

```php
$user = new User();
$user->firstName = 'A';

$error = Rule::for($user)
    ->string('firstName')
    ->min(2)
    ->validate();
```

The bound rule reads `firstName` from the object, so the property value is not passed again.

Inside a method on the object, the same pattern uses `$this`:

```php
use Fynix\ValidationError;

final class User
{
    public string $firstName = '';

    public function firstNameError(): ?ValidationError
    {
        return Rule::for($this)
            ->string('firstName')
            ->min(2)
            ->validate();
    }
}
```

Use `Rule::on(self::class)` for reusable class-scoped definitions; use `Rule::for($this)` for a rule that reads the current instance directly.

## Execution choice

Use `validate()` for the first error:

```php
$error = Rule::email('email')->validate('invalid');
```

Use `validateAll()` for every error:

```php
$errors = Rule::password('password')->validateAll('abc');
```

Use `ValidationHandler` instead when the validation boundary is a complete DTO or object graph.
