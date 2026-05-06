# What this file does:

- Defines a singleton SyncQueueService that manages the pendingSales table.

- queueSale(saleData) stores a sale locally and triggers immediate processing if online.

- processQueue() iterates through pending/failed sales, sends them via apiFetch, and updates status.

- Listens for online events and processes queue automatically.

- Provides callbacks for UI feedback (progress, success, error).

Save this file. Let me know when you're ready for File 3: Integrating the queue into NewSale component – we'll modify the sale submission to use the queue when offline.
