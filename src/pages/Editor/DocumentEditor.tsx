import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Room from "./Room";
import Editor from "./Editor";
import {
  canAccessDocument,
  subscribeToDesignDocument,
  type DesignDocument,
} from "../../lib/documents";
import { useAuth } from "../../contexts/AuthContext";

export default function DocumentEditor() {
  const { documentId } = useParams();
  const { state } = useAuth();
  const [documentData, setDocumentData] = useState<DesignDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = state.user;

    if (!documentId || !currentUser) {
      setIsLoading(false);
      setErrorMessage("Document not found.");
      return;
    }

    let isMounted = true;

    const unsubscribe = subscribeToDesignDocument(
      documentId,
      (nextDocument) => {
        if (!isMounted) return;

        if (!nextDocument) {
          setErrorMessage("This document does not exist.");
          setDocumentData(null);
          setIsLoading(false);
          return;
        }

        if (!canAccessDocument(nextDocument, currentUser.uid, currentUser.email)) {
          setErrorMessage("You do not have access to this document.");
          setDocumentData(null);
          setIsLoading(false);
          return;
        }

        setErrorMessage(null);
        setDocumentData(nextDocument);
        setIsLoading(false);
      },
      () => {
        if (!isMounted) return;
        setErrorMessage("The document could not be loaded.");
        setIsLoading(false);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [documentId, state.user]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-backgroundDash text-white">
        Loading document...
      </div>
    );
  }

  if (!documentData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-backgroundDash px-6 text-center text-white">
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold">Document unavailable</h1>
          <p className="text-sm text-[#b9bcc2]">{errorMessage}</p>
          <Link
            to="/dashboard"
            className="inline-flex rounded-md bg-[#0C8CE9] px-4 py-2 text-sm font-medium"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Room roomId={documentData.roomId}>
      <Editor document={documentData} />
    </Room>
  );
}
