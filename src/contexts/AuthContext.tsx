import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signInWithEmail: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null }>;
  signUpWithEmail: (
    email: string,
    password: string,
    fullName: string,
    metadata?: Record<string, any>
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "https://vitore-collection.vercel.app",
        },
      });

      return {
        error: error ? new Error(error.message) : null,
      };
    } catch (err) {
      return {
        error:
          err instanceof Error
            ? err
            : new Error("Google sign-in failed"),
      };
    }
  };

  const signInWithEmail = async (
    email: string,
    password: string
  ) => {
    try {
      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      return {
        error: error ? new Error(error.message) : null,
      };
    } catch (err) {
      return {
        error:
          err instanceof Error
            ? err
            : new Error("Sign-in failed"),
      };
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    fullName: string,
    metadata?: Record<string, any>
  ) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            ...(metadata || {}),
          },
          emailRedirectTo:
            "https://vitore-collection.vercel.app",
        },
      });

      return {
        error: error ? new Error(error.message) : null,
      };
    } catch (err) {
      return {
        error:
          err instanceof Error
            ? err
            : new Error("Sign-up failed"),
      };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```
