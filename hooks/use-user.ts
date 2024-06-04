import { getFromLocalstorage } from "@/actions/get-from-localstorage";
import { setInLocalstorage } from "@/actions/set-in-localstorage";
import { User } from "@/interfaces/user.interface";
import { auth, getDocument } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { DocumentData } from "firebase/firestore";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

export const useUser = () => {
  const [user, setUser] = useState<User | undefined | DocumentData>(undefined);
  const pathname = usePathname();
  const router = useRouter();

  const protectedRoutes = ["/dashboard"];
  const isInProtectedRoute = protectedRoutes.includes(pathname);

  const getUserFromDB = async (uid: string) => {
    
    const path = `users/${uid}`;

    try {
      let res = await getDocument(path);
      setUser(res);
      setInLocalstorage("user", res);
    } catch (error) {}
  };

  useEffect(() => {
    return onAuthStateChanged(auth, async (authUser) => {
      // ====== Exist auth user =========
      if (authUser) {
        const userInLocal = getFromLocalstorage("user");

        if (userInLocal) setUser(userInLocal);
        else getUserFromDB(authUser.uid);
      }
      // =======Doesn´t exist auth user =======
      else {

        if(isInProtectedRoute) router.push('/');
      }
    });
  }, []);

  return user;
};
