import { useEffect, useState } from "react";
import axios from "axios";

const Bin = () => {
  const [datas, setDatas] = useState([]);

  const fetchInactive = async () => {
    try {
      const res = await axios.get("http://localhost:3000/metric/inactive");
      setDatas(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchInactive();
  }, []);

  const deleteUser = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/metric/permanent/${id}`,
      );

      console.log(res.data);

      // UI refresh ya state update
      fetchInactive();
    } catch (err) {
      console.log(err);
    }
  };

  const restoredata = async (id) => {
    try {
      const res = await axios.patch(`http://localhost:3000/metric/${id}`, {
        status: true,
      });
      console.log(res.data);
      fetchInactive();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      {/* TITLE */}
      <h1 className="text-4xl font-bold text-center text-red-600 mb-10">
        Users Bin
      </h1>

      {/* EMPTY STATE */}
      {datas.length === 0 ? (
        <div className="text-center text-slate-500 text-lg">Bin is Empty</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {datas.map((x) => (
            <div
              key={x._id}
              className="bg-white border border-red-200 rounded-2xl p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition"
            >
              <h2 className="text-lg font-bold text-slate-800">{x.name}</h2>

              <div className="text-sm text-slate-600 space-y-1 mt-2">
                <p>Email: {x.email}</p>
                <p>Gender: {x.gender}</p>
                <p>Age: {x.age}</p>
                <p>Height: {x.height}</p>
                <p>Weight: {x.weight}</p>
              </div>

              <p className="mt-3 text-red-600 font-bold">BMI: {x.bmitotal}</p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => restoredata(x._id)}
                  className="flex-1 bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 transition"
                >
                  Restore
                </button>

                <button
                  onClick={() => deleteUser(x._id)}
                  className="flex-1 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bin;
