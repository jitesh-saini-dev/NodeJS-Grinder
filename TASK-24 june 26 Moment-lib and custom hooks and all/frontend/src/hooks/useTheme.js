import { useState, useEffect } from "react";
import axios from "axios";

const useTheme = () => {
  // Shuru mein LocalStorage check kar lo, warna 'light' rakh lo taaki flicker na ho
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // DOM (HTML tag) aur LocalStorage update karne ka function
  const applyThemeToDOM = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // 1. Initial Load: Backend se user ka theme mangwao
  useEffect(() => {
    const fetchUserTheme = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // NOTE: Yahan apne 'Get User Details' wala endpoint daal dena
        const res = await axios.get("http://localhost:3000/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // DB se theme mili toh theek, warna light assume karo
        const dbTheme = res.data.theme || "light";
        applyThemeToDOM(dbTheme);
      } catch (error) {
        console.log(
          "DB se theme lane mein error:",
          error.response?.data || error.message,
        );
        // Fallback: Agar API fail ho jaye toh purana localStorage wala theme chalne do
      }
    };

    fetchUserTheme();
  }, []);

  // 2. Toggle Theme aur Database Patch Request
  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";

    // UI turant update karo taaki lag feel na ho (Optimistic update)
    applyThemeToDOM(newTheme);

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // NOTE: Yahan apna 'Update Theme' wala PATCH endpoint daal dena
      await axios.patch(
        "http://localhost:3000/user/updateTheme",
        { theme: newTheme },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (error) {
      console.log(
        "DB mein theme update fail ho gaya:",
        error.response?.data || error.message,
      );
    }
  };

  return { theme, toggleTheme };
};

export default useTheme;
