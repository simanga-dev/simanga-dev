import * as schema from "./schema";
import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

let db: PostgresJsDatabase<typeof schema>;
let pg: ReturnType<typeof postgres>;

const conn = process.env.DATABASE_URL || "";

if (process.env.NODE_ENV === "production") {
  pg = postgres(conn);
  db = drizzle(pg, { schema });
} else {
  if (!(global as any).database!) {
    pg = postgres(conn);
    (global as any).database = drizzle(pg, { schema });
  }
  db = (global as any).database;
}

export { db, pg };
