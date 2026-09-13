---
title: genericValidation()
description: Enable or disable the shared validation pipeline for a rule.
---

`genericValidation($enabled = true)` controls the shared validation layer that runs before validator-specific checks. The shared layer handles requiredness, string trimming, HTML tag rejection, and configured length constraints.

```php
use Fynix\Rule;

$rule = Rule::string('rawValue')
    ->genericValidation(false);
```

Pass `true` to enable the shared pipeline again. The method is immutable and returns a new rule.

Most applications should keep generic validation enabled. Disable it only when a specialized validator or an integration deliberately owns presence, normalization, or length behavior.
