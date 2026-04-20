import React, { useState, useEffect } from "react";
import { db } from "../../utils/firebase-config";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useSearchParams } from "react-router-dom";
import { Button } from "../common/ui/button";
import { Input } from "../common/ui/input";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [searchParams] = useSearchParams();
  const fileId = searchParams.get("id");
  const [isPublic, setIsPublic] = useState(false);
  const [allowedEmails, setAllowedEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && fileId) {
      fetchFileSettings();
    }
  }, [isOpen, fileId]);

  const fetchFileSettings = async () => {
    if (!fileId) return;
    const docRef = doc(db, "files", fileId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setIsPublic(data.isPublic || false);
      setAllowedEmails(data.allowedEmails || []);
    }
  };

  const togglePublic = async () => {
    if (!fileId) return;
    setLoading(true);
    const docRef = doc(db, "files", fileId);
    await updateDoc(docRef, { isPublic: !isPublic });
    setIsPublic(!isPublic);
    setLoading(false);
  };

  const addEmail = async () => {
    if (!fileId || !newEmail || allowedEmails.includes(newEmail)) return;
    setLoading(true);
    const docRef = doc(db, "files", fileId);
    await updateDoc(docRef, {
      allowedEmails: arrayUnion(newEmail)
    });
    setAllowedEmails([...allowedEmails, newEmail]);
    setNewEmail("");
    setLoading(false);
  };

  const removeEmail = async (email: string) => {
    if (!fileId) return;
    const docRef = doc(db, "files", fileId);
    await updateDoc(docRef, {
      allowedEmails: arrayRemove(email)
    });
    setAllowedEmails(allowedEmails.filter(e => e !== email));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-[#1E1E1E] border border-borderColor p-6 rounded-xl shadow-2xl w-[450px] space-y-6">
        <div className="flex justify-between items-center border-b border-borderColor pb-4">
          <h2 className="text-white text-xl font-bold">Share Design</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">&times;</button>
        </div>

        <div className="space-y-4">
          {/* Public Access Toggle */}
          <div className="flex items-center justify-between p-3 bg-[#2C2C2C] rounded-lg border border-borderColor">
            <div>
              <p className="text-white font-medium text-sm">Public Access</p>
              <p className="text-gray-400 text-xs">Anyone with the link can view/edit</p>
            </div>
            <button
              disabled={loading}
              onClick={togglePublic}
              className={`w-12 h-6 rounded-full transition-colors relative ${isPublic ? 'bg-blue-600' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isPublic ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>

          {/* Email Access */}
          <div className="space-y-2">
            <p className="text-white font-medium text-sm">Allow specific emails</p>
            <div className="flex gap-2">
              <Input
                placeholder="email@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="bg-[#2C2C2C] border-borderColor text-white h-10"
              />
              <Button onClick={addEmail} disabled={loading} className="bg-blue-600 hover:bg-blue-700 h-10 px-4">
                Add
              </Button>
            </div>
            
            <div className="max-h-32 overflow-y-auto space-y-1 mt-2">
              {allowedEmails.map(email => (
                <div key={email} className="flex justify-between items-center text-xs text-gray-300 p-2 hover:bg-[#2C2C2C] rounded transition-colors group">
                  <span>{email}</span>
                  <button onClick={() => removeEmail(email)} className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">Remove</button>
                </div>
              ))}
              {allowedEmails.length === 0 && !isPublic && (
                <p className="text-gray-500 text-xs italic">Only you have access currently.</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            className="flex-1 bg-[#2C2C2C] hover:bg-[#383838] border border-borderColor text-white"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied!");
            }}
          >
            Copy link
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onClose}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
