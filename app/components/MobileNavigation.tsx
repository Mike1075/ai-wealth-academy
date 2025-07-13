import { useState } from "react";
import { Link } from "@remix-run/react";

interface MobileNavigationProps {
  currentPath?: string;
}

export default function MobileNavigation({ currentPath }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path: string) => {
    return currentPath === path;
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600 p-2"
          aria-label="Toggle navigation menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Mobile menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <Link to="/" onClick={closeMenu} className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🤖 爱学AI创富营
            </Link>
            <button
              onClick={closeMenu}
              className="text-gray-600 hover:text-gray-900 p-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <nav className="p-4">
          <div className="space-y-2">
            <Link
              to="/courses"
              onClick={closeMenu}
              className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                isActive("/courses")
                  ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              }`}
            >
              📚 课程赛道
            </Link>
            
            <Link
              to="/instructors"
              onClick={closeMenu}
              className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                isActive("/instructors")
                  ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              }`}
            >
              👨‍🏫 王牌导师
            </Link>
            
            <Link
              to="/about"
              onClick={closeMenu}
              className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                isActive("/about")
                  ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              }`}
            >
              🚀 三级火箭
            </Link>
            
            <Link
              to="/pricing"
              onClick={closeMenu}
              className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                isActive("/pricing")
                  ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              }`}
            >
              💰 投资方案
            </Link>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-200">
            <div className="space-y-2">
              <Link
                to="/login"
                onClick={closeMenu}
                className="block w-full text-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                登录
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="block w-full text-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
              >
                🚀 锁定席位
              </Link>
            </div>
          </div>
        </nav>

        {/* Quick stats */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-t border-gray-200">
          <div className="text-center text-sm text-gray-600">
            <div className="flex justify-center items-center space-x-4">
              <div>
                <div className="font-semibold text-blue-600">5</div>
                <div className="text-xs">课程赛道</div>
              </div>
              <div>
                <div className="font-semibold text-purple-600">6</div>
                <div className="text-xs">王牌导师</div>
              </div>
              <div>
                <div className="font-semibold text-green-600">100+</div>
                <div className="text-xs">成功案例</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 