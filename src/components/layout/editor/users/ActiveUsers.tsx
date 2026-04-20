import { useMemo } from "react";
import Avatar from "./Avatar";
import { useOthers, useSelf } from "@liveblocks/react/suspense";
import { generateRandomName } from "../../../../lib/utils";
import ShareBtn from "../../../share/ShareBtn";
import { FigmaLogoOutlineIcon } from "../../../../utils";

const ActiveUsers = () => {
  const others = useOthers();
  const currentUser = useSelf();

  const memoizedUsers = useMemo(() => {
    const hasMoreUsers = others.length > 2;

    return (
      <div className='flex items-center justify-center gap-1 pl-1'>
        <div className="pr-5">
          <ShareBtn />
        </div>
        <div className="flex items-center p-3 pb-1 pl-2 border-l-[0.5px] border-borderColor gap-4">
          <div className="flex -space-x-3">
            {currentUser && (
              <Avatar name='You' otherStyles='border-[3px] border-green-500' />
            )}

            {others.slice(0, 2).map(({ connectionId }) => (
              <Avatar
                key={connectionId}
                name={generateRandomName()}
                otherStyles='-ml-3'
              />
            ))}

            {hasMoreUsers && (
              <div className='z-10 -ml-3 flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-xs font-bold'>
                +{others.length - 2}
              </div>
            )}
          </div>
          <div className="cursor-pointer hover:opacity-80 transition-opacity">
            <img src={FigmaLogoOutlineIcon} alt="Figma" width={24} height={24} />
          </div>
        </div>
      </div>
    );
  }, [others.length]);

  return memoizedUsers;
};

export default ActiveUsers;