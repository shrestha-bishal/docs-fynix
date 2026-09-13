---
title: required() and optional()
description: Control whether missing values are accepted.
---

Rules are required by default. Use `optional()` to accept `null` or an empty string, or use `required(false)` for the same behavior.

```php
use Fynix\Rule;

$required = Rule::string('name')->required();
$optional = Rule::string('nickname')->optional();
$explicit = Rule::string('phone')->required(false);
```

`requiredState()` reads the configured state. These methods return immutable clones.

Requiredness runs before type-specific validation. A `null` value or empty string returns a `required` error when the rule is required. Optional values may skip the rest of the pipeline when they are empty.

```php
$name = Rule::string('name')->required();
$nickname = Rule::string('nickname')->optional();

$name->validate(null); // required error
$nickname->validate(null); // null
```

Use `requiredIf()` and `requiredUnless()` when presence depends on another field in the same object.