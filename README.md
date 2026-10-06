# Soultion-prodiver-login

Solution provider portal built with Next.js 15 (App Router, JavaScript) and Tailwind CSS 3.
The UI follows `Gs1WebformsFrontend`, and product data comes from the `product_catalogue` API.

## Run

```bash
cp .env.example .env.local   # already present with the dev API URL
npm install
npm run dev                  # http://localhost:3000 → redirects to /login
```

**Login** calls `POST /partner_login` on `NEXT_PUBLIC_API_BASE_URL`. The built-in demo account
`demo@gmail.com` / `123456789` signs in locally (no API call) and is shown on the login page with a
**Use** button — see `src/config/demoUser.js`. All URLs and credentials live in `.env.local` — see `.env.example`.

## Structure

```
src/
  lib/apiEndpoints.js        ← every API endpoint string
  lib/api.js                 ← axios client + product API functions + React Query hooks
  context/AuthContext.js     ← demo login/logout (sessionStorage)
  config/routes.js           ← route paths
  config/demoUser.js         ← demo credentials + profile
  utils/product.js           ← API row → UI shape mapper, GTIN validation
  components/common/         ← reusable UI: Button, Input, SelectField, Card, StatCard,
                               Badge, PageHeader, Pagination, DetailRow, Skeleton, StateMessage
  components/layout/         ← Header, Sidebar, AppShell, AppShellSkeleton
  components/products/       ← ProductCard (+ skeleton), ProductImage
  app/(public)/login         ← login page
  app/(protected)/           ← auth-guarded layout (Header + Sidebar)
      dashboard              ← account overview
      products               ← list, search, category filter, pagination
      products/[gtin]        ← product + company detail
```

## Product APIs used

| Hook | Endpoint | When |
|---|---|---|
| `useCategories` | `GET /product_type/` | category dropdown |
| `useProducts` | `GET /new_products` | no filters |
| `useProducts` | `GET /similar_products?search=&product_type=` | text search and/or category |
| `useProducts` | `GET /product_by_gtin` | numeric search (validated Saudi GTIN, 628…) |
| `useProductDetail` | `GET /product_by_gtin` | detail page |

Traceability endpoints (`trace_info`) are intentionally not used.

To add a sidebar entry, add it to `NAV_ITEMS` in `src/components/layout/Sidebar.js` and the path to `src/config/routes.js`.
