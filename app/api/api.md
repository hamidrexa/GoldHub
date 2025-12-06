---
title: Default module
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.30"

---

# Default module

Base URLs:

# Authentication

- HTTP Authentication, scheme: bearer

# gold_artifacts

## POST add product

POST /api/v1/gold_artifacts/product_create

> Body Parameters

```yaml
category: ""
title: ""
karat: 0
weight: 0
price: 0
details: ""
images: ""
inventory: 0

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|
|» category|body|string| yes |defualt: Gold|
|» title|body|string| yes |none|
|» karat|body|integer| no |none|
|» weight|body|number| yes |none|
|» price|body|number| yes |none|
|» details|body|string| no |none|
|» images|body|string(binary)| no |none|
|» inventory|body|integer| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## PATCH update product

PATCH /api/v1/gold_artifacts/product_update/{product_id}/

> Body Parameters

```yaml
category: ""
title: ""
karat: 0
weight: 0
price: 0
details: ""
inventory: 0

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|product_id|path|integer| yes |none|
|body|body|object| no |none|
|» category|body|string| no |none|
|» title|body|string| no |none|
|» karat|body|integer| no |none|
|» weight|body|number| no |none|
|» price|body|number| no |none|
|» details|body|string| no |none|
|» inventory|body|integer| no |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST add image to product

POST /api/v1/gold_artifacts/product_add_image/{product_id}/

> Body Parameters

```yaml
images: ""

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|product_id|path|integer| yes |none|
|body|body|object| no |none|
|» images|body|string(binary)| yes |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## DELETE delete image from product

DELETE /api/v1/gold_artifacts/product_delete_image/{image_id}/

> Body Parameters

```yaml
{}

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|image_id|path|integer| yes |none|
|body|body|object| yes |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET list products

GET /api/v1/gold_artifacts/products_list

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|category|query|string| no |exact matching|
|title|query|string| no |contains matching|
|karat|query|integer| no |exact matching|
|min_weight|query|number| no |none|
|max_weight|query|number| no |none|
|min_price|query|number| no |none|
|max_price|query|number| no |none|
|supplier|query|string| no |exact supplier username|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET cart details

GET /api/v1/gold_artifacts/cart_detail

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST add product to cart

POST /api/v1/gold_artifacts/add_to_cart

> Body Parameters

```yaml
product_id: 0
count: 1

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| yes |none|
|» product_id|body|integer| yes |none|
|» count|body|integer| no |default=1|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST remove product from cart

POST /api/v1/gold_artifacts/remove_from_cart

> Body Parameters

```yaml
product_id: 0

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| yes |none|
|» product_id|body|integer| yes |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST submit order

POST /api/v1/gold_artifacts/submit_order

> Body Parameters

```yaml
{}

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| yes |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST update order status

POST /api/v1/gold_artifacts/update_order_status

> Body Parameters

```yaml
order_id: 0
status: ""

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| yes |none|
|» order_id|body|integer| yes |none|
|» status|body|string| yes |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET orders history

GET /api/v1/gold_artifacts/orders_history

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET sells history

GET /api/v1/gold_artifacts/sells_history

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST pay order

POST /api/v1/gold_artifacts/pay_order/{order_id}/

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|order_id|path|integer| yes |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET users list

GET /api/v1/gold_artifacts/users_list

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST set kyc status

POST /api/v1/gold_artifacts/set_KYC_status

> Body Parameters

```yaml
user_id: 13
new_status: buyer_approved

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|
|» user_id|body|integer| yes |none|
|» new_status|body|string| yes |one of this: "buyer_requested", "supplier_requested", "buyer_approved", "supplier_approved", "buyer_rejected", "supplier_rejected"|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Data Schema

