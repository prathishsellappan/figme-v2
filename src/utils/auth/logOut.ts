import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";

//TODO: Delete the data from local storage

export const logOut = async (): Promise<void> => {
  await signOut(auth);
};
