import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  email: string;
  exp: number;
  iat: number;
}

export default function Booking() {
  const [userName, setUserName] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [dentistName, setDentistName] = useState("");
  const [dentists, setDentists] = useState<any[]>([]);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setUserName(decoded.email);
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, []);

  useEffect(() => {
    const fetchDentists = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/available-dentists`
        );
        setDentists(response.data.data || []);
      } catch (error) {
        console.error("Error fetching dentists:", error);
      }
    };

    fetchDentists();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/appointments/create`,
        {
          userName,
          dentistName,
          appointmentDate: appointmentDate.split("T")[0],
        }
      );

      setToast({
        open: true,
        message: response?.data?.message || "Registration successful!",
        severity: "success",
      });
      handlereset();
    } catch (error: any) {
      console.error(error);

      const status = error?.response?.status;
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.data?.responseMessage;

      if (status === 401) {
        setToast({
          open: true,
          message: message,
          severity: "error",
        });
      } else {
        setToast({
          open: true,
          message: message,
          severity: "error",
        });
      }
    }
  };

  const handlereset = async () => {
    setUserName("");
    setDentistName("");
    setAppointmentDate("");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(to right, #e3f2fd, #bbdefb)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Container maxWidth="sm" sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom>
          Book an Appointment
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          {/* User Name Field */}
          <TextField
            fullWidth
            label="Your Email"
            value={userName}
            InputProps={{ readOnly: true }}
            sx={{ mb: 3 }}
          />

          {/* Dentist Dropdown Field */}
          <Autocomplete
            options={dentists.map((d) => `${d.full_name}`)}
            value={dentistName}
            onChange={(_, newValue) => setDentistName(newValue || "")}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Dentist"
                required
                sx={{ mb: 3 }}
              />
            )}
          />

          {/* Appointment Date Field */}
          <TextField
            fullWidth
            label="Appointment Date"
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
            sx={{ mb: 3 }}
          />

          {/* Submit Button */}
          <Button type="submit" variant="contained" size="large" fullWidth>
            Confirm Appointment
          </Button>
        </Box>

        {/* Snackbar (Toast) */}
        <Snackbar
          open={toast.open}
          autoHideDuration={4000}
          onClose={() => setToast({ ...toast, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setToast({ ...toast, open: false })}
            severity={toast.severity as "success" | "error"}
            sx={{ width: "100%" }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
