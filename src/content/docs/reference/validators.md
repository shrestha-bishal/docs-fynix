---
title: Built-in validators
description: Complete guide to each validator shipped with Fynix and the constraints they support.
---

# Built-in validators

Fynix ships with a small but powerful validator set. Each validator focuses on a clear concern: strings, numbers, email addresses, nested objects, files, and arrays of files or DTOs.

## Common API across validators

All validators inherit from `ValidatorBase` and support the following shared behavior:

- `required(bool $required = true)` or `isRequired(bool)`
- `optional()` as a shorthand for making a field non-required
- `min(int|float $value)` and `max(int|float $value)` for meaningful numeric or length constraints
- `length(int $min, int $max)` for string-like validators
- `validateField(mixed $value)` for the first error only
- `validateFieldAll(mixed $value)` for all applicable errors
- `requiredState()` for introspecting current requiredness

### `ValidatorBase` method reference

`ValidatorBase` is the shared base for all field validators.

```php
public function isRequired(bool $required = true): static
public function required(bool $required = true): static
public function optional(): static
public function requiredState(): bool
public function name(): string
public function propertyName(): string
public function minLength(): ?int
public function maxLength(): ?int
public function genericValidation(bool $enabled = true): static
public function withoutGenericValidation(): static
public function validateField(mixed $fieldValue): ?ValidationError
public function validateFieldAll(mixed $fieldValue): array
public function validateAll(mixed $fieldValue): array
```

#### Behavior details

- `isRequired()` and `required()` toggle whether empty or null field values count as invalid.
- `optional()` is a short alias for `isRequired(false)`.
- `name()` and `propertyName()` expose the label and property key used in error messages.
- `genericValidation(false)` disables the shared validation layer for a validator that performs its own file-specific or custom logic.
- `validateField()` returns only the first `ValidationError` instance, while `validateFieldAll()` returns every applicable error for that field.
- `validateAll()` is the hook that child validators override to produce a list of errors when a single validator may produce more than one failure.

### Generic validation behavior

`ValidatorBase::validateFieldAll()` performs a shared validation flow before field-specific validation:

- trims strings
- treats empty or null values as missing if the field is required
- rejects HTML tag content for string-like fields
- checks configured length limits

This means a field can fail in multiple ways at once. For example, a password can fail uppercase, lowercase, number, special-character, and length rules in a single pass.

## Validator matrix

| Validator | Purpose | Common methods |
| --- | --- | --- |
| `StringValidator` | Text field validation | `min()`, `max()`, `length()`, `optional()` |
| `NumberValidator` | Numeric validation and range checks | `min()`, `max()`, `length()`, `optional()` |
| `EmailValidator` | Email formatting and validation | `length()`, `verifyDomain()`, `optional()` |
| `UsernameValidator` | Username format and uniqueness | `length()`, `uniqueUsing()`, `optional()` |
| `PhoneNumberValidator` | Phone number format | `length()`, `optional()` |
| `PasswordValidator` | Password strength | `length()`, `optional()` |
| `ImageValidator` | Single uploaded image file | `maxFileSizeMB()`, `optional()` |
| `ImagesValidator` | Multiple uploaded images | `min()`, `max()`, `maxFileSizeMB()`, `optional()` |
| `ObjectValidator` | Nested object validation | `required()`, `optional()` |
| `ObjectArrayValidator` | Arrays of nested objects | `min()`, `max()`, `required()`, `optional()` |

---

## StringValidator

Use this for plain text values, names, titles, and other string fields.

```php
use Fynix\Validators\StringValidator;

$validator = (new StringValidator('First name', 'firstName'))
    ->min(2)
    ->max(50)
    ->optional();

$error = $validator->validateField('A');
```

### Constructor

```php
new StringValidator(string $name, string $propertyName)
```

### Method reference

```php
public function min(int|float $value): static
public function max(int|float $value): static
public function length(int $min, int $max): static
public function validate(mixed $fieldValue): ?ValidationError
```

### Behavior

- Requires the value to be a string.
- Rejects HTML fragments such as `<b>bad</b>`.
- Enforces configured length ranges.
- Treats empty string as missing when required.
- By default, the constructor sets a starting length range of `2` to `50`.

### Example decisions

```php
$validator = (new StringValidator('Description', 'description'))
    ->length(10, 500)
    ->optional();
```

---

## NumberValidator

Use this for integers, floats, or values that must fall within a numeric range.

```php
use Fynix\Validators\NumberValidator;

$validator = (new NumberValidator('Age', 'age'))
    ->min(18)
    ->max(99);

$errors = $validator->validateFieldAll(12);
```

### Constructor

```php
new NumberValidator(string $name, string $propertyName)
```

### Method reference

```php
public function min(int|float $value): static
public function max(int|float $value): static
public function length(int $min, int $max): static
public function validate(mixed $fieldValue): ?ValidationError
```

### Behavior

- Accepts numeric values only.
- Uses numeric comparisons for `min()` and `max()`.
- The default constructor configures a basic string-like length range of `1` to `30` through the inherited base behavior.
- Allows optional fields when requiredness is disabled.
- It throws `InvalidArgumentException` for non-finite values in `min()` and `max()`.

### Example

```php
$validator = (new NumberValidator('Quantity', 'quantity'))
    ->min(1)
    ->max(1000);
```

---

## EmailValidator

Use this to validate a user’s email address while keeping the validation fast and flexible.

```php
use Fynix\Validators\EmailValidator;

$validator = (new EmailValidator('Email', 'email'))
    ->length(6, 180)
    ->verifyDomain();
```

### Constructor

```php
new EmailValidator(string $name, string $propertyName)
```

### Method reference

```php
public function verifyDomain(bool $enabled = true): static
public function validate(mixed $fieldValue): ?ValidationError
private static function validateDNS(string $fieldValue): bool
private static function validateObscuredEmail(string $fieldValue): bool
```

### Behavior

- Validates using `FILTER_VALIDATE_EMAIL`.
- Rejects multiple `@` signs.
- Rejects consecutive dots in the local part.
- `verifyDomain()` is opt-in and only checks MX records when explicitly enabled.
- It still performs normal length and requiredness validation through the base class.

### Example

```php
$validation = (new EmailValidator('Email', 'email'))
    ->validateFieldAll('user@example.com');
```

> `verifyDomain()` is opt-in and does not run by default to keep validation deterministic and lightweight.

---

## UsernameValidator

Use this for application usernames that need to follow a strict character set and may require uniqueness checks.

```php
use Fynix\Validators\UsernameValidator;

$validator = (new UsernameValidator('Username', 'username'))
    ->length(3, 30)
    ->uniqueUsing(static fn (string $value): bool => $userRepository->existsByUsername($value));
```

### Constructor

```php
new UsernameValidator(string $name, string $propertyName)
```

### Method reference

```php
public function uniqueUsing(callable $existsChecker): static
public function validate(mixed $fieldValue): ?ValidationError
```

### Behavior

- Requires a string.
- Allows only letters, numbers, and underscores.
- Optionally runs a uniqueness callback.
- The callback is expected to return `true` when the username already exists.
- Default length is `3` to `30`.

### Example

```php
$errors = (new UsernameValidator('Username', 'username'))
    ->validateFieldAll('bad-name');
```

---

## PhoneNumberValidator

Use this to validate numbers formatted as phone numbers.

```php
use Fynix\Validators\PhoneNumberValidator;

$validator = (new PhoneNumberValidator('Phone', 'phoneNumber'))
    ->length(10, 12);
```

### Constructor

```php
new PhoneNumberValidator(string $name, string $propertyName)
```

### Method reference

```php
public function validate(mixed $fieldValue): ?ValidationError
private static function validatePattern(string $fieldValue): bool
private static function getSanitisedValue(string $fieldValue): string
```

### Behavior

- Accepts digits, spaces, dashes, and plus signs.
- Strips non-numeric characters for sanitised numeric checks.
- Rejects invalid patterns or non-string input.
- Default length range is `10` to `12` characters.

---

## PasswordValidator

Use this for secure password fields.

```php
use Fynix\Validators\PasswordValidator;

$validator = (new PasswordValidator('Password', 'password'))
    ->length(8, 30);
```

### Constructor

```php
new PasswordValidator(string $name, string $propertyName)
```

### Method reference

```php
public function validate(mixed $fieldValue): ?ValidationError
public function validateAll(mixed $fieldValue): array
```

### Behavior

The validator returns all applicable errors at once, not just the first one.

It checks for:

- at least one uppercase letter
- at least one lowercase letter
- at least one number
- at least one special character
- length constraints

```php
$allErrors = (new PasswordValidator('Password', 'password'))
    ->validateFieldAll('abc');
```

The return value is a list of `ValidationError` objects.

---

## ImageValidator

Use this for a single uploaded image in the typical `$_FILES` style array.

```php
use Fynix\Validators\ImageValidator;

$validator = (new ImageValidator('Profile image', 'profileImage'))
    ->maxFileSizeMB(5);
```

### Constructor

```php
new ImageValidator(string $name, string $propertyName)
```

### Method reference

```php
public function maxFileSizeMB(int $megabytes): static
public function validate(mixed $fieldValue): ?ValidationError
public static function isBmpImage(string $fileContents): bool
public static function isGifImage(string $fileContents): bool
public static function isPngImage(string $fileContents): bool
public static function isTiffImage(string $fileContents): bool
public static function isJpegImage(string $fileContents): bool
public static function isAvifImage(string $fileContents): bool
```

### Behavior

- Requires an uploaded file array structure.
- Checks for empty uploads and requiredness.
- Validates `name`, `error`, `size`, and `tmp_name`.
- Validates file extension against the allowed image types.
- Confirms the file actually contains valid image content.
- The default file size cap is `5 MB` unless changed with `maxFileSizeMB()`.

### Supported extensions

- jpg
- jpeg
- png
- gif
- webp
- avif
- bmp

---

## ImagesValidator

Use this when a field accepts a batch of uploaded images.

```php
use Fynix\Validators\ImagesValidator;

$validator = (new ImagesValidator('Gallery', 'gallery'))
    ->min(1)
    ->max(5)
    ->maxFileSizeMB(5);
```

### Constructor

```php
new ImagesValidator(string $name, string $propertyName)
```

### Method reference

```php
public function min(int|float $value): static
public function max(int|float $value): static
public function maxFileSizeMB(int $megabytes): static
public function validate(mixed $fieldValue): ?ValidationError
```

### Behavior

- Accepts a multi-file array structure.
- Ensures the count fits the configured min/max range.
- Validates each uploaded image with `ImageValidator` internally.
- Throws `InvalidArgumentException` when the count constraint is negative or non-integer.
- Defaults to exactly one accepted image unless `min()` or `max()` are configured.

---

## ObjectValidator

Use this to validate nested DTOs and domain objects that have their own registered rules.

```php
use Fynix\Validators\ObjectValidator;

$validator = new ObjectValidator('address', Address::class);
```

### Constructor

```php
new ObjectValidator(string $propertyName, string $className)
```

### Method reference

```php
public function isRequired(bool $required = true): static
public function required(bool $required = true): static
public function optional(): static
public function requiredState(): bool
```

### Behavior

- Resolves the nested object’s rules using `ValidationRegistry`.
- Verifies the property is present and is an instance of the expected class.
- Supports optional nested objects when configured with `optional()`.
- Validation is delegated to the registry for the nested class, not to the object validator itself.

---

## ObjectArrayValidator

Use this to validate arrays of DTOs or entity instances.

```php
use Fynix\Validators\ObjectArrayValidator;

$validator = (new ObjectArrayValidator('items', Item::class))
    ->min(1)
    ->max(20);
```

### Constructor

```php
new ObjectArrayValidator(string $propertyName, string $className)
```

### Method reference

```php
public function min(int $items): static
public function max(int $items): static
public function isRequired(bool $required = true): static
public function required(bool $required = true): static
public function optional(): static
public function requiredState(): bool
public function minItems(): ?int
public function maxItems(): ?int
```

### Behavior

- Ensures the field is an array.
- Optionally enforces a minimum and maximum item count.
- Validates each item using the nested class registration.
- Throws `InvalidArgumentException` if an item count constraint is negative.
- Internally tracks `minItems()` and `maxItems()` for later validation checks.

---

## Best practices when choosing validators

- Use `StringValidator` for user-entered text, not `NumberValidator`.
- Use `NumberValidator` for values that must be numeric and bounded.
- Use `PasswordValidator` instead of `StringValidator` when password strength matters.
- Use `ObjectValidator` for nested domain objects instead of duplicating validation logic in controllers.
- Use `ObjectArrayValidator` for arrays like order items, line items, attachments, and nested DTO lists.
- Use `ImagesValidator` for gallery or media upload forms.

A good rule is to keep the validation logic in the domain model and keep your controllers or service layer focused on orchestration.
