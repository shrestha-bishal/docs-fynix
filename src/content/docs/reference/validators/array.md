---
title: ArrayValidator
description: Validate arrays, item counts, and every item in a collection.
---


```php
use Fynix\Rule;

$validator = Rule::arrayOf('tags')
    ->min(1)
    ->max(5)
    ->each(Rule::string('tag')->length(2, 30));

$errors = $validator->validateAll(['php', '']);
```

`min()` and `max()` constrain the item count. `each()` applies a validator to every item and reports errors using keys such as `tags.1`.