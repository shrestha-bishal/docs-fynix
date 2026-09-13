---
title: requiredUnless()
description: Require a field unless another DTO field has a matching value.
---

`requiredUnless($field, $value)` makes a field required when the other field does not strictly equal the given value.

```php
$rules->string('taxId')
    ->optional()
    ->requiredUnless('customerType', 'individual');
```

The comparison is strict and the field is required when the condition does not match. Use this in a `RuleSet` registry factory, with `Rule::on()`, or with `Rule::for()` so Fynix can inspect the owning DTO.

```php
$customer = new Customer();
$customer->customerType = 'company';
$customer->taxId = '';

$error = Rule::for($customer)
    ->string('taxId')
    ->optional()
    ->requiredUnless('customerType', 'individual')
    ->validate();
```