---
id: examples
title: Examples
description: Detailed Fynix v3 examples with PHP source, input data, and returned validation results.
sidebar:
  order: 1
---


These examples show Fynix at the point where validation becomes useful in an application: a request arrives, rules are defined, an object is validated, and the returned result is mapped into a form or API response.

Every example includes:

- the DTO or value being validated
- the rule definition
- representative invalid input
- the exact result shape
- the API choice that fits the workflow

## Choose an example

| Example | What it demonstrates |
| --- | --- |
| [Registration workflow](./registration) | Nested DTOs, conditional requiredness, and API errors. |
| [Nested order validation](./nested-order) | Arrays of objects and dot-notated error paths. |
| [Field and API errors](./field-errors) | Standalone values, `validate()`, and `validateAll()`. |
| [Interactive playground](/playground) | Edit sample values in the browser and inspect a representative returned result. |

The [registration guide](/guides/registration) provides the longer tutorial version of the first example. These pages focus on copyable patterns and their output.
