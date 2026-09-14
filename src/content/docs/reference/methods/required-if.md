---
title: requiredIf()
description: Require a field when another DTO field has a matching value.
---

`requiredIf($field, $value)` makes a field required when the other field strictly equals the given value.

```php
$rules->string('companyName')
    ->optional()
    ->requiredIf('accountType', 'business');
```

The comparison is strict and the field is required only when the condition matches. Conditional rules need the DTO object, so use them in registered object validation, `Rule::on()`, or `Rule::for()`.

```php
$user = new User();
$user->accountType = 'business';
$user->companyName = '';

$error = Rule::for($user)
    ->string('companyName')
    ->optional()
    ->requiredIf('accountType', 'business')
    ->validate();
```

If `accountType` is not `business`, an empty `companyName` is allowed because the rule is also marked `optional()`.

For conditions based on multiple fields, pass a closure instead. It receives the
object currently being validated:

```php
$rule = Rule::for($order)
    ->string('internationalCode')
    ->optional()
    ->requiredIf(static fn (Order $order): bool =>
        $order->shippingMethod === 'business' && $order->isInternational
    );
```

The closure form is also available on `requiredUnless()`, `prohibitedIf()`, and
`prohibitedUnless()`.