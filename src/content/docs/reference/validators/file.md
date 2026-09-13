---
title: FileValidator
description: Validate uploaded files with size and extension constraints.
---


```php
use Fynix\Rule;

$validator = Rule::file('attachment')
    ->maxFileSizeMB(10)
    ->extensions(['pdf', 'docx']);

$error = $validator->validate($_FILES['attachment'] ?? null);
```

Fynix checks the upload structure, upload error, readable temporary path, file size, and optional extension allow-list. The default size limit is 10 MB.