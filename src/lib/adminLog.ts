import { supabase } from "@/integrations/supabase/client";

export type AdminAction =
  | "create" | "update" | "delete" | "status_change" | "login";

export type EntityType =
  | "product" | "category" | "order" | "admin" | "auth";

export const logAdminActivity = async (
  action: AdminAction,
  entityType: EntityType,
  entityId: string | null,
  details?: Record<string, unknown>
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return;
    await supabase.from("admin_activity_logs").insert({
      admin_email: user.email,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details: details ?? null,
    } as any);
  } catch (e) {
    console.error("logAdminActivity failed", e);
  }
};
