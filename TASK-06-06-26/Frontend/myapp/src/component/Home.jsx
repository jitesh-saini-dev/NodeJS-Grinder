import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchdata,
  fetchUserById,
  clearSingleData,
  fetchByTitle,
  fetchByCategory,
  fetchByCategoryAndBrand,
} from "../slice/productSlice";

const Home = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  const dispatch = useDispatch();
  const sely = useSelector((state) => state.products.data);
  const singledata = useSelector((state) => state.products.singledata);
  const titledata = useSelector((state) => state.products.titledata);
  const categoryData = useSelector((state) => state.products.categoryData);
  const CategoryAndBrandData = useSelector(
    (state) => state.products.CategoryAndBrandData,
  );

  const filteredData =
    sely?.filter((x) => x.title.toLowerCase().includes(search.toLowerCase())) ||
    [];

  const sorteddata = [...filteredData];

  if (sort === "ltoh") {
    sorteddata.sort((a, b) => a.price - b.price);
  } else if (sort === "htol") {
    sorteddata.sort((a, b) => b.price - a.price);
  }

  useEffect(() => {
    dispatch(fetchdata());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header & Controls Section */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Product Explorer
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-4 pr-4 py-3 rounded-xl bg-slate-100 border-none focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm font-medium"
              />
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full sm:w-48 px-4 py-3 rounded-xl bg-slate-100 border-none focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm font-medium cursor-pointer appearance-none"
            >
              <option value="">Sort By: Featured</option>
              <option value="ltoh">Price: Low to High</option>
              <option value="htol">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Main Table Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Image</th>
                  <th className="px-6 py-4 font-semibold">Product Title</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Brand</th>
                  <th className="px-6 py-4 font-semibold">Price</th>
                  <th className="px-6 py-4 font-semibold text-center">
                    Quick Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sorteddata.map((x) => (
                  <tr
                    key={x.id}
                    className="hover:bg-indigo-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-slate-500">
                      {x.id}
                    </td>

                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white">
                        <img
                          src={x.thumbnail}
                          alt={x.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                      {x.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-xs font-medium">
                        {x.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {x.brand}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-emerald-600">
                      ₹{x.price}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2 justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                          onClick={() => dispatch(fetchUserById(x.id))}
                        >
                          ID
                        </button>
                        <button
                          className="px-3 py-1.5 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition"
                          onClick={() => dispatch(fetchByTitle(x.title))}
                        >
                          Title
                        </button>
                        <button
                          className="px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition"
                          onClick={() => dispatch(fetchByCategory(x.category))}
                        >
                          Category
                        </button>
                        <button
                          className="px-3 py-1.5 text-xs font-medium bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition"
                          onClick={() =>
                            dispatch(
                              fetchByCategoryAndBrand({
                                category: x.category,
                                brand: x.brand,
                              }),
                            )
                          }
                        >
                          Cat + Brand
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sorteddata.length === 0 && (
              <div className="p-10 text-center text-slate-500">
                Koi product nahi mila bhai, try a different search.
              </div>
            )}
          </div>
        </div>

        {/* Results / Modals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Single ID Data Card */}
          {singledata?.id && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-xl font-bold text-slate-800">
                    Product Details
                  </h2>
                  <button
                    onClick={() => dispatch(clearSingleData())}
                    className="text-slate-400 hover:text-red-500 transition"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">ID</span>
                    <span className="font-semibold">#{singledata.id}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Title</span>
                    <span className="font-semibold text-right">
                      {singledata.title}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Category</span>
                    <span className="font-medium px-2 py-0.5 bg-slate-100 rounded-md">
                      {singledata.category}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-500">Price</span>
                    <span className="text-lg font-bold text-emerald-600">
                      ₹{singledata.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Title Data List */}
          {titledata?.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-800 ml-2">
                Searched Titles
              </h2>
              {titledata.map((item) => (
                <div
                  key={item.id}
                  className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-md"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold">{item.title}</h3>
                      <p className="text-indigo-100 text-sm mt-1">
                        {item.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black">₹{item.price}</p>
                      <p className="text-xs text-indigo-200 mt-1">
                        ID: #{item.id}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Category Data List */}
          {categoryData?.length > 0 && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-5">
                Category Filter
              </h2>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {categoryData.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition cursor-pointer"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.category}
                      </p>
                    </div>
                    <p className="font-bold text-emerald-600">₹{item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category + Brand Data List */}
          {CategoryAndBrandData?.length > 0 && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                Filtered by Brand & Category
              </h2>
              <div className="grid gap-4">
                {CategoryAndBrandData.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-slate-800">{item.title}</h3>
                      <span className="text-emerald-600 font-bold">
                        ₹{item.price}
                      </span>
                    </div>
                    <div className="flex gap-2 text-xs font-medium text-slate-500">
                      <span className="px-2 py-1 bg-white rounded-md border border-slate-200">
                        Cat: {item.category}
                      </span>
                      <span className="px-2 py-1 bg-white rounded-md border border-slate-200">
                        Brand: {item.brand}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
