import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchdata = createAsyncThunk(
  "product/productdetails",
  async () => {
    const res = await axios.get("http://localhost:3000/");
    return res.data;
  },
);

export const fetchUserById = createAsyncThunk(
  "products/productsdetailsById",
  async (id) => {
    const res = await axios.get(`http://localhost:3000/items/${id}`);
    return res.data;
  },
);

export const fetchUserByCategory = createAsyncThunk(
  "products/productsdetailsById",
  async (id) => {
    const res = await axios.get(`http://localhost:3000/items/${category}`);
    return res.data;
  },
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    data: [],
    loading: false,
    singledata: {},
  },
  reducers: {
    clearSingleData: (state) => {
      state.singledata = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchdata.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchdata.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchdata.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.singledata = action.payload;
      })
      .addCase(fetchUserById.rejected, (state) => {
        state.loading = false;
      });
  },
});


export const { clearSingleData } = productSlice.actions;
export default productSlice.reducer;
