import { PrismaClient } from "@prisma/client";
import { getDatabaseUrl } from "./db-init";

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const dbUrl = getDatabaseUrl();
  return new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma = global.cachedPrisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.cachedPrisma = prisma;
}

export default prisma;
