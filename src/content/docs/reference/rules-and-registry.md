---
title: Rule, RuleSet, and registry
description: Build immutable v3 rules and register them for DTO validation.
---


Version 3 is designed around a small set of public construction APIs:

- `Rule` creates standalone validators
- `Rule::on()` creates class-scoped validators
- `RuleSet` is passed into registry factories
- `ValidationRegistry` stores the DTO-to-rules mapping

This keeps validation rules explicit, type-safe, and easy to reuse.

## Rule facade methods

`Rule` is the main facade for constructing validators. Every factory accepts the DTO property name unless noted otherwise:

| Method | Validator or purpose |
| --- | --- |
| `Rule::string($field)` | `StringValidator` |
| `Rule::boolean($field)` | `BooleanValidator` |
| `Rule::number($field)` | `NumberValidator` |
| `Rule::integer($field)` | `IntegerValidator` |
| `Rule::decimal($field)` | `DecimalValidator` |
| `Rule::email($field)` | `EmailValidator` |
| `Rule::phoneNumber($field)` | `PhoneNumberValidator` |
| `Rule::password($field)` | `PasswordValidator` |
| `Rule::dateTime($field)` | `DateTimeValidator` |
| `Rule::url($field)` | `UrlValidator` |
| `Rule::uuid($field)` | `UuidValidator` |
| `Rule::ipAddress($field)` | `IpAddressValidator` |
| `Rule::regex($field, $pattern)` | `RegexValidator` |
| `Rule::array($field)` | Alias for `arrayOf()` |
| `Rule::arrayOf($field)` | `ArrayValidator` |
| `Rule::enum($field, $enumClass)` | `EnumValidator` |
| `Rule::file($field)` | `FileValidator` |
| `Rule::image($field)` | `ImageValidator` |
| `Rule::images($field)` | `ImagesValidator` |
| `Rule::object($field, $targetClass)` | `ObjectValidator` |
| `Rule::objectArray($field, $targetClass)` | `ObjectArrayValidator` |
| `Rule::username($field)` | `UsernameValidator` |
| `Rule::on($ownerClass)` | Create class-scoped rules |
| `Rule::for($instance)` | Create instance-bound rules |
| `Rule::labelFor($field)` | Generate a display label from a property name |

`Rule::on()` expects a class name such as `User::class`. Use `Rule::for($user)` when the rules should read values from one object instance.

## Standalone rules

Use standalone rules when you are validating a value directly, not a registered object:

```php
use Fynix\Rule;

$email = Rule::email('email')->max(255);
$age = Rule::integer('age')->min(18)->max(120);
$code = Rule::regex('code', '/^[A-Z]{3}-[0-9]{4}$/');
```

These are ideal for request payloads, form submission validation, and single field checks.

## Scoped rules

Scoped rules are checked against a declared class and property name:

```php
use Fynix\Rule;

$rule = Rule::on(User::class)
    ->string('firstName')
    ->min(2)
    ->max(50);
```

This is the most common way to define v3 rules. If the owning class or property does not exist, Fynix throws a typed exception instead of silently creating incomplete rules.

## Registry factories

Register reusable DTO rules once and then validate objects by type:

```php
use Fynix\RuleSet;
use Fynix\ValidationRegistry;

ValidationRegistry::register(
    User::class,
    static fn (RuleSet $rules): array => [
        $rules->string('firstName')->min(2)->max(50),
        $rules->email('email')->max(255),
        $rules->password('password')->min(8)->max(128),
    ]
);
```

A registry factory receives a `RuleSet`, not a DTO instance. Each returned definition must be a valid `Validatable` rule. The rules are then retrieved by `ValidationRegistry::rulesFor()` and applied by `ValidationHandler`.

## When to pass explicit rules

The handler accepts an optional rules array and uses it before the global registry:

```php
$errors = ValidationHandler::validate(
    $user,
    rules: [
        Rule::on(User::class)->string('firstName')->min(2)->max(50),
        Rule::on(User::class)->email('email'),
    ]
);
```

This is useful when you want one object validation to use a local or temporary rule set without registering globally. If you omit `$rules`, the registry lookup is used.

## Immutable configuration

All fluent methods are immutable. A configuration method returns a new instance, so chaining is safe and explicit:

```php
use Fynix\Rule;

$rule = Rule::string('name');
$rule = $rule->min(2);
$rule = $rule->max(80);
```

Keep rule construction on the v3 facade APIs so definitions remain immutable and class-aware.

## Common constraints

| Method | Purpose |
| --- | --- |
| `label(string $label)` | Override the generated field label. |
| `required()` / `optional()` | Control missing-value behavior. |
| `in(array $values)` / `notIn(array $values)` | Allow or reject exact values. |
| `sameAs(string $field)` / `differentFrom(string $field)` | Compare fields in the same object. |
| `requiredIf(string $field, mixed $value)` | Require a field when another field matches. |
| `requiredUnless(string $field, mixed $value)` | Require a field when another field does not match. |
| `prohibitedIf(string $field, mixed $value)` | Reject a value when another field matches. |
| `prohibitedUnless(string $field, mixed $value)` | Reject a value when another field does not match. |
| `genericValidation(bool $enabled = true)` / `withoutGenericValidation()` | Enable or disable shared requiredness, normalization, HTML, and length checks. |
| `validate(mixed $value, ?object $data = null)` | Return the first applicable validation error. |
| `validateAll(mixed $value, ?object $data = null)` | Return all applicable validation errors. |

Validators also expose `name()`, `propertyName()`, `requiredState()`, `minLength()`, and `maxLength()` for inspecting configured metadata and constraints.

## Fluent API guide

Every fluent method returns a new rule. The original rule remains unchanged, so you can safely keep a base rule and derive more specific rules from it.

### Labels and presence

Use `label()` to control the human-readable name in error messages. Use `required()` for values that must be present and `optional()` when `null` or an empty string is allowed.

```php
$displayName = Rule::string('displayName')
    ->label('Display name')
    ->required();

$nickname = Rule::string('nickname')->optional();
```

`required(false)` is equivalent to `optional()`. Presence is checked before type-specific validation.

### Bounds and lengths

Use `min()` and `max()` for one-sided limits. Use `length()` when both limits belong to the same rule. The meaning follows the validator: strings use character count, numbers use their numeric value, and arrays or collections use item count.

```php
$username = Rule::string('username')->min(3)->max(30);
$age = Rule::integer('age')->min(18)->max(120);
$tags = Rule::array('tags')->min(1)->max(10);
$password = Rule::password('password')->length(12, 128);
```

### Allowed and rejected values

Use `in()` to allow only an explicit list. Use `notIn()` to reject values from a list. Comparisons are strict, so `1` and `'1'` are different values.

```php
$accountType = Rule::string('accountType')
    ->in(['personal', 'business']);

$status = Rule::string('status')
    ->notIn(['deleted', 'suspended']);
```

### Comparing fields

`sameAs()` and `differentFrom()` compare the current field with another property on the same object. They require object context, so use them with `Rule::on()`, `Rule::for()`, a `RuleSet`, or `ValidationHandler`.

```php
$rules = [
    Rule::on(User::class)
        ->string('passwordConfirmation')
        ->sameAs('password'),
    Rule::on(User::class)
        ->string('newEmail')
        ->differentFrom('email'),
];
```

### Conditional presence

Use `requiredIf()` when a field becomes required after another field matches a value. Use `requiredUnless()` when it becomes required after the other field differs from that value.

```php
$rules = [
    Rule::on(Registration::class)
        ->string('companyName')
        ->optional()
        ->requiredIf('accountType', 'business'),
    Rule::on(Registration::class)
        ->string('taxId')
        ->optional()
        ->requiredUnless('accountType', 'personal'),
];
```

The comparison is strict. Conditional presence rules are evaluated with the current DTO, not with a separately supplied scalar value.

### Conditional prohibition

Use `prohibitedIf()` to reject a field when another field matches a value. Use `prohibitedUnless()` to reject it when the other field does not match.

```php
$rules = [
    Rule::on(Registration::class)
        ->string('companyName')
        ->optional()
        ->prohibitedIf('accountType', 'personal'),
    Rule::on(Registration::class)
        ->string('personalTaxId')
        ->optional()
        ->prohibitedUnless('accountType', 'personal'),
];
```

When a value is prohibited, the pipeline returns a prohibition error before running the field's type-specific checks.

### Shared validation pipeline

Use `genericValidation(false)` or `withoutGenericValidation()` when a specialized validator must skip the shared requiredness, normalization, HTML, and length layer. This is an advanced option; most rules should keep the default pipeline enabled.

```php
$rawValue = Rule::string('rawValue')
    ->withoutGenericValidation();
```

### Running a rule

Use `validate()` for the first applicable error and `validateAll()` when the caller needs every applicable error. For a standalone rule, pass the value. For an object-bound rule, omit the value and let Fynix read the property.

```php
$error = Rule::email('email')->validate('not-an-email');

$errors = Rule::password('password')
    ->length(12, 128)
    ->validateAll('abc');

$boundError = Rule::for($user)
    ->string('firstName')
    ->min(2)
    ->validate();
```

When validating a complete object, pass the rules to `ValidationHandler::validate()`. The handler runs each rule internally, so do not call `validate()` inside the rules array.

For combined rules, see [composable rules](./composable-rules).