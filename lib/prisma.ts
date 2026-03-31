import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "#/prisma/generated/client.ts";

const adapter = new PrismaLibSql({ url: process.env.DB_FILE_NAME! });
const prisma = new PrismaClient({ adapter });

export default prisma;
