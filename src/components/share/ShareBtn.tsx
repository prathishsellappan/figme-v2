import { useState } from "react";
import { Button } from '../common/ui/button'
import ShareModal from "./ShareModal";

export default function ShareBtn() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button 
        className="bg-[#0C8CE9] hover:bg-[#0a74c2] text-white font-semibold py-1.5 px-4 rounded-md transition-colors"
        onClick={() => setIsModalOpen(true)}
      >
        Share
      </Button>
      <ShareModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
