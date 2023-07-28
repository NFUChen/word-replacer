import { useEffect } from "react";

export const useViewHeight = () => {
  useEffect(() => {
    if (!document) return;

    const windowVH = window.innerHeight / 100;
    const setVh = () => {
      document.body.style.setProperty("--vh", windowVH + "px");
    };

    document.body.style.setProperty("--vh", windowVH + "px");

    window.addEventListener("resize", setVh);

    return () => window.removeEventListener("resize", setVh);
  }, []);
};
