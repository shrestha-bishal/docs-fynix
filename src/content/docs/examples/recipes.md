---
id: examples/recipes
title: Validation recipes
description: Practical Fynix v3 recipes for common validation scenarios.
sidebar:
  order: 5
---

These recipes show the public Fynix API in small, focused scenarios. Start with `Rule` for one value, use `Rule::for()` for an object instance, and use `ValidationHandler` for a complete DTO.

## 1. Validate a required string

```php
use Fynix\Rule;

$error = Rule::string('firstName')
    ->required()
    ->validate('');
```

Use `validate()` when the first applicable error is enough.

## 2. Validate an optional field

```php
$nickname = Rule::string('nickname')
    ->optional()
    ->max(40);

$error = $nickname->validate(null); // null
```

`optional()` allows `null` and an empty string to pass presence validation.

## 3. Use a human-readable label

```php
$error = Rule::string('postalCode')
    ->label('Postal code')
    ->length(5, 10)
    ->validate('12');
```

The label changes the message, while the structured field name remains `postalCode`.

## 4. Apply minimum and maximum bounds

```php
$username = Rule::string('username')
    ->min(3)
    ->max(30);

$error = $username->validate('ab');
```

For strings, the bounds are character counts. For numbers they are numeric limits, and for arrays they are item counts.

## 5. Apply one length range

```php
$password = Rule::password('password')
    ->length(12, 128);

$errors = $password->validateAll('abc');
```

`length()` is useful when the lower and upper bounds describe one policy.

## 6. Restrict values with an allow-list

```php
$accountType = Rule::string('accountType')
    ->in(['personal', 'business']);

$error = $accountType->validate('unknown');
```

`in()` uses strict comparison and returns `value.not_allowed` for an unlisted value.

## 7. Reject values with a deny-list

```php
$status = Rule::string('status')
    ->notIn(['deleted', 'suspended']);

$error = $status->validate('deleted');
```

`notIn()` returns `value.disallowed` for a listed value.

## 8. Compare confirmation fields

```php
$user = new User();
$user->password = 'secret';
$user->passwordConfirmation = 'different';

$error = Rule::for($user)
    ->string('passwordConfirmation')
    ->sameAs('password')
    ->validate();
```

Cross-field methods need object context so Fynix can read the related property.

## 9. Require a field conditionally

```php
$registration = new Registration();
$registration->accountType = 'business';
$registration->companyName = '';

$error = Rule::for($registration)
    ->string('companyName')
    ->optional()
    ->requiredIf('accountType', 'business')
    ->validate();
```

Use `requiredUnless()` when the field should be required for every value except one condition.

## 10. Prohibit a field conditionally

```php
$registration = new Registration();
$registration->accountType = 'personal';
$registration->companyName = 'Acme';

$error = Rule::for($registration)
    ->string('companyName')
    ->optional()
    ->prohibitedIf('accountType', 'personal')
    ->validate();
```

Use `prohibitedUnless()` when a value is allowed only for one context.

## 11. Validate one property on an object

```php
$user = new User();
$user->firstName = 'A';

$error = Rule::for($user)
    ->string('firstName')
    ->min(2)
    ->max(50)
    ->validate();
```

Because the rule is bound to `$user`, do not pass `$user->firstName` to `validate()`.

## 12. Return every applicable error

```php
$errors = Rule::password('password')
    ->length(12, 128)
    ->validateAll('abc');

$payload = array_map(
    static fn ($error): array => $error->toArray(),
    $errors,
);
```

Use `validateAll()` for password policies, imports, and forms that should show every issue at once.

## 13. Validate an object with explicit rules

```php
$user = new User();
$user->firstName = '';
$user->email = 'not-an-email';

$errors = ValidationHandler::validate(
    $user,
    rules: [
        Rule::on(User::class)->string('firstName')->min(2),
        Rule::on(User::class)->email('email')->max(180),
    ],
);
```

The handler runs each rule internally. Do not add `->validate()` inside the rules array.

## 14. Keep reusable rules in a class method

```php
final class User
{
    public string $firstName = '';
    public string $email = '';

    public static function rules(): array
    {
        return [
            Rule::on(self::class)->string('firstName')->min(2)->max(50),
            Rule::on(self::class)->email('email')->max(180),
        ];
    }

    public function validationErrors(): array
    {
        return ValidationHandler::validate($this, rules: self::rules());
    }
}
```

This keeps the class-scoped rule definition separate from the method that validates the current instance.

## 15. Register rules for DTO validation

```php
ValidationRegistry::register(
    User::class,
    static fn (RuleSet $rules): array => [
        $rules->string('firstName')->min(2)->max(50),
        $rules->email('email')->max(180),
    ],
);

$errors = ValidationHandler::validate($user);
```

When no explicit `rules:` argument is supplied, the handler loads the registered rules for the object's class.

## 16. Validate arrays and every item

```php
$tags = Rule::arrayOf('tags')
    ->min(1)
    ->max(10)
    ->each(Rule::string('tag')->length(2, 30));

$errors = $tags->validateAll(['php', '']);
```

Use `arrayOf()` when the collection itself and each item need validation.

## 17. Validate nested DTOs

```php
ValidationRegistry::register(
    Address::class,
    static fn (RuleSet $rules): array => [
        $rules->string('city')->min(2)->max(80),
    ],
);

ValidationRegistry::register(
    User::class,
    static fn (RuleSet $rules): array => [
        $rules->object('address', Address::class),
    ],
);

$errors = ValidationHandler::validate($user);
```

The handler resolves the nested object's registered rules and preserves the nested error shape.

## 18. Compose rules for reusable policies

```php
use Fynix\Rule;
use Fynix\Rules\AllOf;
use Fynix\Rules\AnyOf;
use Fynix\Rules\Not;

$name = new AllOf([
    Rule::string('name')->min(2),
    Rule::string('name')->max(80),
]);

$contact = new AnyOf([
    Rule::email('contact'),
    Rule::phoneNumber('contact'),
]);

$blocked = new Not(
    Rule::string('status')->in(['blocked']),
    'This status is not allowed.',
);
```

Use composition when a policy combines alternatives, multiple constraints, or an explicit negation.

## 19. Customize a domain validator

```php
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

Pass `$this` to `ValidationError` to preserve validator metadata and use `$this->name` for the configured display label. This is an advanced extension point.
