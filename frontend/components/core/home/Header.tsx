"use client";

import { Button } from "@/components/ui/button";
import { Settings, CornerUpLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { SideBar } from "@/components/core/home/SideBar";
import { usePathname, useRouter } from "next/navigation";
import { ThemeSwitch } from "./ThemeSwitch";

export const Header: React.FC = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const router = useRouter();
  const pathName = usePathname();

  const handleCloseSideBar = () => {
    setIsSideBarOpen(false);
  };

  const handleOpenSideBar = () => {
    setIsSideBarOpen(true);
  };

  const isHomepage = useMemo((): boolean => pathName === "/", [pathName]);

  return (
    <>
      <div className="z-50 flex h-[56px] items-center px-4 fade-out">
        {!isHomepage ? (
          <Button onClick={() => router.replace("/")} variant="ghost">
            <CornerUpLeft size={16} />
          </Button>
        ) : null}
        <div className="ml-auto flex gap-2">
          <Button onClick={handleOpenSideBar} variant="ghost">
            <Settings size={16} />
          </Button>
          <ThemeSwitch />
        </div>
      </div>
      <SideBar isOpen={isSideBarOpen} onClose={handleCloseSideBar} />
    </>
  );
};
