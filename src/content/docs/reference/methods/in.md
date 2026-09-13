---
title: in()
description: Restrict a value to an exact allow-list.
---

`in()` allows only values that match the supplied list using strict comparison.

```php
use Fynix\Rule;

$status = Rule::string('status')
    ->in(['draft', 'published']);
```

An unlisted value produces the `value.not_allowed` error code.

The comparison is strict, so numeric and string representations are different:

```php
$priority = Rule::integer('priority')->in([1, 2, 3]);

$priority->validate(2);   // null
$priority->validate('2'); // type or allow-list error
```

`in()` is useful for statuses, account types, enum-like request fields, and bounded numeric choices. It returns a new immutable rule.