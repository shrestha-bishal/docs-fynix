---
title: IpAddressValidator
description: Validate IPv4 and IPv6 address strings.
---

# IpAddressValidator

```php
use Fynix\Rule;

$error = Rule::ipAddress('clientIp')->validateField('2001:db8::1');
```

Validation delegates to PHP IP address validation and accepts both IPv4 and IPv6 values.