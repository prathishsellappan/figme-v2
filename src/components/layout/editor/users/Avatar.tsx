
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../common/ui/tooltip";

type Props = {
    name: string;
    otherStyles?: string;
};

const Avatar = ({ name, otherStyles }: Props) => (
    <>
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger>
                <div className={`relative h-9 w-9 rounded-full flex items-center justify-center text-white font-semibold text-sm uppercase ${otherStyles} bg-zinc-700 border-2 border-white shadow-sm`}>
                    {name?.[0] || 'U'}
                </div>
            </TooltipTrigger>
            <TooltipContent className="border-none bg-primary-grey-200 px-2.5 py-1.5 text-xs">
                {name}
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
    </>
);

export default Avatar;