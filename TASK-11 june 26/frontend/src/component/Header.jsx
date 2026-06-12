import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
          BMI Dashboard
        </h1>

        {/* Nav Links */}
        <nav className="flex items-center gap-3">
          <Link
            to="/"
            className="px-5 py-2 rounded-xl font-medium text-slate-700 hover:bg-slate-100 transition"
          >
            BMI Check Form
          </Link>

          <Link
            to="/bmiusers"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            BMI Users
          </Link>
          <Link
            to="/bin"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            bin
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
