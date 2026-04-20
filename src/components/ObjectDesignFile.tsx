import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PlanTypeBadge from "./common/ui/PlanTypeBadge";

export default function ObjectDesignFile() {
  const [searchParams] = useSearchParams();
  const urlName = searchParams.get("name");
  const [projectName, setProjectName] = useState(urlName || "Untitled");

  useEffect(() => {
    if (urlName) {
      setProjectName(urlName);
    }
  }, [urlName]);

  return (
    <>
      <div className="flex items-center p-3 pl-2 pt-4 mr-64">
        <h3 className="flex items-center space-x-2">
          <span className="text-gray-100 opacity-40">Drafts</span>
          <span>/</span>
          <span className="flex items-center">
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-auto max-w-[200px] bg-transparent border-none text-white focus:outline-none placeholder:text-white font-medium"
            />
            <PlanTypeBadge />
          </span>
        </h3>
      </div>
    </>
  )
}
