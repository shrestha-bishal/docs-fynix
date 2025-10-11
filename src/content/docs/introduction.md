---
id: introduction
title: Introduction
sidebar_position: 1
---

# Fynix — The Modern PHP Validation Engine

**Fynix** is a modern, extensible validation engine for PHP — designed to handle everything from **primitive data types** to **deeply nested objects** with speed, clarity, and flexibility.

Inspired by the simplicity of Laravel’s validation, but built as a **framework-agnostic core**, Fynix empowers developers to define, compose, and reuse validation logic across any modern PHP application.

---

## Why Fynix?

Most validation libraries stop at arrays and simple rules.  
Fynix goes further — enabling **object-level validation**, **nested DTO validation**, and **typed rule definitions** that scale effortlessly with complex application domains.

**Key Highlights:**
- Type-safe, object-oriented validation
- Nested and recursive validation support
- Flexible rule registration and extension system
- Context-aware error messages
- Lightweight and high-performance core
- Framework-agnostic — works with Laravel, Symfony, Slim, or standalone

## Features
- **Comprehensive Validation**: Strings, numbers, emails, phone numbers, passwords, images, arrays of images, nested objects, and arrays of objects.
- **Extensible Architecture**: Easily add custom validation rules or extend built-in validators.
- **Validator Options**: Fine-grained control over required fields, length, numeric ranges, file types, and more.
- **Nested & Array Validation**: Validate nested objects and arrays of objects using registered rules.
- **Error Normalization**: Flatten nested error structures for easy form binding.
- **Centralized Registry**: Register and retrieve validation rules for any class.
- **Open Source**: MIT-licensed and open for contributions.

---

## Example Overview

Here’s a simple example of how Fynix validates nested data objects:
```php
<?php 
namespace App\Dto\Quote;;

use App\Dto\Address\AddressDto;
use App\Traits\ArrayConvertible;
use DateTime;

class FreightDto {
    use ArrayConvertible;

    public ?int $id = null;

    /**@var PackageDto[] */
    public array $packages = [];
    public ?string $customerName;
    public ?DateTime $shippingDate;
    public bool $containsDangerousGoods = false;
    public AddressDto $pickupAddress;
    public AddressDto $deliveryAddress;
}
```

### Nested DTO Structure
```
$freight = new FreightDto();
$freight->packages[] = (new PackageDto())->items[] = new ItemDto();
$freight->pickupAddress = new AddressDto();
$freight->deliveryAddress = new AddressDto();
```

### Setting Up Example Validation
Validation rules are registered using the `ValidationRegistry`. You can organize rules by DTO type for better structure and maintainability.
```php
<?php
class ValidationRuleServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        self::registerDimensionValidation();
        self::registerItemValidation();
        self::registerAddressValidation();
        self::registerShippingValidation();
        self::registerPackageValidation();
    }

    private static function registerDimensionValidation() : void {
        ValidationRegistry::register(DimensionDto::class, function(DimensionDto $dimension) {
            return [
                new NumberValidator('Length', 'lengthCm', new NumberValidationOptions(number: [1, 1800])),
                new NumberValidator('Width', 'widthCm', new NumberValidationOptions(number: [1, 1800])),
                new NumberValidator('Height', 'heightCm', new NumberValidationOptions(number: [1, 2000])),
                new NumberValidator('Weight', 'weightKg', new NumberValidationOptions(number: [1, 1000]))
            ];
        });
    }

    private static function registerItemValidation() : void
    {
       ValidationRegistry::register(ItemDto::class, function (ItemDto $dto) {
            return [
                new StringValidator('Description', 'description'),
                new ObjectValidator('dimension', DimensionDto::class),
           ];
       });
    }

    private static function registerAddressValidation() : void 
    {
        ValidationRegistry::register(AddressDto::class, function(AddressDto $dto) {
            return [
                new StringValidator('Suburb', 'suburb'),
                new NumberValidator('Postcode', 'postcode', new NumberValidationOptions(length: [2, 10])),
                new StringValidator('State', 'state', new StringValidationOptions(length: [2, 6])),
                new StringValidator('Country', 'countryCode', new StringValidationOptions(length: [2, 4]))
            ];
        });
    }

    private static function registerShippingValidation(): void 
    {
        ValidationRegistry::register(FreightDto::class, function(FreightDto $dto) {
            return[
                new ObjectArrayValidator('packages', PackageDto::class),
                new StringValidator('Customer name', 'customerName', new StringValidationOptions(length: [0, 50], isRequired: false)),
                new ObjectValidator('pickupAddress', AddressDto::class),
                new ObjectValidator('deliveryAddress', AddressDto::class),
            ];
        });
    }

    private static function registerPackageValidation(): void {
        ValidationRegistry::register(PackageDto::class, function(PackageDto $dto) {
            return [
                new StringValidator('Package Type', 'type'),
                new StringValidator('Description', 'description', new StringValidationOptions(length: [0, 50], isRequired: false)),
                new ObjectValidator('dimensions', DimensionDto::class),
                new ObjectArrayValidator('items', ItemDto::class)
            ];
        });
    }
}
```

### Validating DTOs
Once your validation rules are registered, you can validate DTO instances anywhere in your application:
```php
<?php
    $dto = DtoMapper::toFreightDto($args);
    $errors = ValidationHandler::validate($dto);
    $flattenedErrors = ValidationHandler::flattenValidationErrors($errors);
    
    if(count($errors) > 0) 
        return;
```