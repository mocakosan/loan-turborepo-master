import { useEffect, useState } from "react";

const useResizeHandler = () => {
  const [viewport, setViewport] = useState<"desktop" | "pad" | "mobile">(
    "desktop"
  );

  const handleResize = () => {
    const width = window.innerWidth;

    if (width >= 1024) {
      setViewport("desktop");
    } else if (width > 768) {
      setViewport("pad");
    } else {
      setViewport("mobile");
    }
  };

  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return {
    isDesktop: viewport === "desktop",
    isMobile: viewport === "mobile",
    isPad: viewport === "pad",
  };
};

export default useResizeHandler;
