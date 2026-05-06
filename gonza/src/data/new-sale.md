# New Sale Page Data Documentation

This document describes the data required for the "New Sale" page, how it is fetched, cached locally, and synchronized with the backend – including offline support.

## Data Entities

### 1. Customer Categories

- **Purpose:** Used in `AddCustomer` to categorize customers.
- **Backend Source:** `GET /api/customers/categories/`
- **Local Storage:** `Dexie.js` – `customerCategories` store.
- **Sync Strategy:** Full sync on layout mount (categories rarely change). Handled by `useCustomerStore` via `SalesLayout`.

### 2. Customers

- **Purpose:** Provide autocomplete for existing customers in `AddCustomer`.
- **Backend Source:** `GET /api/customers/customers/` (supports pagination, `updated_at__gte`, and `branchId` filter)
- **Local Storage:** `Dexie.js` – `customers` store.
- **Sync Strategy:** Delta (incremental) sync from `useCustomerStore`. Only changed records are fetched using `updated_at__gte`.

### 3. Sale Categories

- **Purpose:** Categorise sales (optional field in the Payment section).
- **Backend Source:** `GET /api/sales/categories/`
- **Local Storage:** `Dexie.js` – `saleCategories` store.
- **Sync Strategy:** Full sync on layout mount.

### 4. Sale Sources

- **Purpose:** Select where the sale originated (e.g., Referral, Social Media).
- **Backend Source:** `GET /api/sales/sources/`
- **Local Storage:** `Dexie.js` – `saleSources` store.
- **Sync Strategy:** Full sync on layout mount.

### 5. Products / Services

- **Purpose:** Used in `ProductService` to select items for the sale.
- **Backend Source:** `GET /api/inventory/products/` (supports pagination, `updated_at__gte`, and `branchId` filter)
- **Local Storage:** `Dexie.js` – `products` store.
- **Sync Strategy:** Delta (incremental) sync from `useProductStore`.

### 6. Sales Creation & Offline Queue

- **Purpose:** Final submission of a sale.
- **Backend Endpoint:** `POST /api/sales/sales/`
- **Online Strategy:** Submit directly to backend, show receipt, reset form.
- **Offline Strategy:** If network error occurs, the sale is stored in the `pendingSales` Dexie table and synchronised later via `syncQueue`.

## Architecture: Centralised Sync & Offline Support

The sync logic is split into three domain-specific stores, each handling its own data and incremental sync timestamps. A layout component triggers syncs, and an offline queue manages pending sales.

### Domain Stores

| Store              | Data                                                                    | Sync Type                                                   | Delta Support         |
| ------------------ | ----------------------------------------------------------------------- | ----------------------------------------------------------- | --------------------- |
| `useProductStore`  | Products, Inventory Categories                                          | Delta (products), Full (categories)                         | Yes (products)        |
| `useCustomerStore` | Customers, Customer Categories                                          | Delta (customers), Full (categories)                        | Yes (customers)       |
| `useSalesStore`    | Sales, Sale Items, Sale Categories, Sale Sources, Installments, Returns | Delta (sales, items, installments, returns), Full (lookups) | Yes (all main tables) |

### Sync Helpers

- **`syncDelta`** – Handles paginated DRF endpoints, fetches records with `updated_at__gte`, and upserts into Dexie. Returns the latest `updated_at` timestamp.
- **`lastSync`** – Stores per‑table timestamps in Dexie settings to enable incremental sync.

### Pending Sales Queue

- **`syncQueue`** – Manages local sales created while offline.
  - Adds sale to `pendingSales` table with status `pending`.
  - Automatically processes queue when the browser comes online.
  - Retries failed sales with exponential backoff (configurable).
  - Provides a UI indicator (`PendingSyncIndicator`) showing count of pending sales and manual sync control.

### Layout Orchestration

`SalesLayout` (wraps all `/agency/sales/*` routes):

- On mount, reads the user’s `branchId` from `useAuthStore`.
- Calls `sync(false, branchId)` for all three stores in parallel.
- Only re‑syncs when `branchId` changes or a forced sync is requested.

### UI Components

- **PendingSyncIndicator** – A glass‑styled floating badge (bottom‑right) showing queued sale count. Appears only when pending sales exist and provides a manual sync button.
- **NewSale form** – Submits sale directly; on network failure, calls `syncQueue.queueSale()` and alerts the user.

## Summary of Sync Workflow

1. User navigates to any sales page.
2. `SalesLayout` mounts, reads `branchId`, and initiates sync for all three stores.
3. Each store checks its last sync timestamp and fetches only changed records (if any) from the backend using `updated_at__gte`.
4. Records are upserted into Dexie.
5. Components observe Dexie via `useLiveQuery` and update reactively – no prop drilling.
6. When user creates a sale while online, it posts directly; if offline, the sale is queued.
7. `PendingSyncIndicator` shows queue count; when online returns, the queue auto‑processes and eventually removes the pending records.

## Future Considerations (PWA / Advanced Offline)

- Service workers for asset caching and background sync.
- Encryption at rest for stored data.
- Conflict resolution strategies (Last‑Write‑Wins, semantic merging, client‑side flags).
- Workbox navigation preload and image cache API.
- Storage buckets for large media.

These can be added incrementally as the app scales.
