---
title: withoutGenericValidation()
description: Disable the shared validation pipeline for a specialized rule.
---

`withoutGenericValidation()` is the convenience form of `genericValidation(false)`. It disables shared requiredness, string trimming, HTML tag rejection, and generic length checks for the rule.

```php
use Fynix\Rule;

$rawValue = Rule::string('rawValue')
    ->withoutGenericValidation();
```

Use this only when the validator or surrounding application code intentionally handles those concerns. The method is immutable and returns a new rule.
