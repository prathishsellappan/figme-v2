import type { DesignDocument } from "../lib/documents";

type Props = {
  documents: DesignDocument[];
  onOpen: (documentId: string) => void;
  emptyLabel: string;
};

const formatUpdatedAt = (dateValue: DesignDocument["updatedAt"]) => {
  if (!dateValue) return "Just created";

  return `Updated ${dateValue.toDate().toLocaleString()}`;
};

export default function DesignFileObjects({
  documents,
  onOpen,
  emptyLabel,
}: Props) {
  if (documents.length === 0) {
    return (
      <div className="m-5 rounded-xl border border-dashed border-borderColor bg-[#202124] p-6 text-sm text-[#b9bcc2]">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="m-5 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {documents.map((documentItem) => (
        <button
          key={documentItem.id}
          type="button"
          onClick={() => onOpen(documentItem.id)}
          className="space-y-3 rounded-xl border border-borderColor bg-[#202124] p-4 text-left text-white transition-colors hover:border-[#0C8CE9] hover:bg-[#25272a]"
        >
          <div className="flex h-44 items-center justify-center rounded-lg border border-borderColor bg-[#1E1E1E] text-sm text-[#b9bcc2]">
            {documentItem.title}
          </div>

          <div className="space-y-1">
            <h4 className="text-base font-medium">{documentItem.title}</h4>
            <p className="text-sm text-[#9aa0a6]">
              {formatUpdatedAt(documentItem.updatedAt)}
            </p>
            <p className="text-xs uppercase tracking-wide text-[#6f7680]">
              Room {documentItem.roomId.slice(0, 8)}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
