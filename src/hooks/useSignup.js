import { useState, useEffect } from "react";
import { auth, db } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Navigate } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";
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

      console.log("res: ", res);

      // upload user thumbnail
      const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`;
      const storageRef = await ref(storage, uploadPath);

      //const imgUrl = await img.ref.getDownloadURL();
      const img = await uploadBytes(storageRef, thumbnail).then((snapshot) => {
        getDownloadURL(storageRef)
          .then((url) => {
            updateProfile(res.user, { displayName, photoURL: url });
            setDoc(doc(db, "users", res.user.uid), {
              online: true,
              displayName,
              photoURL: url,
            });
          })
          .then(() =>
            // dispatch login action
            dispatch({ type: "LOGIN", payload: res.user })
          );
      });

      console.log("uploadPath, img:", uploadPath, img);

      // add display AND PHOTO_URL name to user
      //await updateProfile(res.user, { displayName, photoURL: imgUrl });
      /*
      // create a user document
      await setDoc(doc(db, "users", res.user.uid), {
        online: true,
        displayName,
        photoURL: imgUrl,
      });

      // dispatch login action
      dispatch({ type: "LOGIN", payload: res.user });
      */
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
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
