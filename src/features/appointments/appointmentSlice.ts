import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface Appointment {
  id: number;
  name: string;
  date: string;
}

interface AppointmentState {
  items: Appointment[];
  loading: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  items: [],
  loading: false,
  error: null,
};

// Replace with your real API
const BASE_URL = "http://your-loadbalancer-url.amazonaws.com";

export const fetchAppointments = createAsyncThunk(
  "appointments/fetchAppointments",
  async () => {
    const response = await axios.get(`${BASE_URL}/appointments`);
    return response.data as Appointment[];
  }
);

export const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch";
      });
  },
});

export default appointmentSlice.reducer;
