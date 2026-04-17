import { useMemo, useState } from "react";
import { Button } from "../common/ui/button";
import { useAuth } from "../../contexts/AuthContext";
import {
  addDocumentCollaboratorByEmail,
  removeDocumentCollaboratorByEmail,
} from "../../lib/documents";

type Props = {
  documentId: string;
  ownerId: string;
  ownerEmail: string;
  collaboratorEmails: string[];
};

export default function ShareBtn({
  documentId,
  ownerId,
  ownerEmail,
  collaboratorEmails,
}: Props) {
  const { state } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const canManageSharing = !!state.user && state.user.uid === ownerId;
  const currentOrigin =
    typeof window !== "undefined" ? window.location.origin : "";
  const shareLink = `${currentOrigin}/editor/${documentId}`;
  const visibleCollaborators = useMemo(
    () => collaboratorEmails.filter((email) => email && email !== ownerEmail),
    [collaboratorEmails, ownerEmail]
  );

  const handleAddCollaborator = async () => {
    if (!canManageSharing || !emailInput.trim()) return;

    try {
      setIsSaving(true);
      setMessage(null);
      await addDocumentCollaboratorByEmail(documentId, emailInput, ownerEmail);
      setEmailInput("");
      setMessage("Collaborator added.");
    } catch (error) {
      setMessage("Could not add collaborator.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveCollaborator = async (email: string) => {
    if (!canManageSharing) return;

    try {
      setIsSaving(true);
      setMessage(null);
      await removeDocumentCollaboratorByEmail(documentId, email);
      setMessage("Collaborator removed.");
    } catch (error) {
      setMessage("Could not remove collaborator.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Share</Button>

      {isOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-xl border border-borderColor bg-[#1E1E1E] p-5 text-white shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Share document</h2>
                <p className="mt-1 text-sm text-[#aeb4bc]">
                  Invite collaborators by email and share this document link.
                </p>
              </div>
              <button
                type="button"
                className="text-sm text-[#aeb4bc] hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-xs uppercase tracking-wide text-[#7f8791]">
                Link
              </p>
              <div className="rounded-md border border-borderColor bg-[#25272a] px-3 py-2 text-sm text-[#d4d7dc]">
                {shareLink}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-xs uppercase tracking-wide text-[#7f8791]">
                Owner
              </p>
              <div className="rounded-md border border-borderColor bg-[#25272a] px-3 py-2 text-sm">
                {ownerEmail || "No owner email available"}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-xs uppercase tracking-wide text-[#7f8791]">
                Collaborators
              </p>

              {visibleCollaborators.length > 0 ? (
                <div className="space-y-2">
                  {visibleCollaborators.map((email) => (
                    <div
                      key={email}
                      className="flex items-center justify-between rounded-md border border-borderColor bg-[#25272a] px-3 py-2 text-sm"
                    >
                      <span>{email}</span>
                      {canManageSharing ? (
                        <button
                          type="button"
                          onClick={() => handleRemoveCollaborator(email)}
                          className="text-xs text-red-300 hover:text-red-200"
                        >
                          Remove
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-dashed border-borderColor px-3 py-2 text-sm text-[#aeb4bc]">
                  No collaborators yet.
                </div>
              )}
            </div>

            {canManageSharing ? (
              <div className="mt-4 space-y-2">
                <p className="text-xs uppercase tracking-wide text-[#7f8791]">
                  Invite by email
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="teammate@example.com"
                    className="h-10 flex-1 rounded-md border border-borderColor bg-[#25272a] px-3 text-sm text-white outline-none"
                  />
                  <Button onClick={handleAddCollaborator} disabled={isSaving}>
                    Add
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-md border border-borderColor bg-[#25272a] px-3 py-2 text-sm text-[#aeb4bc]">
                Only the document owner can manage collaborators.
              </div>
            )}

            {message ? (
              <p className="mt-4 text-sm text-[#9ad0a4]">{message}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
