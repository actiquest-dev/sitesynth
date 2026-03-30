# Reference Harvester

Tiny service that returns only brand names + URLs in JSON.

## Run

```bash
cd services/reference-harvester
npm start
```

## API

`POST /harvest`

Headers:
- `Authorization: Bearer <REFERENCE_HARVESTER_TOKEN>` (optional, if token is set)

Body (optional):

```json
{
  "sources": [
    "https://www.awwwards.com/websites/",
    "https://land-book.com/"
  ]
}
```

Response:

```json
{
  "success": true,
  "total": 123,
  "candidates": [
    { "brand": "Linear", "url": "https://linear.app", "host": "linear.app", "source": "awwwards.com" }
  ],
  "errors": []
}
```

