import React from "react";
import { Search, Moon, Sun, X, Settings2, BarChart3 } from "lucide-react";

const Header = ({
  isDarkMode,
  setIsDarkMode,
  selectedTag,
  searchInNavbar,
  setSearchInNavbar,
  globalSearch,
  setGlobalSearch,
  showVariables,
  setShowVariables,
  title = "AD Cheatsheet",
}) => {
  const handleCloseSearch = () => {
    setGlobalSearch("");
    setSearchInNavbar(false);
  };

  return (
    <header
      className={`${
        isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
      } border-b`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isDarkMode ? "bg-blue-600" : "bg-blue-600"
              }`}
            >
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h1
              className={`text-xl font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {title}
            </h1>
            {selectedTag && (
              <div
                className={`px-2 py-1 rounded text-xs font-medium ${
                  isDarkMode
                    ? "bg-blue-800 text-blue-200"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {selectedTag}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {searchInNavbar && (
              <div className="relative mr-4">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                    isDarkMode ? "text-gray-400" : "text-gray-400"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search commands..."
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  className={`w-64 pl-9 pr-3 py-1.5 text-sm border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  autoFocus
                />
                <button
                  onClick={() => handleCloseSearch()}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded ${
                    isDarkMode
                      ? "text-gray-400 hover:text-gray-300"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            <button
              onClick={() => setSearchInNavbar(!searchInNavbar)}
              className={`p-2 rounded-md transition-colors border-none ${
                isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-800"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
              title="Search commands"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowVariables(!showVariables)}
              className={`p-2 rounded-md transition-colors ${
                isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-800"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              } ${
                showVariables
                  ? isDarkMode
                    ? "bg-gray-800"
                    : "bg-gray-100"
                  : ""
              }`}
              title="Toggle variables panel"
            >
              <Settings2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-md transition-colors outline-none ${
                isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-800"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
              title={isDarkMode ? "Light mode" : "Dark mode"}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
