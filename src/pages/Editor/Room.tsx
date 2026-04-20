import { LiveMap } from "@liveblocks/client";
import {
    RoomProvider,
    ClientSideSuspense,
    LiveblocksProvider,
} from "@liveblocks/react/suspense";
import Loader from "../../components/Loader";
import { useSearchParams } from "react-router-dom";
const public_Key = import.meta.env.VITE_LIVEBLOCK_API;

const Room = ({ children }: { children: React.ReactNode }) => {
    // Extract room ID from URL parameters reactively
    const [searchParams] = useSearchParams();
    const roomName = searchParams.get("name") || 'figma-clone';

    return (
        <LiveblocksProvider publicApiKey={public_Key}>
            <RoomProvider id={roomName}
                initialPresence={{ cursor: null, cursorColor: null, editingText: null }}
                initialStorage={{
                    canvasObjects: new LiveMap(),
                }}
            >
                <ClientSideSuspense fallback={<Loader />}>
                    {() => children}
                </ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    );
}

export default Room;