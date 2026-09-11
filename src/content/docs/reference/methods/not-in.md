---
title: notIn()
description: Reject exact values with a strict deny-list.
---

# `notIn()`

`notIn()` rejects values that match the supplied list using strict comparison.

```php
use Fynix\Rule;

$username = Rule::string('username')
    ->notIn(['admin', 'root', 'system']);
```

A rejected value produces the `value.disallowed` error code.