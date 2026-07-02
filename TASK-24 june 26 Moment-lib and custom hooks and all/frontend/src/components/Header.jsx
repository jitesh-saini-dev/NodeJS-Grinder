// import { Link } from "react-router-dom";

// const Header = () => {
//   return (
//     <header className="w-full bg-white shadow-sm border-b border-slate-100">
//       <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-6">
//         {/* Logo */}
//         <div className="text-lg font-bold text-indigo-600">MyApp</div>

//         {/* Links */}
//         <div className="flex gap-4 ml-auto">
//           <Link
//             to="/"
//             className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
//           >
//             Tasks
//           </Link>

//           <Link
//             to="/taskdata"
//             className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
//           >
//             Admin Tasks
//           </Link>

//           <Link
//             to="/bin"
//             className="px-4 py-2 rounded-xl text-m font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
//           >
//             <img
//               src="https://images.icon-icons.com/1914/PNG/512/throwtopaperbin_121547.png"
//               alt=""
//               className="w-6 h-6"
//             />
//           </Link>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:3000/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <header className="w-full bg-white shadow-sm border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-6">
        {/* Logo */}
        <div className="text-lg font-bold text-indigo-600">MyApp</div>

        {/* Links */}
        <div className="flex items-center gap-4 ml-auto">
          <Link
            to="/"
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
          >
            Tasks
          </Link>

          <Link
            to="/taskdata"
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
          >
            Admin Tasks
          </Link>

          <Link
            to="/bin"
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
          >
            <img
              src="https://images.icon-icons.com/1914/PNG/512/throwtopaperbin_121547.png"
              alt=""
              className="w-6 h-6"
            />
          </Link>

          {/* Profile Section */}
          <div className="relative">
            <img
              src={
                user?.image ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="profile"
              onClick={() => setShowProfile(!showProfile)}
              className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500 cursor-pointer hover:scale-105 transition-all"
            />

            {showProfile && (
              <div className="absolute right-0 mt-4 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                {/* User Info */}
                <div className="flex flex-col items-center p-5 border-b">
                  <img
                    src={
                      user?.image ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt=""
                    className="w-24 h-24 rounded-full border-4 border-indigo-500 object-cover"
                  />

                  <h2 className="mt-3 text-lg font-bold text-gray-800">
                    {user?.firstName} {user?.lastName}
                  </h2>

                  <p className="text-gray-500 text-sm">{user?.email}</p>

                  <span className="mt-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                    {user?.role?.toUpperCase()}
                  </span>
                </div>

                {/* Buttons */}
                <div className="p-4 space-y-3">
                  <button
                    onClick={() => navigate("/edit-profile")}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl font-semibold transition-all"
                  >
                    Edit Profile
                  </button>

                  <button
                    onClick={() => navigate("/forgotpass")}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-xl font-semibold transition-all"
                  >
                    Reset Password
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-semibold transition-all"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
