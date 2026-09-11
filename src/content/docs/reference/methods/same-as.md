---
title: sameAs()
description: Require a field to match another field on the same DTO.
---

# `sameAs()`

Use `sameAs()` for confirmation fields such as password confirmation. It is evaluated during object validation.

```php
ValidationRegistry::register(
    Registration::class,
    static fn (RuleSet $rules): array => [
        $rules->string('password'),
        $rules->string('passwordConfirmation')->sameAs('password'),
    ]
);
```

The failure code is `same_as`.