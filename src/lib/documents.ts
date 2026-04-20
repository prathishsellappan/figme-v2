import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Timestamp,
} from "firebase/firestore";
import { db } from "../utils/firebase-config";

export type DocumentStatus = "recent" | "draft";

export type DesignDocument = {
  id: string;
  title: string;
  ownerId: string;
  ownerEmail: string;
  collaboratorIds: string[];
  collaboratorEmails: string[];
  roomId: string;
  status: DocumentStatus;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
};

type StoredDesignDocument = Omit<DesignDocument, "id">;

const designFilesCollection = collection(db, "designFiles");

const toDesignDocument = (
  id: string,
  data: Partial<StoredDesignDocument>
): DesignDocument => ({
  id,
  title: data.title || "Untitled canvas",
  ownerId: data.ownerId || "",
  ownerEmail: data.ownerEmail || "",
  collaboratorIds: data.collaboratorIds || [],
  collaboratorEmails: data.collaboratorEmails || [],
  roomId: data.roomId || `document-${id}`,
  status: data.status || "recent",
  createdAt: data.createdAt || null,
  updatedAt: data.updatedAt || null,
});

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const sortDocuments = (documents: DesignDocument[]) => {
  const uniqueDocuments = Array.from(
    new Map(documents.map((documentItem) => [documentItem.id, documentItem])).values()
  );

  return uniqueDocuments.sort((a, b) => {
    const aTime = a.updatedAt?.toMillis() || a.createdAt?.toMillis() || 0;
    const bTime = b.updatedAt?.toMillis() || b.createdAt?.toMillis() || 0;
    return bTime - aTime;
  });
};

export const createDesignDocument = async (
  ownerId: string,
  ownerEmail: string,
  status: DocumentStatus = "recent"
) => {
  const newDocRef = await addDoc(designFilesCollection, {
    title: "Untitled canvas",
    ownerId,
    ownerEmail: normalizeEmail(ownerEmail),
    collaboratorIds: [],
    collaboratorEmails: [],
    roomId: crypto.randomUUID(),
    status,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return newDocRef.id;
};

export const subscribeToUserDocuments = (
  userId: string,
  userEmail: string | null | undefined,
  onDocuments: (documents: DesignDocument[]) => void,
  onError?: (error: Error) => void
) => {
  const ownedDocumentsQuery = query(
    designFilesCollection,
    where("ownerId", "==", userId)
  );

  let ownedDocuments: DesignDocument[] = [];
  let sharedDocuments: DesignDocument[] = [];

  const emitDocuments = () => {
    onDocuments(sortDocuments([...ownedDocuments, ...sharedDocuments]));
  };

  const unsubscribeOwned = onSnapshot(
    ownedDocumentsQuery,
    (snapshot) => {
      ownedDocuments = snapshot.docs.map((item) =>
        toDesignDocument(item.id, item.data() as Partial<StoredDesignDocument>)
      );

      emitDocuments();
    },
    (error) => onError?.(error)
  );

  if (!userEmail) {
    return () => unsubscribeOwned();
  }

  const sharedDocumentsQuery = query(
    designFilesCollection,
    where("collaboratorEmails", "array-contains", normalizeEmail(userEmail))
  );

  const unsubscribeShared = onSnapshot(
    sharedDocumentsQuery,
    (snapshot) => {
      sharedDocuments = snapshot.docs.map((item) =>
        toDesignDocument(item.id, item.data() as Partial<StoredDesignDocument>)
      );

      emitDocuments();
    },
    (error) => onError?.(error)
  );

  return () => {
    unsubscribeOwned();
    unsubscribeShared();
  };
};

export const getDesignDocumentById = async (documentId: string) => {
  const documentRef = doc(db, "designFiles", documentId);
  const snapshot = await getDoc(documentRef);

  if (!snapshot.exists()) {
    return null;
  }

  return toDesignDocument(
    snapshot.id,
    snapshot.data() as Partial<StoredDesignDocument>
  );
};

export const subscribeToDesignDocument = (
  documentId: string,
  onDocument: (documentData: DesignDocument | null) => void,
  onError?: (error: Error) => void
) =>
  onSnapshot(
    doc(db, "designFiles", documentId),
    (snapshot) => {
      if (!snapshot.exists()) {
        onDocument(null);
        return;
      }

      onDocument(
        toDesignDocument(
          snapshot.id,
          snapshot.data() as Partial<StoredDesignDocument>
        )
      );
    },
    (error) => onError?.(error)
  );

export const canAccessDocument = (
  documentData: DesignDocument,
  userId: string,
  userEmail?: string | null
) =>
  documentData.ownerId === userId ||
  documentData.collaboratorIds.includes(userId) ||
  (!!userEmail &&
    documentData.collaboratorEmails.includes(normalizeEmail(userEmail)));

export const isDocumentOwner = (
  documentData: DesignDocument,
  userId: string
) => documentData.ownerId === userId;

export const updateDesignDocumentTitle = async (
  documentId: string,
  title: string
) => {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) return;

  await updateDoc(doc(db, "designFiles", documentId), {
    title: trimmedTitle,
    updatedAt: serverTimestamp(),
  });
};

export const addDocumentCollaboratorByEmail = async (
  documentId: string,
  collaboratorEmail: string,
  ownerEmail: string
) => {
  const normalizedEmail = normalizeEmail(collaboratorEmail);
  if (!normalizedEmail || normalizedEmail === normalizeEmail(ownerEmail)) return;

  await updateDoc(doc(db, "designFiles", documentId), {
    collaboratorEmails: arrayUnion(normalizedEmail),
    updatedAt: serverTimestamp(),
  });
};

export const removeDocumentCollaboratorByEmail = async (
  documentId: string,
  collaboratorEmail: string
) => {
  const normalizedEmail = normalizeEmail(collaboratorEmail);
  if (!normalizedEmail) return;

  await updateDoc(doc(db, "designFiles", documentId), {
    collaboratorEmails: arrayRemove(normalizedEmail),
    updatedAt: serverTimestamp(),
  });
};
