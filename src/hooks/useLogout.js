import { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";
import { signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const useLogout = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const logout = async () => {
    setError(null);
    setIsPending(true);
    setIsCancelled(false);

    try {
      // update online status
      const { uid } = auth.currentUser;

      // sign the user out
      await signOut(auth)
        .then(() => {
          // update state
          setDoc(doc(db, "users", uid), { online: false }, { merge: true });
        })
        .then(
          // dispatch logout action
          dispatch({ type: "LOGOUT" })
        )
        .then(() => {
          setIsPending(false);
          setError(null);
        });
    } catch (err) {
      if (!isCancelled) {
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { logout, error, isPending };
};
