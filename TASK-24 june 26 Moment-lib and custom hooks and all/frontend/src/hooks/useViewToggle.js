import { useState } from "react";

const useViewToggle = () => {
  const [view, setView] = useState("table");

  const toggleView = () => {
    setView((prev) => (prev === "table" ? "card" : "table"));
  };

  return {
    view,
    toggleView,
  };
};

export default useViewToggle;
