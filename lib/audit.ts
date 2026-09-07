import prisma from "./prisma";
import { SessionUser } from "@/types";

export interface LogAuditParams {
  actor?: SessionUser | null;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: Record<string, any> | string | null;
  ipAddress?: string | null;
}

export async function createAuditLog({
  actor,
  action,
  entity,
  entityId,
  details,
  ipAddress,
}: LogAuditParams) {
  try {
    const detailsString =
      typeof details === "object" ? JSON.stringify(details) : details;

    return await prisma.auditLog.create({
      data: {
        actorId: actor?.id || null,
        actorName: actor?.name || "System Automation",
        actorRole: actor?.role || "SYSTEM",
        action,
        entity,
        entityId: entityId || null,
        ipAddress: ipAddress || "127.0.0.1",
        details: detailsString,
      },
    });
  } catch (error) {
    console.error("Audit log creation failed:", error);
    return null;
  }
}
