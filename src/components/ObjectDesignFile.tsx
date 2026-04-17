import { useEffect, useState } from "react";
import PlanTypeBadge from "./common/ui/PlanTypeBadge";
import { updateDesignDocumentTitle } from "../lib/documents";

type Props = {
  documentId: string;
  title: string;
};

export default function ObjectDesignFile({ documentId, title }: Props) {
  const [draftTitle, setDraftTitle] = useState(title);

  useEffect(() => {
    setDraftTitle(title);
  }, [title]);

  const handleBlur = async () => {
    if (!draftTitle.trim() || draftTitle === title) return;
    await updateDesignDocumentTitle(documentId, draftTitle);
  };

  return (
    <div className="mr-64 flex items-center p-3 pl-2 pt-4">
      <h3 className="flex items-center space-x-2">
        <span className="text-gray-100 opacity-40">Documents</span>
        <span>/</span>
        <span className="flex items-center">
          <input
            type="text"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onBlur={handleBlur}
            className="w-40 bg-transparent border-none text-white focus:outline-none placeholder:text-white"
          />
          <PlanTypeBadge />
        </span>
      </h3>
    </div>
  );
}
