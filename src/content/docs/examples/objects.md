---
id: examples/objects
title: Object and DTO validation
description: Validate DTOs, nested objects, and conditional fields with Fynix.
sidebar:
  order: 4
---

Use object validation when several fields belong to one request or domain object. Define class-scoped rules and let `ValidationHandler` run them together.

## Define a DTO

```php
final class User
{
    public string $firstName = '';
    public string $email = '';
    public string $password = '';
}
```

## Define reusable class rules

```php
use Fynix\Rule;

final class UserRules
{
    public static function rules(): array
    {
        return [
            Rule::on(User::class)->string('firstName')->min(2)->max(50),
            Rule::on(User::class)->email('email')->max(180),
            Rule::on(User::class)->password('password')->length(12, 128),
        ];
    }
}
```

`Rule::on(User::class)` validates the declared class and property while constructing the rule.

## Validate the DTO

```php
use Fynix\ValidationHandler;

$user = new User();
$user->firstName = 'A';
$user->email = 'not-an-email';
$user->password = 'short';

$errors = ValidationHandler::validate(
    $user,
    rules: UserRules::rules(),
);
```

The handler runs every rule internally. Do not call `->validate()` inside the rules array.

## Put rules on the class

```php
use Fynix\ValidationError;

final class Customer
{
    public string $firstName = '';
    public string $email = '';

    public static function rules(): array
    {
        return [
            Rule::on(self::class)->email('email')->required(),
        ];
    }

    public function validationErrors(): array
    {
        return ValidationHandler::validate($this, rules: self::rules());
    }

    public function firstNameError(): ?ValidationError
    {
        return Rule::for($this)
            ->string('firstName')
            ->min(2)
            ->validate();
    }
}
```

`Rule::on(self::class)` defines reusable class-scoped rules. `Rule::for($this)` binds a one-off rule to the current instance. Neither form is `Rule::on($this)`: `on()` expects a class name, while `for()` expects an object.

## Validate a nested object

```php
final class Address
{
    public string $city = '';
}

final class Customer
{
    public ?Address $address = null;
}

ValidationRegistry::register(
    Address::class,
    static fn (RuleSet $rules): array => [
        $rules->string('city')->min(2)->max(80),
    ],
);

ValidationRegistry::register(
    Customer::class,
    static fn (RuleSet $rules): array => [
        $rules->object('address', Address::class),
    ],
);

$errors = ValidationHandler::validate($customer);
```

Nested rules are resolved by type and returned in the nested object shape.

## Compare fields

```php
ValidationRegistry::register(
    Registration::class,
    static fn (RuleSet $rules): array => [
        $rules->string('passwordConfirmation')->sameAs('password'),
        $rules->string('newEmail')->differentFrom('email'),
    ],
);
```

`sameAs()` and `differentFrom()` read related properties from the same object.

## Conditional fields

```php
ValidationRegistry::register(
    Registration::class,
    static fn (RuleSet $rules): array => [
        $rules->string('companyName')
            ->optional()
            ->requiredIf('accountType', 'business'),
        $rules->string('businessLicense')
            ->optional()
            ->prohibitedUnless('accountType', 'business'),
    ],
);
```

Use `requiredUnless()`, `prohibitedIf()`, and `prohibitedUnless()` for the inverse cases.

## Structured nested errors

```php
$errors = ValidationHandler::validate(
    $customer,
    flattenErrorToString: false,
);

foreach ($errors as $field => $issues) {
    // $issues may contain nested objects or ValidationError instances.
}
```

Keep structured errors for APIs and use the default string output for simple form rendering.
