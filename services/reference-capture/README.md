# Reference Capture Service

Headless Chromium capture service for competitor/reference screenshots.

## Environment

- `REFERENCE_CAPTURE_PORT` default `8890`
- `REFERENCE_CAPTURE_HOST` default `127.0.0.1`
- `REFERENCE_CAPTURE_TOKEN` bearer token for POST `/capture`
- `REFERENCE_CAPTURE_STORAGE_ROOT` filesystem root for screenshots
- `REFERENCE_CAPTURE_PUBLIC_BASE_URL` public HTTPS base URL
- `CHROMIUM_PATH` path to Chromium executable

## Endpoints

### `GET /health`

Returns service health.

### `POST /capture`

Authorization:

`Authorization: Bearer <REFERENCE_CAPTURE_TOKEN>`

Body:

```json
{
  "briefId": "brief-123",
  "competitor": "stripe",
  "pages": [
    { "url": "https://stripe.com", "kind": "homepage", "label": "Home" },
    { "url": "https://stripe.com/pricing", "kind": "pricing", "label": "Pricing", "viewport": "desktop" }
  ]
}
```

Response:

```json
{
  "success": true,
  "data": {
    "briefId": "brief-123",
    "competitor": "stripe",
    "assets": [
      {
        "kind": "homepage",
        "label": "Home",
        "sourceUrl": "https://stripe.com",
        "finalUrl": "https://stripe.com/",
        "viewport": "desktop",
        "title": "Stripe",
        "fileName": "home-desktop-xxxx.png",
        "publicUrl": "https://mcp.sitesynth.com/design_references/brief-123/stripe/home-desktop-xxxx.png"
      }
    ]
  }
}
```
