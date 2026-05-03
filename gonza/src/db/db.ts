import Dexie, { type EntityTable } from "dexie";

interface Setting {
  id: string;
  value: any;
}

const db = new Dexie("GonzaDB") as Dexie & {
  settings: EntityTable<Setting, "id">;
};

// Schema declaration:
db.version(1).stores({
  settings: "id", // primary key "id"
});

export { db };
export type { Setting };
