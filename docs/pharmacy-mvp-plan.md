# Pharmacy MVP Plan: El Khabiry Premium Order Request App

## Summary

Build a premium Egypt-focused pharmacy MVP inspired by El Khabiry, El Ezaby, Seif, and Cyne, with El Khabiry branding as the main visual direction.

The MVP supports two equal user paths:

- Product ordering.
- Prescription upload.

Both paths lead to a request summary and local order confirmation.

Use a separated monorepo structure:

- `apps/mobile`: Expo + React Native + TypeScript app.
- `apps/api`: Node.js + TypeScript backend API.

Reference inputs:

- El Khabiry app listing: https://play.google.com/store/apps/details?id=com.awfar.elkhabiry
- El Ezaby app listing: https://apps.apple.com/eg/app/elezaby/id1528993866
- Seif app listing: https://apps.apple.com/eg/app/seif-pharmacies-%D8%B5%D9%8A%D8%AF%D9%84%D9%8A%D8%A9-%D8%B3%D9%8A%D9%81/id6463644571
- Cyne app listing: https://play.google.com/store/apps/details?id=com.rizme.cyne

## Key Changes

- Restructure the repo into npm workspaces with `apps/mobile` and `apps/api`.
- Keep the current Expo Router approach in mobile: bottom tabs for `Home`, `Categories`, `Orders`, and `More`.
- Keep Cart out of the bottom navigator; expose the request/cart summary through a header action.
- Use El Khabiry-inspired turquoise, white, and light gray branding with a modern clinical premium style.
- Keep English copy for v1, but structure layout and copy so Arabic and RTL can be added later.

## Mobile App

Home screen:

- Premium branded header.
- Search entry.
- Two equal primary actions: `Shop products` and `Upload prescription`.
- Offers/promos section.
- Categories preview.
- Popular products preview.
- Header request/cart button.

Categories:

- Category grid/list from API.
- Category detail/product listing.

Products:

- Product listing with search/filter by category.
- Product detail screen with image placeholder, price, description, availability text, and add-to-request action.

Prescription:

- Upload prescription image using Expo image picker.
- Send file to backend as multipart upload.
- Attach uploaded prescription to request summary.

Request summary:

- Show selected products and uploaded prescriptions.
- Collect customer name, phone, address, and optional notes.
- Submit order request to API.

Orders:

- List locally/API-created mock orders.
- Order detail with simple statuses: `Received`, `Preparing`, `Out for delivery`, `Delivered`.

More:

- Support/contact placeholder.
- Branches placeholder.
- Language placeholder.
- About El Khabiry placeholder.

## Backend API

- Use Node.js + TypeScript + Express.
- Use Prisma + SQLite for MVP persistence.
- Do not add Docker for v1.
- Store uploaded prescription files locally in `apps/api/uploads`.
- Exclude uploaded files from git.
- Seed demo data for categories, products, offers, and sample orders.

API endpoints:

- `GET /health`
- `GET /categories`
- `GET /products?query=&categoryId=`
- `GET /products/:id`
- `GET /offers`
- `POST /uploads/prescriptions`
- `POST /orders`
- `GET /orders`
- `GET /orders/:id`

Order request shape:

- Customer: name, phone, address.
- Items: product id, quantity.
- Prescriptions: uploaded file ids.
- Notes: optional.
- Status: starts as `Received`.

## Dependencies And Implementation Decisions

- Mobile may add `expo-image-picker` using the Expo SDK 54-compatible install flow.
- API adds Express, Prisma, SQLite client, Multer for uploads, and Zod for request validation.
- Mobile uses `EXPO_PUBLIC_API_URL` for backend URL.
- No auth, payment, insurance, barcode scan, live maps, admin dashboard, or production upload storage in v1.
- Before mobile code changes, re-check Expo SDK 54 docs as required by `AGENTS.md`: https://docs.expo.dev/versions/v54.0.0/

## Test Plan

- Run TypeScript checks for both apps.
- Run ESLint for mobile and API.
- Verify mobile navigation:
  - Tabs render correctly.
  - No bottom navigator overlap.
  - Cart/request summary is accessible from header, not bottom nav.
- Verify API:
  - Seed data loads.
  - Products/categories/offers endpoints return expected data.
  - Prescription upload stores a local file and returns metadata.
  - Order creation works with products, prescriptions, or both.
- Manual MVP demo scenario:
  - User opens Home.
  - Browses category/product.
  - Adds item to request.
  - Uploads prescription.
  - Opens request summary.
  - Enters contact/address.
  - Submits request.
  - Sees confirmation.
  - Finds the created order under Orders.

## Assumptions

- El Khabiry exact brand assets are not available yet, so v1 uses an approximate turquoise/gray/white palette.
- Backend and mobile live in the same repo but separate apps.
- SQLite is sufficient for the MVP and can later migrate to PostgreSQL.
- Uploaded prescription files are demo/local only and not production medical document storage.
- English ships first; Arabic/RTL is planned but not implemented in this phase.
