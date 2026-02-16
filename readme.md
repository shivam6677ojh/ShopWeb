## Kartme – Full Stack MERN Ecommerce App

This repository contains **Kartme**, a full‑stack MERN ecommerce application inspired by quick‑commerce apps like Blinkit. It includes:

- React + Vite + Tailwind CSS frontend (client)
- Node.js + Express + MongoDB backend (server)
- JWT‑based auth, role‑based admin, cart & orders, Stripe payments, image uploads, and email flows

Use this README as the main guide for setup, development, and deployment.

---

## Features

- User authentication (register, login, OTP verification, forgot/reset password)
- Profile and address management
- Category, sub‑category & product management (admin panel)
- Product search and category‑wise product display
- Shopping cart with add/remove/update quantities
- Checkout flow with address selection and order summary
- Payment integration with Stripe (success & cancel handling)
- Order history and order details page for users
- Image upload via Cloudinary from the backend
- Responsive UI designed for both mobile and desktop

---

## Tech Stack

- **Frontend (client)**
	- React 18 (Vite)
	- React Router DOM
	- Redux Toolkit + React Redux
	- Tailwind CSS
	- Axios, React Hot Toast, SweetAlert2
	- React Hook Form, React Icons, Infinite Scroll

- **Backend (server)**
	- Node.js, Express
	- MongoDB, Mongoose
	- JWT, bcryptjs
	- Stripe
	- Cloudinary
	- Resend (or similar) for transactional emails

---

## Project Structure

```bash
Kartme-MERN-Ecommerce/
	client/   # React + Vite frontend
	server/   # Node + Express backend
	readme.md
```

Both `client` and `server` have their own `package.json` and `.env` files.

---

## Prerequisites

- Node.js (LTS recommended)
- npm or yarn
- MongoDB instance (local or cloud, e.g. MongoDB Atlas)
- Stripe account & API keys
- Cloudinary account (or adjust upload implementation)

---

## Environment Variables

You’ll need `.env` files in **both** `client/` and `server/`.

### Client `.env`

Example (adjust as needed):

```env
VITE_BACKEND_URL=http://localhost:5000
```

Make sure this URL matches the backend base URL.

### Server `.env`

At minimum, configure:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string

JWT_ACCESS_TOKEN_SECRET=your_access_secret
JWT_REFRESH_TOKEN_SECRET=your_refresh_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

EMAIL_FROM=your_email_from
RESEND_API_KEY=your_resend_api_key
```

Check the `.env` files that already exist under `client/` and `server/` and update with your real values.

---

## Installation

Clone the repository and install dependencies for both client and server.

```bash
git clone <this-repo-url>
cd BlinkIt-Clone-Full-Stack-Ecommerce

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

---

## Running the App Locally

Open **two terminals** from the project root.

### 1) Start Backend (server)

```bash
cd server
npm run dev   # starts with nodemon
```

The API should be available at `http://localhost:5000` (or your `PORT`).

### 2) Start Frontend (client)

```bash
cd client
npm run dev
```

Vite will print the local dev URL (usually `http://localhost:5173`).

---

## Available Scripts

### Client (from `client/`)

- `npm run dev` – Start Vite dev server
- `npm run build` – Build production bundle
- `npm run preview` – Preview production build
- `npm run lint` – Run ESLint

### Server (from `server/`)

- `npm run dev` – Start server with nodemon
- `npm start` – Start server with Node

---

## Important Folders

### Client (`client/src`)

- `pages/` – Main pages (Home, Login, Register, Product, Cart, Checkout, Orders, Profile, etc.)
- `components/` – Reusable UI components (Header, Footer, Product Cards, Cart, Forms, etc.)
- `store/` – Redux Toolkit slices and store (user, cart, address, product, order)
- `utils/` – Helper utilities (Axios instance, price formatting, admin check, upload helpers, toasts)
- `route/` – Route configuration for the SPA
- `provider/` – Global context provider(s)

### Server (`server/`)

- `models/` – Mongoose models (User, Product, Category, SubCategory, CartProduct, Order, Address)
- `controllers/` – Route handlers and business logic
- `route/` – Express route definitions (user, product, category, cart, order, upload, etc.)
- `middleware/` – Auth, admin permission, multer for file uploads
- `utils/` – JWT token generators, OTP & email templates, Cloudinary upload helpers
- `config/` – MongoDB connection, Stripe configuration, email configuration

---

## Deployment

- The backend includes a `vercel.json` file to help deploy the API to Vercel or similar platforms.
- For deployment:
	- Deploy `server/` to a Node/Serverless environment.
	- Deploy `client/` as a static site (Vercel, Netlify, etc.) using `npm run build` output.
	- Configure all environment variables in your hosting providers.
	- Set `VITE_BACKEND_URL` in the client `.env` to your live backend URL.

---

## Roadmap / TODO

- Add automated tests (Jest/Supertest for backend, React Testing Library for frontend)
- Improve SEO and performance (meta tags, image optimization, code splitting)
- Add coupons / discount system
- Add analytics for orders and revenue

---

## License

This project is primarily for learning and demonstration. Update this section with a specific license (MIT, ISC, etc.) if you plan to distribute or use it commercially.
