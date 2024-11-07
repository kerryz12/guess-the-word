import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, ChevronDown } from "lucide-react";
import { HowToPlay, Stats } from "..";

import "./Navbar.css";

interface StoredDateInfo {
  formattedDate: string;
  serverTimestamp: string;
}

function Navbar() {
  const [currentDate, setCurrentDate] = useState(() => {
    const storedDateInfo = localStorage.getItem("dateInfo");
    return storedDateInfo ? JSON.parse(storedDateInfo).formattedDate : "";
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  const [displayName, setDisplayName] = useState<string>(() => {
    return localStorage.getItem("displayName") || "";
  });

  const [profilePicture, setProfilePicture] = useState<string>(() => {
    return localStorage.getItem("profilePicture") || "";
  });

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`/api/profile/navbar`, {
        credentials: "include",
      });

      const data = await response.json();
      setDisplayName(data.username);
      setProfilePicture(data.profilePicture);
      setIsAuthenticated(data.isAuthenticated);

      localStorage.setItem(
        "isAuthenticated",
        data.isAuthenticated ? "true" : "false"
      );
      localStorage.setItem("displayName", data.username || "");
      localStorage.setItem("profilePicture", data.profilePicture || "");
    } catch (err) {
      console.error("Failed to fetch profile details: ", err);
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("displayName");
      localStorage.removeItem("profilePicture");
    }
  };

  const fetchAndUpdateDate = async () => {
    try {
      const response = await fetch("/api/game/datetime", {
        credentials: "include",
      });
      const data = await response.json();
      const serverDate = new Date(data.currentDate);
      const formattedDate = formatDate(serverDate);

      const dateInfo: StoredDateInfo = {
        formattedDate,
        serverTimestamp: data.currentDate,
      };

      setCurrentDate(formattedDate);
      localStorage.setItem("dateInfo", JSON.stringify(dateInfo));
    } catch (error) {
      console.error("Error fetching date:", error);
    }
  };

  const shouldCheckDate = async (): Promise<boolean> => {
    const storedDateInfo = localStorage.getItem("dateInfo");
    if (!storedDateInfo) return true;

    try {
      const { serverTimestamp } = JSON.parse(storedDateInfo) as StoredDateInfo;
      if (!serverTimestamp) return true;

      const response = await fetch("/api/game/datetime", {
        credentials: "include",
      });
      const { currentDate: newServerDate } = await response.json();

      const oldDate = new Date(serverTimestamp);
      const newDate = new Date(newServerDate);

      return (
        oldDate.getDate() !== newDate.getDate() ||
        oldDate.getMonth() !== newDate.getMonth() ||
        oldDate.getFullYear() !== newDate.getFullYear()
      );
    } catch (error) {
      console.error("Error checking date:", error);
      return true;
    }
  };

  const redirectUser = (url: string) => {
    location.href = url;
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    const initializeDate = async () => {
      const needsUpdate = await shouldCheckDate();
      if (!currentDate || needsUpdate) {
        fetchAndUpdateDate();
      }
    };

    initializeDate();
  }, []);

  return (
    <div className="navbar">
      <div className="navbar-links">
        <div className="navbar-links-logo">
          <p>
            <a href="/">guess the word</a>
            <span>{currentDate}</span>
          </p>
        </div>
      </div>
      <div className="navbar-links_container">
        <HowToPlay />
        <Stats isAuthenticated={isAuthenticated} />
        {!isAuthenticated && (
          <p>
            <a href="/login">login</a>
          </p>
        )}
      </div>
      {isAuthenticated && (
        <div className="navbar-profile">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="navbar-profile-name">
                <img src={profilePicture} alt={displayName} />
                <ChevronDown />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-32">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => redirectUser("profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => redirectUser(`/auth/logout`)}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}

export default Navbar;
