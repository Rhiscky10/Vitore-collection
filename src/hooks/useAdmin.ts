import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useAdmin = () => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.email) {
      setIsAdmin(false);
      setIsSuperAdmin(false);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const check = async () => {
      setLoading(true);
      const [{ data: adminData }, { data: superData }] = await Promise.all([
        supabase.rpc("is_admin", { _email: user.email! }),
        supabase.rpc("is_super_admin" as any, { _email: user.email! }),
      ]);
      if (cancelled) return;
      setIsAdmin(!!adminData);
      setIsSuperAdmin(!!superData);
      setLoading(false);
    };
    check();
    return () => { cancelled = true; };
  }, [user, authLoading]);

  return { isAdmin, isSuperAdmin, loading: loading || authLoading, user };
};
