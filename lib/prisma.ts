import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "#/prisma/generated/client.ts";

const adapter = new PrismaBetterSqlite3({ url: Deno.env.get("DB_FILE_NAME")! });
const prisma = new PrismaClient({ adapter });

export default prisma;
