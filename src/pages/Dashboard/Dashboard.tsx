import { useState } from "react";
import SideNavBar from "../../components/layout/dashboard/SideNavBar";
import Content from "../../components/layout/dashboard/Content";


export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<"recent" | "draft">("recent");

  const handleRecentClick = () => {
    setActiveSection("recent");
  };

  const handleDraftClick = () => {
    setActiveSection("draft");
  };

  return (
    <div className="bg-backgroundDash h-screen w-screen flex">
      <SideNavBar
        onRecentClick={handleRecentClick}
        onDraftClick={handleDraftClick}
        recActive={activeSection === "recent"}
        draftActive={activeSection === "draft"}
      />

      <div className="w-screen">
        <Content recentOrDraft={activeSection} />
      </div>
    </div>
  );
}





