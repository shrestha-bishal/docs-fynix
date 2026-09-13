---
title: DateTimeValidator
description: Validate DateTimeInterface instances and date strings with optional format matching.
---


```php
use Fynix\Rule;

$validator = Rule::dateTime('startsAt')->format('Y-m-d H:i:s');
$error = $validator->validate('2026-09-11 09:30:00');
```

Without `format()`, Fynix uses PHP date parsing. With a format, the formatted value must exactly match the input. Existing `DateTimeInterface` instances are accepted.