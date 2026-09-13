---
id: examples/registration
title: Registration workflow
description: Validate a realistic registration payload with nested address data and conditional business rules.
sidebar:
  order: 2
---


This example validates a business registration request with a nested address, password confirmation, and a company name that is required only for business accounts.

## Define the DTOs

```php
final class Address
{
    public string $city = '';
}

final class Registration
{
    public string $accountType = 'personal';
    public string $email = '';
    public string $password = '';
    public string $passwordConfirmation = '';
    public ?string $companyName = null;
    public ?Address $address = null;
}
```

## Register the rules

```php
use Fynix\RuleSet;
use Fynix\ValidationHandler;
use Fynix\ValidationRegistry;

ValidationRegistry::register(
    Address::class,
    static fn (RuleSet $rules): array => [
        $rules->string('city')->min(2)->max(80),
    ],
);

ValidationRegistry::register(
    Registration::class,
    static fn (RuleSet $rules): array => [
        $rules->string('accountType')->in(['personal', 'business']),
        $rules->email('email')->max(254),
        $rules->password('password')->length(12, 128),
        $rules->string('passwordConfirmation')->sameAs('password'),
        $rules->string('companyName')
            ->optional()
            ->requiredIf('accountType', 'business'),
        $rules->object('address', Address::class),
    ],
);
```

## Validate invalid input

```php
$registration = new Registration();
$registration->accountType = 'business';
$registration->email = 'not-an-email';
$registration->password = 'short';
$registration->passwordConfirmation = 'different';
$registration->address = new Address();
$registration->address->city = 'A';

$errors = ValidationHandler::validate($registration);
```

## Returned result

The default handler output preserves the nested object structure:

```php
[
    'email' => 'Email must be a valid email address.',
    'password' => 'Password is too short. This field must be at least 12 characters.',
    'passwordConfirmation' => 'Password Confirmation must match password.',
    'companyName' => 'Company Name is required.',
    'address' => [
        'city' => 'City is too short. This field must be at least 2 characters.',
    ],
]
```

For a JSON API, preserve machine-readable errors instead:

```php
$errors = ValidationHandler::validate(
    $registration,
    flattenErrorToString: false,
);
```

The longer [registration guide](/guides/registration) expands this flow with form flattening and response mapping.