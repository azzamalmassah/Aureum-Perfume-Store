# Aureum Perfume Store

Aureum Perfume Store is a full-stack perfume e-commerce project with a React storefront and admin dashboard backed by an Express and MongoDB API.

## Tech Stack

- Frontend: React 19, Vite, React Router
- Backend: Node.js, Express, MongoDB, Mongoose
- Payments: Stripe Checkout
- Media uploads: Cloudinary

## Project Structure

- `perfume-client/` - Vite frontend for the storefront and admin dashboard
- `perfumStore/backend/` - Express API, auth, orders, items, and payments

## Frontend Features

- Home page with branded marketing sections
- Product collections and top sellers pages
- Product detail page
- Cart and checkout flow
- Auth-aware client with login and signup support
- Admin dashboard protected by an admin route

### Main Routes

- `/` - home
- `/top-sellers` - featured products
- `/collections` - catalog view
- `/product/:id` - product details
- `/cart` - shopping cart
- `/checkout` - checkout flow
- `/admin` - admin dashboard

## Backend Features

- JWT-based authentication
- User signup and login
- Product CRUD endpoints
- Order creation and order history endpoints
- Stripe Checkout session creation
- Cloudinary-backed image upload for item management

### API Base URL

Local backend base URL:

```text
http://localhost:5000/api/v1
```

### Main API Routes

- `POST /users/signup`
- `POST /users/login`
- `GET /users/me`
- `GET /items`
- `GET /items/:id`
- `POST /items`
- `PATCH /items/:id`
- `DELETE /items/:id`
- `POST /items/purchase`
- `POST /payments/session`
- `POST /orders`
- `GET /orders/my-orders`
- `GET /orders`

## Local Setup

### Prerequisites

- Node.js 18+ recommended
- MongoDB connection string
- Stripe test secret key
- Cloudinary account if you want image uploads enabled

### 1. Start the backend

```bash
cd perfumStore/backend
npm install
npm run start
```

The backend runs on port `5000` by default.

### 2. Configure backend environment variables

The backend loads values from `perfumStore/backend/config.env` and also reads `.env` if present.

Typical variables used by the server:

```env
PORT=5000
DB_STRING=your_mongodb_connection_string
JWT_PRIVATE_KEY=your_jwt_secret
EXPIRES_IN=7d
COOKIE_EXPIERS_IN=7
FRONTEND_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_your_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Start the frontend

```bash
cd perfume-client
npm install
npm run dev
```

The frontend runs on `http://localhost:3000`.

### 4. Configure frontend environment variables

Create `perfume-client/.env`:

```env
VITE_API_URL="http://localhost:5000"
```

## Notes

- The frontend API helper appends `/api/v1`, so `VITE_API_URL` should point to the backend origin, not the full API path.
- Checkout and payment session creation are authenticated flows in the current implementation.
- Admin item creation, updates, and deletion require authorized users.
- Secrets should stay out of version control.

## Development Scripts

### Frontend

```bash
npm run dev
npm run build
npm run preview
```

### Backend

```bash
npm run start
npm run start:prod
```
