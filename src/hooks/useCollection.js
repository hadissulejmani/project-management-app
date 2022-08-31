import { useEffect, useState, useRef } from "react";
import { db } from "../firebase/config";
import { collection, where, query, orderBy } from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";

export const useCollection = (col) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

  // if we don't use a ref --> infinite loop in useEffect
  // _query is an array and is "different" on every function call
  //const queryRef = useRef(_query).current;
  //const orderByRef = useRef(_orderBy).current;

  useEffect(() => {
    /*
    const q = query(
      collection(db, col),
      queryRef
        ? where(...queryRef)
        : orderByRef
        ? orderBy(...orderByRef)
        : orderBy()
    );
*/
    const unsubscribe = onSnapshot(
      collection(db, col),
      (snapshot) => {
        let results = [];
        snapshot.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
        });

        // update state
        setDocuments(results);
        setError(null);
      },
      (error) => {
        console.log(error);
        setError("could not fetch the data");
      }
    );

    // unsubscribe on unmount
    return () => unsubscribe();
  }, [col]);

  return { documents, error };
};
