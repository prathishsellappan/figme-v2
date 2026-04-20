import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { db } from "../../../utils/firebase-config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface DesignFilePopProps {
  openClose: boolean; // Define openClose prop
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>; // Function to set showModal
}

const DesignFilePop: React.FC<DesignFilePopProps> = ({ openClose, setShowModal }) => {
  const [fileName, setFileName] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [redirectId, setRedirectId] = useState("");
  const [redirectName, setRedirectName] = useState("");

  const { state: { user } } = useAuth();

  const handleSubmit = async () => {
    if (!user) return;
    
    try {
      const docName = fileName || "Untitled";
      const docRef = await addDoc(collection(db, "files"), {
        name: docName,
        userId: user.uid,
        userEmail: user.email,
        createdAt: serverTimestamp(),
        type: "draft",
        isPublic: false,
        allowedEmails: [] 
      });
      setRedirectId(docRef.id);
      setRedirectName(docName);
      setShowModal(false); 
      setRedirect(true);
    } catch (error) {
      console.error("Error saving file:", error);
      alert("Error creating file. Please try again.");
    }
  };

  return (
    <>
      {redirect && <Navigate to={`/editor?id=${redirectId}&name=${encodeURIComponent(redirectName)}`} />}
      {/* TODO: chagne this to form from UI lib */}
      {/* TODO: ADD ALL THE FORM PROPTRIS + BEST PRACTIS SOON */}
      {openClose ? (
        <div className="fixed inset-0 
        flex items-center justify-center bg-[#1E1E1E] bg-opacity-75">
          <div className="bg-[#1E1E1E]  border-[0.5px] border-borderColor p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-white text-xl font-semibold mb-4">Enter Design File Name</h2>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded mb-4"
              value={fileName}
              required
              placeholder="Untitled"
              onChange={(e) => setFileName(e.target.value)}
            />


            <div className="flex justify-end space-x-2">
              <button
                type="submit"
                className="px-4 py-2  text-white rounded 
                hover:bg-red-400 hover:text-white
                bg-[#1E1E1E]  border-[0.5px] border-borderColor
                "
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-none hover:bg-green-400 hover:transition-all duration-200
                 text-white rounded bg-[#1E1E1E]  border-[0.5px] border-borderColor"
                onClick={handleSubmit}
              >
                Create
              </button>
            </div>


          </div>
        </div>
      ) : null}
    </>
  );
};

export default DesignFilePop;
