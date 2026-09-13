---
title: sameAs()
description: Require a field to match another field on the same DTO.
---

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

The comparison uses the current field's value and the named property on the same object. It is not a comparison between two arguments passed to `validate()`.

```php
$user = new User();
$user->password = 'secret';
$user->passwordConfirmation = 'different';

$error = Rule::for($user)
    ->string('passwordConfirmation')
    ->sameAs('password')
    ->validate();
```

Use `Rule::for()`, `Rule::on()`, `RuleSet`, or `ValidationHandler` so Fynix has object context.