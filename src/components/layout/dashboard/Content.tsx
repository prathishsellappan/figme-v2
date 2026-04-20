// Content component
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContentProp } from '../../../types/IDashBoardProp';
import DesignFileBox from "../../common/ui/DesignFileBox";
import DesignFileObjects from "../../DesignFileObjects";
import { useAuth } from "../../../contexts/AuthContext";
import {
  createDesignDocument,
  subscribeToUserDocuments,
  type DesignDocument,
} from "../../../lib/documents";

const Content: React.FC<ContentProp> = ({ recentOrDraft }: ContentProp) => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<DesignDocument[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!state.user) return;

    const unsubscribe = subscribeToUserDocuments(
      state.user.uid,
      state.user.email,
      (nextDocuments) => {
        setDocuments(nextDocuments);
        setLoadError(null);
      },
      () => {
        setLoadError("Documents could not be loaded from Firestore.");
      }
    );

    return () => unsubscribe();
  }, [state.user]);

  const filteredDocuments = useMemo(
    () => documents.filter((documentItem) => documentItem.status === recentOrDraft),
    [documents, recentOrDraft]
  );

  const handleCreateDocument = async () => {
    if (!state.user || isCreating) return;

    try {
      setIsCreating(true);
      const documentId = await createDesignDocument(
        state.user.uid,
        state.user.email || "",
        "recent"
      );
      navigate(`/editor/${documentId}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="w-full">
      <div className="border-b-[0.5px] w-full border-borderColor pt-5 pl-8 text-white pb-5">
        <p>{recentOrDraft === "recent" ? "Workspace" : "Drafts"}</p>
      </div>

      {recentOrDraft === "recent" ? (
        <>
          <DesignFileBox onCreate={handleCreateDocument} isCreating={isCreating} />
          {loadError ? (
            <div className="mx-5 rounded-xl border border-red-500/40 bg-[#202124] p-6 text-sm text-[#f3b0b0]">
              {loadError}
            </div>
          ) : (
            <DesignFileObjects
              documents={filteredDocuments}
              onOpen={(documentId) => navigate(`/editor/${documentId}`)}
              emptyLabel="No documents yet. Create your first cloud-backed design file."
            />
          )}
        </>
      ) : (
        <DesignFileObjects
          documents={filteredDocuments}
          onOpen={(documentId) => navigate(`/editor/${documentId}`)}
          emptyLabel="No draft documents yet."
        />
      )}
    </div>
  );
};

export default Content;
