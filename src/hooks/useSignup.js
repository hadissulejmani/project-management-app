import { useState, useEffect } from "react";
import { auth, db } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase/config";
import { uploadBytes } from "firebase/storage";
export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (email, password, displayName, thumbnail) => {
    setError(null);
    setIsPending(true);

    try {
      // signup
      const res = await createUserWithEmailAndPassword(auth, email, password);

      if (!res) {
        throw new Error("Could not complete signup");
      }

      // upload user thumbnail
      const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`;
      const storageRef = await ref(storage, uploadPath);

      await uploadBytes(storageRef, thumbnail).then((snapshot) => {
        getDownloadURL(storageRef)
          .then((url) => {
            // add display AND PHOTO_URL name to user
            updateProfile(res.user, { displayName, photoURL: url });
            // create a user document
            setDoc(doc(db, "users", res.user.uid), {
              online: true,
              displayName,
              photoURL: url,
            });
          })
          .then(() =>
            // dispatch login action
            dispatch({ type: "LOGIN", payload: res.user })
          )
          .then(() => {
            setIsPending(false);
            setError(null);
          });
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

  return { signup, error, isPending };
};
