# Stripe Integration Setup

## Environment Variables

### Local Development

Create a `.env.local` file in the project root (`/sitesynth/`) with your Stripe test keys:

```env
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

⚠️ **Important**: Never commit `.env.local` to git. It's already in `.gitignore`.

### Production

For production deployment (Vercel), add these environment variables in your Vercel project settings:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add the same variables with your production Stripe keys (pk_live_* and sk_live_*)

## Getting Stripe Keys

### 1. Create Stripe Account
- Go to [stripe.com](https://stripe.com)
- Sign up for a free account

### 2. Get Publishable & Secret Keys
- Go to Dashboard → Developers → API Keys
- You'll see two keys under "Publishable key" and "Secret key"
- Test keys start with `pk_test_` and `sk_test_`
- Production keys start with `pk_live_` and `sk_live_`

### 3. Get Webhook Secret
- Go to Dashboard → Developers → Webhooks
- Click "Add endpoint"
- For local testing, use ngrok or similar tunnel tool
- Endpoint URL: `https://your-domain/api/webhooks/stripe`
- Events to listen for:
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
  - `charge.refunded`
- Copy the "Signing secret" (starts with `whsec_`)

## Testing with Test Card Numbers

Use these test card numbers in development:

| Number | Exp | CVC | Description |
|--------|-----|-----|-------------|
| 4242424242424242 | Any future | Any 3 digits | Successful payment |
| 4000000000000002 | Any future | Any 3 digits | Card declined |
| 4000002500003155 | Any future | Any 3 digits | Requires authentication |

## API Endpoints

### Process Payment
- **POST** `/api/process-payment`
- Processes a payment with a Stripe token
- Request body:
  ```json
  {
    "token": "tok_visa",
    "amount": 1170,
    "email": "customer@example.com",
    "billingData": {
      "fullName": "John Doe",
      "street": "123 Main St",
      "city": "New York",
      "postal": "10001",
      "country": "US"
    }
  }
  ```

### Create Payment Intent
- **POST** `/api/create-payment-intent`
- Creates a PaymentIntent for advanced payment flows
- Request body:
  ```json
  {
    "amount": 1170,
    "email": "customer@example.com",
    "description": "Growth Plan Payment"
  }
  ```

### Webhook Handler
- **POST** `/api/webhooks/stripe`
- Receives and processes Stripe webhook events
- Requires valid Stripe signature in `stripe-signature` header

## Payment Flow

1. User fills billing form on `/payment` page
2. User enters card details using Stripe Card Element
3. Frontend creates a token using `@stripe/js`
4. Token is sent to `/api/process-payment` endpoint
5. Backend processes the charge using Stripe SDK
6. On success, user is redirected to `/confirmation` page
7. Session storage contains payment confirmation data

## Webhook Events Handled

- **payment_intent.succeeded**: Payment successful
- **payment_intent.payment_failed**: Payment failed
- **charge.refunded**: Charge was refunded

## Security Notes

✅ All sensitive operations happen on the server side
✅ Stripe SDK is used for PCI compliance
✅ Webhook signatures are verified before processing
✅ Never store raw card data
✅ All keys are environment-protected

## Troubleshooting

### "Stripe publishable key not configured"
- Check that `STRIPE_PUBLISHABLE_KEY` is set in `.env.local`
- Make sure you're using a test key (`pk_test_`)

### "Payment failed" error
- Check Stripe Dashboard for error details
- Verify billing address matches card records
- Try using test card numbers first

### Webhook not working
- Ensure `STRIPE_WEBHOOK_SECRET` is correct
- Check that endpoint URL is publicly accessible
- For local development, use ngrok to tunnel requests

## Automation Features

The current implementation includes:

1. **Payment Processing**: One-time charge processing
2. **Webhook Handling**: Automatic event processing
3. **Error Handling**: Comprehensive validation
4. **Metadata Tracking**: Payment metadata for analysis
5. **Receipt Emails**: Automatic receipts via Stripe

Future enhancements could include:

- Recurring subscriptions
- Invoice automation
- Customer portal
- Refund automation
- Payment analytics
