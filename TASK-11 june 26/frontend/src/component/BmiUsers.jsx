import { useEffect, useState } from "react";
import axios from "axios";

const BmiUsers = () => {
  const [datas, setDatas] = useState([]);
  const [selected, setSelected] = useState(null);

  async function fetchData() {
    try {
      const res = await axios.get("http://localhost:3000/metric");
      setDatas(res.data);
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  const ViewById = async (id) => {
    try {
      const res = await axios.get(`http://localhost:3000/metric/${id}`);
      setSelected(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  //   const DeleteById = async (id) => {
  //     try {
  //       const res = await axios.get(`http://localhost:3000/metric/${id}`);
  //       setSelected(res.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/metric/${id}`);

      // UI refresh (optional)
      fetchData(); // ya state update
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (id) => {
    const user = datas.find((x) => x._id === id);
    setSelected(user);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-10 text-slate-800">
        BMI Users
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {datas.map((x) => (
          <div
            key={x._id}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition"
          >
            <h2 className="text-lg font-bold text-slate-800 mb-2">{x.name}</h2>
            <div className="text-sm text-slate-600 space-y-1">
              <p>Email: {x.email}</p>
              <p>Gender: {x.gender}</p>
              <p>Age: {x.age}</p>
              <p>Height: {x.height}</p>
              <p>Weight: {x.weight}</p>
            </div>
            <p className="mt-3 text-indigo-600 font-bold">BMI: {x.bmitotal}</p>
            <button
              onClick={() => ViewById(x._id)}
              className="mt-4 w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white py-2 rounded-xl"
            >
              View Details
            </button>

            <button
              onClick={() => handleEdit(x._id)}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded-xl"
            >
              Edit
            </button>

            <button
              onClick={() => deleteUser(x._id)}
              className="mt-4 w-full bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl w-[400px] relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-4 text-2xl"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold mb-4">{selected.name}</h2>

            <p>Email: {selected.email}</p>
            <p>Gender: {selected.gender}</p>
            <p>Age: {selected.age}</p>
            <p>Height: {selected.height}</p>
            <p>Weight: {selected.weight}</p>

            <p className="font-bold text-indigo-600 mt-3">
              BMI: {selected.bmitotal}
            </p>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-[420px] rounded-2xl shadow-2xl p-6 relative animate-[fadeIn_0.2s_ease-in]">
            {/* Close Button */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-red-500"
            >
              ×
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold text-slate-800 mb-5 text-center">
              Edit User
            </h2>

            {/* Inputs */}
            <div className="space-y-3">
              <input
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={selected.name}
                onChange={(e) =>
                  setSelected({ ...selected, name: e.target.value })
                }
                placeholder="Name"
              />

              <input
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={selected.email}
                onChange={(e) =>
                  setSelected({ ...selected, email: e.target.value })
                }
                placeholder="Email"
              />

              <input
                type="number"
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={selected.age}
                onChange={(e) =>
                  setSelected({ ...selected, age: e.target.value })
                }
                placeholder="Age"
              />

              <input
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={selected.gender}
                onChange={(e) =>
                  setSelected({ ...selected, gender: e.target.value })
                }
                placeholder="Gender"
              />
            </div>

            {/* Update Button */}
            <button
              onClick={async () => {
                try {
                  await axios.patch(
                    `http://localhost:3000/metric/${selected._id}`,
                    selected,
                  );

                  setSelected(null);
                  fetchData();
                } catch (err) {
                  console.log(err);
                }
              }}
              className="w-full mt-5 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition"
            >
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BmiUsers;
