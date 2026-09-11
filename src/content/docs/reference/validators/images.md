---
title: ImagesValidator
description: Validate a collection of uploaded images with count and file-size limits.
---

# ImagesValidator

Use `ImagesValidator` for galleries, attachments, or any field containing multiple uploaded images.

## Create a rule

```php
Rule::images(string $field): ImagesValidator
```

## Methods

| Method | Description |
| --- | --- |
| `min(int|float $value)` | Set the minimum number of images. |
| `max(int|float $value)` | Set the maximum number of images. |
| `maxFileSizeMB(int $megabytes)` | Set the per-file size limit. |
| `validate(mixed $value)` | Validate the upload collection. |
| `required(bool $required = true)` | Require at least one upload. |
| `optional()` | Allow the collection to be missing. |

## Example

```php
use Fynix\Rule;

$validator = Rule::images('gallery')
    ->min(1)
    ->max(8)
    ->maxFileSizeMB(5);

$errors = $validator->validateFieldAll($_FILES['gallery'] ?? null);
```

Each image is checked using the same content and upload checks as `ImageValidator`. Count limits must be non-negative integers.