---
title: RegexValidator
description: Validate strings against a checked regular expression.
---


```php
use Fynix\Rule;

$validator = Rule::regex('reference', '/^[A-Z]{3}-[0-9]{4}$/');
$error = $validator->validate('ABC-1234');
```

An invalid pattern throws `InvalidArgumentException` when the rule is created. Values must be strings and must match the expression.