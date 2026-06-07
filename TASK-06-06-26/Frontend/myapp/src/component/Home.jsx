import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchdata,
  fetchUserById,
  clearSingleData,
  fetchByTitle,
  fetchByCategory,
} from "../slice/productSlice";

const Home = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  const dispatch = useDispatch();
  const sely = useSelector((state) => state.products.data);
  // console.log(sely);
  const singledata = useSelector((state) => state.products.singledata);
  const titledata = useSelector((state) => state.products.titledata);

  // console.log(singledata);
  const categoryData = useSelector((state) => state.products.categoryData);

  const filteredData = sely.filter((x) =>
    x.title.toLowerCase().includes(search.toLowerCase()),
  );

  const sorteddata = [...filteredData];

  if (sort === "ltoh") {
    sorteddata.sort((a, b) => a.price - b.price);
  } else if (sort === "htol") {
    sorteddata.sort((a, b) => b.price - a.price);
  }

  useEffect(() => {
    dispatch(fetchdata());
  }, []);

  return (
    <>
      <div>
        <input
          type="text"
          placeholder="search here..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort By: Featured</option>
          <option value="ltoh">Price: Low to High</option>
          <option value="htol">Price: High to Low</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorteddata.map((x) => (
          <div
            key={x.id}
            className="bg-white shadow-md rounded-xl p-5 border border-gray-200 hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {x.title}
            </h2>

            <p className="text-sm text-gray-500 mb-3">Category: {x.category}</p>

            <p className="text-xl font-bold text-green-600 mb-4">₹{x.price}</p>

            <div className="flex flex-wrap gap-2">
              <button
                className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                onClick={() => {
                  console.log(x);
                  dispatch(fetchUserById(x.id));
                }}
              >
                View By ID
              </button>
              <button
                className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                onClick={() => {
                  console.log(x);
                  dispatch(fetchByTitle(x.title));
                }}
              >
                View By Title
              </button>

              <button
                className="px-3 py-2 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600"
                onClick={() => dispatch(fetchByCategory(x.category))}
              >
                View By Category
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ID Modal */}
      {singledata?.id && (
        <div className="max-w-md mx-auto bg-white p-5 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4">Product Details</h2>

          <p className="mb-2">
            <span className="font-medium">ID:</span> {singledata.id}
          </p>

          <p className="mb-2">
            <span className="font-medium">Title:</span> {singledata.title}
          </p>

          <p className="mb-2">
            <span className="font-medium">Category:</span> {singledata.category}
          </p>

          <p className="mb-4">
            <span className="font-medium">Price:</span> ₹{singledata.price}
          </p>

          <button
            onClick={() => dispatch(clearSingleData())}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      )}

      {/* title modal */}
      {titledata?.id && (
        <div className="max-w-md mx-auto bg-white p-5 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4">Product Details</h2>

          <p className="mb-2">
            <span className="font-medium">ID:</span> {titledata.id}
          </p>

          <p className="mb-2">
            <span className="font-medium">Title:</span> {titledata.title}
          </p>

          <p className="mb-2">
            <span className="font-medium">Category:</span> {titledata.category}
          </p>

          <p className="mb-4">
            <span className="font-medium">Price:</span> ₹{titledata.price}
          </p>

          <button
            onClick={() => dispatch(clearSingleData())}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      )}

      {/* Category Modal */}
      {categoryData?.length > 0 && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Category Products
          </h2>

          <div className="space-y-3">
            {categoryData.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-4 rounded-xl border border-gray-200 hover:shadow-sm hover:border-gray-300 transition"
              >
                <div>
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>

                <p className="font-semibold text-green-600 text-lg">
                  ₹{item.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
