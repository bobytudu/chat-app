import { onAuthStateChanged } from "firebase/auth";
import React from "react";
import { useDispatch } from "react-redux";
import { db, firebaseAuth } from "services/firebase";
import PublicRouter from "./PublicRouter";
import PrivateRouter from "./PrivateRouter";
import { useAppSelector } from "redux/hooks";
import { setUser, setUsers, stopLoading } from "redux/reducers/auth.reducer";
import Loader from "components/Loader";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export default function Routes() {
  const dispatch = useDispatch();
  const { auth, ws } = useAppSelector((state) => ({
    auth: state.auth,
    ws: state.ws.ws,
  }));
  React.useEffect(() => {
    if (!auth.user) {
      const unsubscribe = onAuthStateChanged(
        firebaseAuth,
        async (currentUser) => {
          if (currentUser) {
            const userObj = {
              displayName: currentUser.displayName || "",
              email: currentUser.email || "",
              photoURL: currentUser.photoURL || "",
              uid: currentUser.uid,
              emailVerified: currentUser.emailVerified,
              isAnonymous: currentUser.isAnonymous,
              phoneNumber: currentUser.phoneNumber || "",
              // providerData: currentUser.providerData,
              // accessToken: await currentUser.getIdToken(),
            };
            // localStorage.setItem("accessToken", userObj.accessToken);

            //get all users
            const userRef = collection(db, "users");
            const snapShot = await getDocs(userRef);
            let users = snapShot.docs.map((doc) => doc.data());

            //add user if not exist
            if (!users.find((user) => user.uid === userObj.uid)) {
              await setDoc(doc(db, "users", userObj.uid), {
                ...userObj,
              });
            } else {
              const data = await getDoc(doc(db, "users", userObj.uid));
              const user = data.data();
              dispatch(setUser(user));
              dispatch(
                setUsers(users.filter((item) => item.uid !== userObj.uid))
              );
            }

            //update socket id
            if (ws && ws.connected) {
              updateDoc(doc(db, "users", userObj.uid), {
                ...userObj,
                socketId: ws.id,
              });
            }
          }
          dispatch(stopLoading());
        }
      );
      return () => unsubscribe();
    }
  }, [auth.user, dispatch, ws]);

  return (
    <div>
      {auth.loading && <Loader loading />}
      {auth.user && !auth.loading && <PrivateRouter />}
      {!auth.user && !auth.loading && <PublicRouter />}
    </div>
  );
}
