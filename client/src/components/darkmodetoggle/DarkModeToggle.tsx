import { useDarkMode } from "./DarkModeContext";
import { Moon, Sun } from "lucide-react";
import "./DarkModeToggle.css";

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="button-container">
      {isDarkMode ? <h1>Light Mode</h1> : <h1>Dark Mode</h1>}
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  );
};

export default DarkModeToggle;
