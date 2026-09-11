---
title: Composable rules
description: Combine Fynix rules with AllOf, AnyOf, and Not for reusable business constraints.
---

# Composable rules

Fynix v3 includes `AllOf`, `AnyOf`, and `Not` for combining `Validatable` rules. These are useful when a field can satisfy multiple formats or when a value must not satisfy a rule.

```php
use Fynix\Rule;
use Fynix\Rules\AllOf;
use Fynix\Rules\AnyOf;
use Fynix\Rules\Not;

$name = new AllOf([
    Rule::string('name')->min(2),
    Rule::string('name')->max(80),
]);

$contact = new AnyOf([
    Rule::email('contact'),
    Rule::phoneNumber('contact'),
]);

$blockedStatus = new Not(
    Rule::string('status')->in(['blocked']),
    'This status is not allowed.'
);
```

`AllOf` returns the first failed rule. `AnyOf` succeeds when any rule succeeds and otherwise returns the first failure. `Not` succeeds when its wrapped rule fails.