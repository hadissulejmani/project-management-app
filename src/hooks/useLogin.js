import { useState, useEffect } from "react";
import { auth, db } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setError(null);
    setIsPending(true);
    setIsCancelled(false);

    try {
      // login
      const res = await signInWithEmailAndPassword(auth, email, password);

      // update online status
      const docRef = doc(db, "users", res.user.uid);
      await updateDoc(docRef, { online: true })
        .then(
          // dispatch login action
          dispatch({ type: "LOGIN", payload: res.user })
        )
        .then(setIsPending(false), setError(null));
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

  return { login, isPending, error };
};
