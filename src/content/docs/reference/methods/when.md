---
title: when()
description: Run a Fynix validator only when its owning object satisfies a closure condition.
---

Use `when()` when a complete validator should be active only for certain object
states. The closure receives the object being validated and must return a
boolean:

```php
use Fynix\Rule;

$rule = Rule::for($order)
    ->string('companyName')
    ->min(10)
    ->when(static fn (Order $order): bool => $order->shippingMethod === 'business');
```

When the closure returns `false`, the validator returns no errors and skips its
type, length, requiredness, and related-field checks. The condition is evaluated
during validation, so it sees the current object state.

Use `requiredIf()`, `requiredUnless()`, `prohibitedIf()`, or
`prohibitedUnless()` when only field presence or prohibition is conditional.
Those methods also accept closure predicates.