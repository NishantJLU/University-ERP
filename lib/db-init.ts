import fs from "fs";
import path from "path";
import os from "os";
import zlib from "zlib";
import { DB_SNAPSHOT_GZIP_B64 } from "./db-snapshot";

let resolvedDbUrl: string | null = null;

export function getDatabaseUrl(): string {
  if (resolvedDbUrl) {
    return resolvedDbUrl;
  }

  // 1. External cloud database (PostgreSQL / Supabase / Neon)
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && (envUrl.startsWith("postgres://") || envUrl.startsWith("postgresql://"))) {
    resolvedDbUrl = envUrl;
    return resolvedDbUrl;
  }

  // 2. Serverless / Vercel / AWS Lambda environment
  const isServerless =
    Boolean(process.env.VERCEL) ||
    Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
    process.env.NODE_ENV === "production";

  if (isServerless) {
    const tmpDir = os.tmpdir();
    const targetPath = path.join(tmpDir, "dev.db");

    try {
      const targetExists = fs.existsSync(targetPath);
      let needsCopy = !targetExists;

      if (targetExists) {
        const stats = fs.statSync(targetPath);
        if (stats.size < 10000) {
          needsCopy = true;
        }
      }

      if (needsCopy) {
        let copied = false;

        // Try copying from known disk locations in the deployment bundle
        const candidatePaths = [
          path.join(process.cwd(), "prisma", "dev.db"),
          path.join(process.cwd(), "public", "dev.db"),
          path.join(process.cwd(), "dev.db"),
          path.resolve(__dirname, "../../../prisma/dev.db"),
          path.resolve(__dirname, "../../prisma/dev.db"),
          path.resolve(__dirname, "../prisma/dev.db"),
        ];

        for (const candidate of candidatePaths) {
          try {
            if (fs.existsSync(candidate)) {
              const candStats = fs.statSync(candidate);
              if (candStats.size > 10000) {
                fs.copyFileSync(candidate, targetPath);
                try {
                  fs.chmodSync(targetPath, 0o666);
                } catch (_) {}
                copied = true;
                break;
              }
            }
          } catch (_) {
            // continue checking next candidate
          }
        }

        // If disk copy failed (e.g. Vercel pruned binary assets), unpack embedded snapshot
        if (!copied) {
          try {
            const decompressed = zlib.gunzipSync(Buffer.from(DB_SNAPSHOT_GZIP_B64, "base64"));
            fs.writeFileSync(targetPath, decompressed);
            try {
              fs.chmodSync(targetPath, 0o666);
            } catch (_) {}
            copied = true;
          } catch (unpackErr) {
            console.error("Failed to unpack embedded SQLite snapshot:", unpackErr);
          }
        }
      }

      resolvedDbUrl = `file:${targetPath}`;
      return resolvedDbUrl;
    } catch (err) {
      console.error("Error setting up serverless SQLite database:", err);
    }
  }

  // 3. Local development fallback
  const localDb = path.resolve(process.cwd(), "prisma", "dev.db");
  if (fs.existsSync(localDb)) {
    resolvedDbUrl = `file:${localDb}`;
    return resolvedDbUrl;
  }

  resolvedDbUrl = envUrl || "file:./prisma/dev.db";
  return resolvedDbUrl;
}
