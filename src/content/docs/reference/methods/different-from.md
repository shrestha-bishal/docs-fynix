---
title: differentFrom()
description: Require a field to differ from another field on the same DTO.
---

# `differentFrom()`

Use `differentFrom()` when two fields must not contain the same value.

```php
ValidationRegistry::register(
    Profile::class,
    static fn (RuleSet $rules): array => [
        $rules->string('newUsername')->differentFrom('currentUsername'),
    ]
);
```

The failure code is `different_from`.