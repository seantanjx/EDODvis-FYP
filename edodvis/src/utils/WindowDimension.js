import { useState, useEffect } from "react";

const WindowDimension = () => {
  const updateMedia = () => {
    setDesktop(window.innerWidth > 992);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  const [isDesktop, setDesktop] = useState(window.innerWidth > 992);

  return isDesktop;
};

export default WindowDimension;
