---
title: differentFrom()
description: Require a field to differ from another field on the same DTO.
---

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

The comparison uses the current field's value and the named property on the same object. It passes when the values are not strictly equal.

```php
$profile = new Profile();
$profile->currentUsername = 'alice';
$profile->newUsername = 'alice';

$error = Rule::for($profile)
    ->string('newUsername')
    ->differentFrom('currentUsername')
    ->validate();
```

Use object-bound or handler validation so the related field can be read from the same object.

The closure form receives the object and returns the value that must differ from
the current field:

```php
$rule = Rule::for($profile)
    ->string('newUsername')
    ->differentFrom(static fn (Profile $profile): string => $profile->currentUsername);
```