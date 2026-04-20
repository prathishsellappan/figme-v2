import { penIcon } from "../../../utils";

type Props = {
    onCreate: () => void;
    isCreating: boolean;
};

export default function DesignFileBox({ onCreate, isCreating }: Props) {
    return (
        <button
            type="button"
            onClick={onCreate}
            disabled={isCreating}
            className="group m-5 mb-5 flex w-96 cursor-pointer items-start gap-4 rounded-xl bg-[#383838] p-6 text-left select-none transition-colors hover:bg-[#0C8CE9]"
        >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0C8CE9] text-white text-sm group-hover:bg-[#484848]">
                <img className="rotate-90" src={penIcon} alt="penIcon" width={20} />
            </div>
            <div className="text-sm text-white">
                <h3>{isCreating ? "Creating document..." : "New cloud document"}</h3>
                <p className="text-[#d6d9df]">
                    {isCreating
                        ? "Preparing your collaborative room."
                        : "Create a persisted design document and open its editor."}
                </p>
            </div>
        </button>
    );
}
