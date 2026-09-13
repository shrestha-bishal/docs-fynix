---
title: Validator overview
description: Choose the right v3 Fynix validator and learn the shared API.
---


Fynix v3 keeps validator construction simple: create a validator through `Rule`, then configure it with immutable fluent methods. This keeps the API predictable and gives you proper autocomplete for each validator family.

## Validator matrix

| Rule method | Validator | Best for |
| --- | --- | --- |
| `string()` | `StringValidator` | Text, labels, and names |
| `boolean()` | `BooleanValidator` | Strict booleans |
| `number()` | `NumberValidator` | Numeric values and ranges |
| `integer()` | `IntegerValidator` | Strict integers |
| `decimal()` | `DecimalValidator` | Strict floats |
| `email()` | `EmailValidator` | Email addresses |
| `phoneNumber()` | `PhoneNumberValidator` | Phone numbers |
| `password()` | `PasswordValidator` | Password strength and policy |
| `dateTime()` | `DateTimeValidator` | Dates and times |
| `url()` | `UrlValidator` | URLs |
| `uuid()` | `UuidValidator` | UUID values |
| `ipAddress()` | `IpAddressValidator` | IPv4 and IPv6 |
| `regex()` | `RegexValidator` | Custom format matching |
| `array()` / `arrayOf()` | `ArrayValidator` | Arrays and per-item rules |
| `enum()` | `EnumValidator` | Enum values and instances |
| `file()` | `FileValidator` | File upload inputs |
| `image()` | `ImageValidator` | A single uploaded image |
| `images()` | `ImagesValidator` | Multiple uploaded images |
| `object()` | `ObjectValidator` | Nested DTOs |
| `objectArray()` | `ObjectArrayValidator` | Arrays of DTOs |
| `username()` | `UsernameValidator` | Usernames and uniqueness |

## Shared behavior

Every validator is built on the same base pipeline:

- requiredness checks
- normalization and cleanup
- HTML tag rejection where applicable
- common constraints like `in()`, `requiredIf()`, `sameAs()`
- type-specific validation delegated to `validateValue()`

```php
use Fynix\Rule;

$validator = Rule::string('displayName')
    ->label('Display name')
    ->length(2, 80)
    ->in(['Alice', 'Bob']);

$first = $validator->validate('A');
$all = $validator->validateAll('A');
```

Shared methods include `label()`, `required()`, `optional()`, `in()`, `notIn()`, `sameAs()`, `differentFrom()`, conditional requiredness, and prohibited-field constraints. Fluent methods are immutable and return a new validator instance each time.

## Example: direct value validation

```php
use Fynix\Rule;

$error = Rule::email('email')->validate('not-an-email');

$allErrors = Rule::password('password')
    ->length(12, 128)
    ->validateAll('abc');
```

Use `validate()` when you only care about the first failure. Use `validateAll()` when you need every applicable violation at once.

## Example: bound object validation

```php
$user = new User();
$user->firstName = 'A';

$error = Rule::for($user)
    ->string('firstName')
    ->min(2)
    ->max(50)
    ->validate();
```

This validates the named property on the supplied instance without using a global registry.

## Generic validation

Use `withoutGenericValidation()` when a specialized validator must bypass the shared requiredness, HTML, and length layer. File and array validators manage their own structure checks and related validation semantics.