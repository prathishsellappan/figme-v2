import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../utils/firebase-config";
import { collection, query, where, onSnapshot, or } from "firebase/firestore";
import { thumbnailBg } from "../utils";

export default function DesignFileObjects() {
  const { state: { user } } = useAuth();
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "files"),
      or(
        where("userId", "==", user.uid),
        where("allowedEmails", "array-contains", user.email)
      )
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const filesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort manually in memory if needed to avoid index requirements
      filesData.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      
      setFiles(filesData);
      setLoading(false);
    }, (error) => {
      console.error("Firestore error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) return <div className="p-10 text-white opacity-50">Loading designs...</div>;

  return (
    <>
      <div className="m-5 p-6 pt-0 pl-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {files.length > 0 ? (
          files.map((file) => (
            <Link key={file.id} to={`/editor?name=${encodeURIComponent(file.name)}`} className="group space-y-2">
              <div
                className="bg-[#1E1E1E] border-[0.5px] border-borderColor 
                 w-full h-48 rounded-xl bg-center bg-cover bg-no-repeat group-hover:border-blue-500 transition-all"
                style={{ backgroundImage: `url(${thumbnailBg})` }}
              ></div>

              <div className="text-white text-sm">
                <h4 className="font-medium group-hover:text-blue-400 transition-colors">{file.name}</h4>
                <p className="text-opacity-50 text-white text-xs">
                  {file.createdAt?.toDate ? `Edited ${new Date(file.createdAt.toDate()).toLocaleDateString()}` : "Newly created"}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full h-40 flex items-center justify-center border-[0.5px] border-dashed border-borderColor rounded-xl">
            <p className="text-white opacity-40 text-sm">No design files yet. Click "New design file" to start!</p>
          </div>
        )}
      </div>
    </>)
}
