// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// export const fetchAllData = createAsyncThunk("users/usersdetail", async () => {
//   const res = await axios.get("http://localhost:3000/users");
//   return res.data;
// });

// export const fetchByID = createAsyncThunk(
//   "users/usersdetailsbyId",
//   async (id) => {
//     const res = await axios.get(`http://localhost:3000/users/${id}`);
//     return res.data;
//   },
// );

// export const deleteUser = createAsyncThunk("users/deleteUser", async (id) => {
//   const res = await axios.delete(`http://localhost:3000/users?_id=${id}`);

//   console.log(res.data);

//   return id;
// });

// export const fetchInactiveData = createAsyncThunk(
//   "users/fetchInactiveData",
//   async () => {
//     const res = await axios.get("http://localhost:3000/users/inactive");
//     console.log("Inactive Users:", res.data);
//     return res.data;
//   },
// );

// // Restore User (status: true karke home bhejega)
// export const restoreUser = createAsyncThunk("users/restoreUser", async (id) => {
//   // Existing PATCH route ko hit maar rahe hain status true ke sath
//   await axios.patch("http://localhost:3000/users", { _id: id, status: true });
//   return id;
// });

// // Permanent Delete User (DB se hamesha ke liye gayab)
// export const permanentDeleteUser = createAsyncThunk(
//   "users/permanentDeleteUser",
//   async (id) => {
//     await axios.delete(`http://localhost:3000/users/permanent?_id=${id}`);
//     return id;
//   },
// );

// const userSlice = createSlice({
//   name: "users",
//   initialState: {
//     data: [],
//     singleUser: {},
//     loading: false,
//     inactiveData: [],
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAllData.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchAllData.fulfilled, (state, action) => {
//         state.loading = false;
//         state.data = action.payload;
//       })
//       .addCase(fetchAllData.rejected, (state) => {
//         state.loading = false;
//       });

//     builder
//       .addCase(fetchByID.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchByID.fulfilled, (state, action) => {
//         state.loading = false;
//         state.singleUser = action.payload;
//       })
//       .addCase(fetchByID.rejected, (state) => {
//         state.loading = false;
//       });

//     builder
//       .addCase(deleteUser.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(deleteUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.data = state.data.filter((item) => item._id !== action.payload);
//       })
//       .addCase(deleteUser.rejected, (state) => {
//         state.loading = false;
//       });

//     // fetchInactiveData cases
//     builder
//       .addCase(fetchInactiveData.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchInactiveData.fulfilled, (state, action) => {
//         state.loading = false;
//         state.inactiveData = action.payload;
//       })
//       .addCase(fetchInactiveData.rejected, (state) => {
//         state.loading = false;
//       });
//     // Restore User Case
//     builder
//       .addCase(fetchInactiveData.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(restoreUser.fulfilled, (state, action) => {
//         state.inactiveData = state.inactiveData.filter(
//           (item) => item._id !== action.payload,
//         );
//       })
//       .addCase(fetchInactiveData.rejected, (state) => {
//         state.loading = false;
//       });
//     // Permanent Delete Case
//     builder
//       .addCase(fetchInactiveData.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(permanentDeleteUser.fulfilled, (state, action) => {
//         state.inactiveData = state.inactiveData.filter(
//           (item) => item._id !== action.payload,
//         );
//       })
//       .addCase(fetchInactiveData.rejected, (state) => {
//         state.loading = false;
//       });
//   },
// });

// export default userSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// 1. Fetch All Active Users
export const fetchAllData = createAsyncThunk("users/usersdetail", async () => {
  const res = await axios.get("http://localhost:3000/users");
  return res.data;
});

// 2. Fetch User By ID
export const fetchByID = createAsyncThunk(
  "users/usersdetailsbyId",
  async (id) => {
    const res = await axios.get(`http://localhost:3000/users/${id}`);
    return res.data;
  },
);

// 3. Soft Delete User
export const deleteUser = createAsyncThunk("users/deleteUser", async (id) => {
  const res = await axios.delete(`http://localhost:3000/users?_id=${id}`);
  console.log(res.data);
  return id;
});

// 4. Fetch All Inactive (Trash) Users
export const fetchInactiveData = createAsyncThunk(
  "users/fetchInactiveData",
  async () => {
    const res = await axios.get("http://localhost:3000/users/inactive");
    console.log("Inactive Users:", res.data);
    return res.data;
  },
);

// 5. Restore User (status: true karke home bhejega)
export const restoreUser = createAsyncThunk("users/restoreUser", async (id) => {
  await axios.patch("http://localhost:3000/users", { _id: id, status: true });
  return id;
});

// 6. Permanent Delete User (DB se hamesha ke liye gayab)
export const permanentDeleteUser = createAsyncThunk(
  "users/permanentDeleteUser",
  async (id) => {
    await axios.delete(`http://localhost:3000/users/permanent?_id=${id}`);
    return id;
  },
);

// Update User
export const updateUser = createAsyncThunk("users/updateUser", async (data) => {
  // Tera backend body mein se _id nikal raha hai, isliye poora data bhejenge
  const res = await axios.patch("http://localhost:3000/users", data);
  return res.data;
});

const userSlice = createSlice({
  name: "users",
  initialState: {
    data: [],
    singleUser: {},
    loading: false,
    inactiveData: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Data Cases
      .addCase(fetchAllData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAllData.rejected, (state) => {
        state.loading = false;
      })

      // Fetch By ID Cases
      .addCase(fetchByID.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchByID.fulfilled, (state, action) => {
        state.loading = false;
        state.singleUser = action.payload;
      })
      .addCase(fetchByID.rejected, (state) => {
        state.loading = false;
      })

      // Soft Delete Cases
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state) => {
        state.loading = false;
      })

      // Fetch Inactive Data Cases
      .addCase(fetchInactiveData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInactiveData.fulfilled, (state, action) => {
        state.loading = false;
        state.inactiveData = action.payload;
      })
      .addCase(fetchInactiveData.rejected, (state) => {
        state.loading = false;
      })

      // Restore User Cases (Fixed Typo Here)
      .addCase(restoreUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(restoreUser.fulfilled, (state, action) => {
        state.loading = false;
        state.inactiveData = state.inactiveData.filter(
          (item) => item._id !== action.payload,
        );
      })
      .addCase(restoreUser.rejected, (state) => {
        state.loading = false;
      })

      // Permanent Delete Cases (Fixed Typo Here)
      .addCase(permanentDeleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(permanentDeleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.inactiveData = state.inactiveData.filter(
          (item) => item._id !== action.payload,
        );
      })
      .addCase(permanentDeleteUser.rejected, (state) => {
        state.loading = false;
      })

      // Update User Cases
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        // Updated data ko existing array mein replace kar denge
        const index = state.data.findIndex(
          (user) => user._id === action.payload._id,
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default userSlice.reducer;
