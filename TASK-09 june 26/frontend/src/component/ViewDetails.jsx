import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchByID } from "../slice/userSlice";

const ViewDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const singleuser = useSelector((state) => state.users.singleUser);

  useEffect(() => {
    dispatch(fetchByID(id));
  }, [dispatch, id]);

  const DetailRow = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row justify-between border-b border-gray-200/50 pb-2">
      <span className="text-gray-500 font-medium mb-1 sm:mb-0">{label}</span>
      <span className="font-semibold text-gray-800 sm:text-right text-left">
        {value || "—"}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen py-10 flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-indigo-50 to-pink-50 p-4 md:p-8">
      {/* Wrapper - Screen ki zyada width use karega */}
      <div className="w-full max-w-6xl">
        {/* Back Button - Ab normal flow mein hai, header mein nahi ghusega */}
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-600 rounded-xl shadow-md transition-all duration-300 active:scale-95 cursor-pointer"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl shadow-2xl overflow-hidden bg-white/40 backdrop-blur-2xl border border-white/60">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500/90 to-purple-500/90 p-6">
            <h2 className="text-3xl font-bold text-white text-center tracking-wide">
              User Full Profile
            </h2>
          </div>

          {/* Content - 2 Column Grid for wider screens */}
          <div className="p-6 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Personal Information (8 Items) */}
              <div>
                <h3 className="text-xl font-bold text-indigo-800 mb-4 ml-1 border-b-2 border-indigo-200 inline-block pb-1">
                  Personal Information
                </h3>
                <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-sm space-y-4">
                  <DetailRow
                    label="Full Name"
                    value={`${singleuser?.firstName || ""} ${singleuser?.lastName || ""}`.trim()}
                  />
                  <DetailRow label="Email" value={singleuser?.email} />
                  <DetailRow label="Phone" value={singleuser?.phone} />
                  <DetailRow label="Age" value={singleuser?.age} />
                  <DetailRow label="Gender" value={singleuser?.gender} />
                  <DetailRow label="Address" value={singleuser?.address} />
                  <DetailRow label="State" value={singleuser?.state} />
                  <DetailRow label="Country" value={singleuser?.country} />
                </div>
              </div>

              {/* Right Column: Education + Professional (3 + 5 = 8 Items) */}
              <div className="flex flex-col gap-8">
                {/* Education Information */}
                <div>
                  <h3 className="text-xl font-bold text-indigo-800 mb-4 ml-1 border-b-2 border-indigo-200 inline-block pb-1">
                    Education Details
                  </h3>
                  <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-sm space-y-4 border-b-0">
                    <DetailRow
                      label="Highest Education"
                      value={singleuser?.education}
                    />
                    <DetailRow
                      label="University/College"
                      value={singleuser?.university}
                    />
                    <DetailRow
                      label="Graduation Year"
                      value={singleuser?.graduationYear}
                    />
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className="text-xl font-bold text-indigo-800 mb-4 ml-1 border-b-2 border-indigo-200 inline-block pb-1">
                    Professional Details
                  </h3>
                  <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-sm space-y-4 border-b-0">
                    <DetailRow
                      label="Occupation"
                      value={singleuser?.occupation}
                    />
                    <DetailRow label="Company" value={singleuser?.company} />
                    <DetailRow
                      label="Department"
                      value={singleuser?.department}
                    />
                    <DetailRow
                      label="Experience"
                      value={
                        singleuser?.experience
                          ? `${singleuser.experience} Years`
                          : "—"
                      }
                    />
                    <DetailRow
                      label="Annual Salary"
                      value={singleuser?.salary ? `₹${singleuser.salary}` : "—"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;
