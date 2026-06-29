# Tea-Terrific Bakery — Online Ordering System

A full-stack web application for Tea-Terrific Bakery. Customers browse products, place orders, and pay with **M-Pesa STK Push**. Bakery owners manage everything through a secure admin dashboard.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend & Backend | Next.js 14 (App Router) |
| Database | MongoDB Atlas |
| Authentication | NextAuth.js (JWT) |
| Payments | M-Pesa Daraja API (STK Push) |
| Styling | Tailwind CSS |
| Deployment | Vercel |

---

## Project Structure

```
tea-terrific/
├── app/
│   ├── page.jsx                    # Home / product catalog
│   ├── cart/page.jsx               # Shopping cart
│   ├── checkout/page.jsx           # Checkout + M-Pesa payment
│   ├── order/[id]/page.jsx         # Order tracking
│   ├── admin/
│   │   ├── login/page.jsx          # Admin login
│   │   └── dashboard/page.jsx      # Admin dashboard
│   └── api/
│       ├── products/               # GET (public), POST (admin)
│       ├── orders/                 # POST (public), GET (admin)
│       ├── mpesa/
│       │   ├── stkpush/            # Initiate payment
│       │   └── callback/           # Safaricom webhook
│       ├── admin/stats/            # Dashboard statistics
│       └── auth/[...nextauth]/     # NextAuth endpoints
├── components/
│   ├── Navbar.jsx
│   ├── ProductCard.jsx
│   ├── SessionWrapper.jsx
│   └── admin/OrderTable.jsx
├── context/
│   └── CartContext.jsx             # Cart state (localStorage)
├── lib/
│   ├── mongodb.js                  # DB connection (cached)
│   └── mpesa.js                    # Daraja API helpers
├── models/
│   ├── Product.js
│   ├── Order.js
│   └── User.js
├── middleware.js                   # Protects /admin/* routes
└── scripts/seed.js                 # Bootstrap DB
```

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

### 3. Set up MongoDB Atlas
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user
3. Whitelist your IP (or `0.0.0.0/0` for dev)
4. Copy the connection string into `MONGODB_URI`

### 4. Set up M-Pesa Daraja
1. Register at [developer.safaricom.co.ke](https://developer.safaricom.co.ke)
2. Create an app to get `Consumer Key` and `Consumer Secret`
3. Use the sandbox shortcode `174379` and test passkey for development
4. Set `MPESA_ENV=sandbox` in `.env.local`

### 5. Seed the database
```bash
npm run seed
```
This creates:
- Admin account: `admin@teaterrific.com` / `Admin@2024!`
- 8 sample products

**⚠️ Change the admin password after first login!**

### 6. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Key URLs

| URL | Description |
|---|---|
| `/` | Customer storefront |
| `/cart` | Shopping cart |
| `/checkout` | Checkout with M-Pesa |
| `/order/:id` | Order tracking |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Order management |

---

## M-Pesa Payment Flow

1. Customer fills checkout form (name, phone, delivery location)
2. App creates an order in MongoDB (`paymentStatus: "Pending"`)
3. App calls `/api/mpesa/stkpush` → sends STK Push to customer's phone
4. Customer enters M-Pesa PIN on their phone
5. Safaricom calls `/api/mpesa/callback` with payment result
6. App updates order: `paymentStatus: "Paid"`, `orderStatus: "Preparing"`
7. Customer's browser polls for status and shows confirmation

---

## Admin Dashboard

- **Login** at `/admin/login`
- **Stats**: Total, Pending, Preparing, Completed orders + Revenue
- **Order list**: Filter by status, update status via dropdown
- **Status flow**: Pending → Preparing → Ready → Completed

---

## Deployment (Vercel)

```bash
npm install -g vercel
vercel
```

Add all `.env.local` variables in Vercel's Environment Variables settings.

Set `NEXTAUTH_URL` to your production domain (e.g. `https://teaterrific.vercel.app`).

For M-Pesa production:
- Set `MPESA_ENV=production`
- Use live Shortcode, Consumer Key, Consumer Secret, and Passkey

---

## Future Improvements

- [ ] Customer accounts & order history
- [ ] Email/SMS notifications on status change  
- [ ] Product inventory management
- [ ] Delivery tracking integration
- [ ] Analytics dashboard with charts
- [ ] Customer reviews & ratings
- [ ] Multi-branch support
- [ ] Product image uploads (Cloudinary)
