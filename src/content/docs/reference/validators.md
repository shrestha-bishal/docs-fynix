---
title: Validator overview
description: Choose the right v3 Fynix validator and learn the shared API.
---

# Validator overview

Create validators through `Rule` rather than calling constructors directly. Every page in this section contains its public construction method and a working example.

## Validator matrix

| Rule method | Validator | Best for |
| --- | --- | --- |
| `string()` | `StringValidator` | Text and labels |
| `boolean()` | `BooleanValidator` | Strict booleans |
| `number()` | `NumberValidator` | Numeric values and ranges |
| `integer()` | `IntegerValidator` | Strict integers |
| `decimal()` | `DecimalValidator` | Strict floats |
| `email()` | `EmailValidator` | Email addresses |
| `phoneNumber()` | `PhoneNumberValidator` | Phone numbers |
| `password()` | `PasswordValidator` | Password strength |
| `dateTime()` | `DateTimeValidator` | Dates and times |
| `url()` | `UrlValidator` | URLs |
| `uuid()` | `UuidValidator` | UUID strings |
| `ipAddress()` | `IpAddressValidator` | IPv4 and IPv6 |
| `regex()` | `RegexValidator` | Custom formats |
| `array()` / `arrayOf()` | `ArrayValidator` | Arrays and per-item rules |
| `enum()` | `EnumValidator` | Enum values and instances |
| `file()` | `FileValidator` | General uploads |
| `image()` | `ImageValidator` | One image upload |
| `images()` | `ImagesValidator` | Multiple image uploads |
| `object()` | `ObjectValidator` | Nested DTOs |
| `objectArray()` | `ObjectArrayValidator` | Arrays of DTOs |
| `username()` | `UsernameValidator` | Usernames and uniqueness |

## Shared behavior

```php
use Fynix\Rule;

$validator = Rule::string('displayName')
    ->label('Display name')
    ->length(2, 80)
    ->in(['Alice', 'Bob']);

$first = $validator->validateField('A');
$all = $validator->validateFieldAll('A');
```

Shared methods include `label()`, `required()`, `optional()`, `in()`, `notIn()`, `sameAs()`, `differentFrom()`, conditional requiredness, and prohibited-field constraints. Fluent methods are immutable and return new validator instances.

## Generic validation

Use `withoutGenericValidation()` when a specialized validator must bypass the shared requiredness, HTML, and length layer. File and array validators manage their own structure checks.