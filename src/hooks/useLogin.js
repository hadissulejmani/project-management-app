import { useState, useEffect } from "react";
import { auth, db } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setError(null);
    setIsPending(true);

    try {
      // login
      const res = await signInWithEmailAndPassword(auth, email, password);

      // update online status
      //const documentRef = db.collection("users").doc(res.user.uid);
      const docRef = doc(db, "users", res.user.uid);
      //const docSnap = await getDoc(docRef);
      await updateDoc(docRef, { online: true }).then(() => {
        // dispatch login action
        dispatch({ type: "LOGIN", payload: res.user });
        setIsPending(false);
        setError(null);
      });
      //await documentRef.update({ online: true });
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
