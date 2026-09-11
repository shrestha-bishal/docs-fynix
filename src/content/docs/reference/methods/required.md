---
title: required() and optional()
description: Control whether missing values are accepted.
---

# `required()` and `optional()`

Rules are required by default. Use `optional()` to accept `null` or an empty string, or use `required(false)` for the same behavior.

```php
use Fynix\Rule;

$required = Rule::string('name')->required();
$optional = Rule::string('nickname')->optional();
$explicit = Rule::string('phone')->required(false);
```

`requiredState()` reads the configured state. These methods return immutable clones.