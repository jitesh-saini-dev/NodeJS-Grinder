import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-6">
        {/* Logo / Brand */}
        <div className="text-lg font-bold text-indigo-600">MyApp</div>

        {/* Nav Links */}
        <div className="flex gap-4 ml-auto">
          <Link
            to="/"
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
          >
            Home
          </Link>

          <Link
            to="/form"
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
          >
            Form
          </Link>

          <Link
            to="/bin"
            className="px-4 py-2 rounded-xl text-m font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
          >
            <i class="ri-delete-bin-5-fill"></i>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
