---
id: examples/uploads
title: File and image validation
description: Validate uploaded files, images, and image collections with Fynix.
sidebar:
  order: 5
---

Use the upload validators at the request boundary. The examples use `$uploadedFile` and `$uploadedImages` as values produced by the application or framework's upload handling.

## Required document upload

```php
use Fynix\Rule;

$error = Rule::file('document')
    ->required()
    ->validate($uploadedFile);
```

Use `file()` when any valid uploaded file is accepted.

## Optional avatar

```php
$error = Rule::image('avatar')
    ->optional()
    ->validate($uploadedAvatar);
```

Use `image()` when a single uploaded image is expected.

## Image gallery

```php
$errors = Rule::images('gallery')
    ->min(1)
    ->max(8)
    ->validateAll($uploadedImages);
```

Use `images()` for a collection of uploaded images and apply collection-size constraints with `min()` and `max()`.

## Uploads in a DTO

```php
final class ProfileUpdate
{
    public mixed $avatar = null;
    public mixed $documents = [];
}

ValidationRegistry::register(
    ProfileUpdate::class,
    static fn (RuleSet $rules): array => [
        $rules->image('avatar')->optional(),
        $rules->images('documents')->optional()->max(5),
    ],
);

$errors = ValidationHandler::validate($profileUpdate);
```

The handler keeps upload validation alongside the rest of the DTO rules.

## Choosing an upload validator

- Use `file()` for one general uploaded file.
- Use `image()` for one uploaded image.
- Use `images()` for multiple uploaded images.
- Use `optional()` when the upload is not required.
- Use `ValidationHandler` when uploads are properties of a DTO.
