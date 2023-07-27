"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@radix-ui/react-separator";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { ChevronsRight, Container, Settings } from "lucide-react";
import { usePreferenceStore } from "@/store/preference";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface ISideBar {
  isOpen: boolean;
  onClose(): void;
}

export const SideBar: React.FC<ISideBar> = ({ isOpen, onClose }) => {
  const autoComplete = usePreferenceStore(state => state.autoComplete);
  const setAutoComplete = usePreferenceStore(state => state.setAutoComplete);
  const [isMounted, setIsMounted] = useState(false);
  const sideBarRef = useRef<HTMLDivElement>(null);
  const pathName = usePathname();
  const [autoCom, setAutoCom] = useLocalStorage("autoComplete", false);

  const className = {
    containerClass: "fixed top-0 backdrop-blur-sm w-screen h-screen bg-primary-foreground/40 z-[999] flex justify-end",
    sideBarClass:
      "absolute slide-right flex flex-col bg-primary-foreground transition-all duration-300 ease-in-out data-[state=false]:opacity-0 data-[state=false]:translate-x-1/4 shadow-lg w-screen sm:w-96 h-screen py-8 px-4",
  };

  const onTransitionEnd = () => {
    if (!isOpen) {
      setIsMounted(false);
      document.removeEventListener("keydown", onKeyDown);
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (e.target !== sideBarRef.current && (e.target as Node).contains(sideBarRef.current)) {
      onClose();
    }
  };

  const handleCheckAutoComplete = (value: boolean) => {
    setAutoComplete(value);
    setAutoCom(value);
  };

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      document.addEventListener("keydown", onKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    setAutoComplete(autoCom);
  }, [autoCom, setAutoComplete]);

  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathName]);

  return (
    <>
      {isMounted ? (
        <div onClick={handleClickOutside} onTransitionEnd={onTransitionEnd} className={className.containerClass}>
          <div ref={sideBarRef} data-state={isOpen} className={className.sideBarClass}>
            {/* setting title */}
            <div className="flex items-center font-bold mb-8 px-4">
              <Settings size={16} />
              <span className="ml-2">設定</span>
            </div>

            {/* setting body */}
            <div className="flex flex-col gap-4">
              <Link href="/word-add">
                <Button variant="ghost" className="flex justify-start font-bold w-full">
                  <Container />
                  <span className="ml-4">字詞管理</span>
                </Button>
              </Link>

              <Separator className="h-[.5px] bg-primary/10 mx-4" />

              <div className="flex items-center justify-between px-4 text-sm">
                <div className="text-left">
                  <div className="font-bold">一鍵替換</div>
                  <div className="text-xs text-zinc-400 dark:text-zinc-600">選擇時替換所有相同詞語</div>
                </div>
                <Switch
                  checked={autoComplete}
                  onCheckedChange={handleCheckAutoComplete}
                  color="muted"
                  className="data-[state=checked]:bg-blue-400"
                />
              </div>
            </div>

            {/* close button */}
            <div className="mt-auto">
              <Button onClick={onClose} variant="ghost">
                <ChevronsRight size={24} />
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
