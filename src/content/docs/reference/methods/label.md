---
title: label()
description: Set the human-readable field name used in validation messages.
---

`label($label)` replaces the generated display name for a rule without changing the DTO property name or error key.

```php
use Fynix\Rule;

$error = Rule::string('firstName')
    ->label('First name')
    ->min(2)
    ->validate('A');
```

The returned error uses `First name` in its message, while the field remains `firstName` in structured output. `label()` is immutable and returns a new rule.

Use labels for spaces, capitalization, abbreviations, or product language that should not be inferred from the property name.
