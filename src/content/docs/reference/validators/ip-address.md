---
title: IpAddressValidator
description: Validate IPv4 and IPv6 address strings.
---


```php
use Fynix\Rule;

$error = Rule::ipAddress('clientIp')->validate('2001:db8::1');
```

Validation delegates to PHP IP address validation and accepts both IPv4 and IPv6 values.