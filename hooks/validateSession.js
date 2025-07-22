import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function validateSession() {
    const router = useRouter();
    const {session, loading} = useSession();
  
    useEffect(() => {
      const checkSession = async () => {
        const session = await getSession();
  
        if (!loading && !session) {
          router.push('/login');
        }
      };
  
      if (!session && !loading) {
        checkSession();
      }
    }, [loading, session, router]);
  
    return session;
}