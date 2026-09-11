---
title: ImageValidator
description: Validate a single uploaded image, including its content and file size.
---

# ImageValidator

Use `ImageValidator` for a single PHP upload such as a profile or cover image.

## Create a rule

```php
Rule::image(string $field): ImageValidator
```

## Methods

| Method | Description |
| --- | --- |
| `maxFileSizeMB(int $megabytes)` | Set the maximum upload size. |
| `validate(mixed $value)` | Validate the uploaded file. |
| `optional()` | Allow no upload. |
| `isJpegImage(string $contents)` | Check JPEG signatures. |
| `isPngImage(string $contents)` | Check PNG signatures. |
| `isGifImage(string $contents)` | Check GIF signatures. |
| `isBmpImage(string $contents)` | Check BMP signatures. |
| `isTiffImage(string $contents)` | Check TIFF signatures. |
| `isAvifImage(string $contents)` | Check AVIF signatures. |

## Example

```php
use Fynix\Rule;

$validator = Rule::image('profileImage')
    ->maxFileSizeMB(5);

$error = $validator->validateField($_FILES['profileImage'] ?? null);
```

Fynix checks the upload error, temporary path, size, extension, and actual image content. The default size limit is 5 MB.