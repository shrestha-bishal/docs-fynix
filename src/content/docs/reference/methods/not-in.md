---
title: notIn()
description: Reject exact values with a strict deny-list.
---

`notIn()` rejects values that match the supplied list using strict comparison.

```php
use Fynix\Rule;

$username = Rule::string('username')
    ->notIn(['admin', 'root', 'system']);
```

A rejected value produces the `value.disallowed` error code.

Values not present in the deny-list continue through the rest of the validator pipeline. The comparison is strict.

```php
$username = Rule::string('username')
    ->min(3)
    ->notIn(['admin', 'root']);

$username->validate('alice'); // null
$username->validate('admin'); // value.disallowed error
```

Use `in()` when an allow-list is clearer than a deny-list. The method is immutable.