import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm px-6 md:px-10 py-4">
      <Link 
        to={'/'} 
        className="inline-block px-6 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-full border border-indigo-100 hover:bg-indigo-600 hover:text-white hover:shadow-md transition-all duration-300"
      >
        Home
      </Link>
    </header>
  );
};

export default Header;