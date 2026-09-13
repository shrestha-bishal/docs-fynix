---
id: examples/validators
title: Validator examples
description: Practical examples for every Fynix v3 validator factory.
sidebar:
  order: 6
---

These examples show the public `Rule` facade for each validator family. The validator classes are implementation details; application code should construct rules through `Rule` or `RuleSet`.

## String validation

```php
$name = Rule::string('displayName')
    ->label('Display name')
    ->length(2, 80)
    ->validate('A');
```

Use `string()` for names, labels, descriptions, and other text fields.

## Boolean validation

```php
$marketing = Rule::boolean('marketingOptIn')
    ->required()
    ->validate(true);
```

`boolean()` accepts strict boolean values rather than truthy strings such as `'yes'`.

## Number validation

```php
$rating = Rule::number('rating')
    ->min(0)
    ->max(5)
    ->validate(4.5);
```

Use `number()` when both integer and decimal numeric values are valid.

## Integer validation

```php
$quantity = Rule::integer('quantity')
    ->min(1)
    ->max(999)
    ->validate(3);
```

Use `integer()` when decimal values must be rejected.

## Decimal validation

```php
$price = Rule::decimal('price')
    ->min(0)
    ->validate(19.95);
```

Use `decimal()` for numeric values that should be represented as decimal numbers.

## Email validation

```php
$email = Rule::email('email')
    ->required()
    ->max(180)
    ->validate('person@example.com');
```

`email()` combines email-format validation with the shared requiredness and length pipeline.

## Phone number validation

```php
$phone = Rule::phoneNumber('phone')
    ->required()
    ->validate('+61 400 123 456');
```

Use `phoneNumber()` for values containing supported phone characters such as digits, spaces, dashes, and a leading plus sign.

## Password validation

```php
$errors = Rule::password('password')
    ->length(12, 128)
    ->validateAll('abc');
```

Use `validateAll()` when the user should see every missing password requirement at once.

## Date and time validation

```php
$publishedAt = Rule::dateTime('publishedAt')
    ->required()
    ->validate('2026-09-13T14:30:00+00:00');
```

`dateTime()` accepts valid date and date-time values according to the validator's parser.

## URL validation

```php
$website = Rule::url('website')
    ->optional()
    ->validate('https://example.com');
```

Use `optional()` when a website is allowed to be absent.

## UUID validation

```php
$requestId = Rule::uuid('requestId')
    ->validate('550e8400-e29b-41d4-a716-446655440000');
```

Use `uuid()` for UUID-formatted identifiers.

## IP address validation

```php
$clientIp = Rule::ipAddress('clientIp')
    ->validate('2001:db8::1');
```

`ipAddress()` supports both IPv4 and IPv6 addresses.

## Regular-expression validation

```php
$inviteCode = Rule::regex('inviteCode', '/^[A-Z]{3}-[0-9]{4}$/')
    ->validate('ABC-1234');
```

Use `regex()` when a domain format is more specific than the built-in validators.

## Array validation

```php
$tags = Rule::array('tags')
    ->min(1)
    ->max(10)
    ->validate(['php', 'validation']);
```

Use `array()` when you need to validate the collection itself.

## Array item validation

```php
$tags = Rule::arrayOf('tags')
    ->each(Rule::string('tag')->length(2, 30))
    ->validateAll(['php', '']);
```

Use `arrayOf()` with `each()` when every item needs its own rule.

## Enum validation

```php
enum AccountType: string
{
    case Personal = 'personal';
    case Business = 'business';
}

$accountType = Rule::enum('accountType', AccountType::class)
    ->validate(AccountType::Business);
```

`enum()` verifies values against the supplied enum class.

## File validation

```php
$document = Rule::file('document')
    ->required()
    ->validate($uploadedFile);
```

Use `file()` for uploaded file inputs. `$uploadedFile` represents the upload value received by the application.

## Image validation

```php
$avatar = Rule::image('avatar')
    ->optional()
    ->validate($uploadedAvatar);
```

Use `image()` for one uploaded image and keep it optional when the field is not required.

## Multiple-image validation

```php
$gallery = Rule::images('gallery')
    ->min(1)
    ->max(8)
    ->validate($uploadedImages);
```

Use `images()` for a collection of uploaded images.

## Nested object validation

```php
final class Address
{
    public string $city = '';
}

ValidationRegistry::register(
    Address::class,
    static fn (RuleSet $rules): array => [
        $rules->string('city')->min(2)->max(80),
    ],
);

$addressRule = Rule::object('address', Address::class);
```

Register the nested class rules before the parent object is validated by `ValidationHandler`.

## Object array validation

```php
final class LineItem
{
    public string $sku = '';
}

$orderItems = Rule::objectArray('items', LineItem::class)
    ->min(1)
    ->max(100);
```

Use `objectArray()` when every item must be an instance of the same DTO class and should use that class's registered rules.

## Username validation

```php
$username = Rule::username('username')
    ->min(3)
    ->max(30)
    ->validate('bishal_123');
```

Use `username()` for usernames that need character and length policy checks.

## Complete object example

Validator rules are usually combined and run through the handler:

```php
$errors = ValidationHandler::validate(
    $user,
    rules: [
        Rule::on(User::class)->string('displayName')->min(2)->max(80),
        Rule::on(User::class)->email('email')->max(180),
        Rule::on(User::class)->object('address', Address::class),
    ],
);
```

The handler runs the rules internally and preserves nested error paths for object and object-array validation.
