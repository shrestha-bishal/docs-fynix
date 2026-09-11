---
title: UrlValidator
description: Validate URL strings with configurable length limits.
---

# UrlValidator

```php
use Fynix\Rule;

$validator = Rule::url('website')->max(2048);
$error = $validator->validateField('https://fynixphp.netlify.app');
```

URLs are checked with PHP URL validation. The default accepted length is 1 to 2048 characters.