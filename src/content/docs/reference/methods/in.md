---
title: in()
description: Restrict a value to an exact allow-list.
---

# `in()`

`in()` allows only values that match the supplied list using strict comparison.

```php
use Fynix\Rule;

$status = Rule::string('status')
    ->in(['draft', 'published']);
```

An unlisted value produces the `value.not_allowed` error code.