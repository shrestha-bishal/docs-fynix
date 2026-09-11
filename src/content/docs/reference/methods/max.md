---
title: max()
description: Set a maximum length, numeric value, or collection size.
---

# `max()`

`max()` returns a new rule with an upper bound.

```php
use Fynix\Rule;

$title = Rule::string('title')->max(120);
$score = Rule::number('score')->max(100);
$items = Rule::arrayOf('items')->max(20);
```

The meaning follows the validator: text length, numeric value, or collection count.