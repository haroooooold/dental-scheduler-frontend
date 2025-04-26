import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handlereset = async () => {
    // Reset the form
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setPhoneNumber("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/register/user`,
        {
          firstName,
          lastName,
          email,
          password,
          phoneNumber,
        }
      );

      // If successful (HTTP 200 OK)
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
        error?.response?.data?.data?.responseMessage ||
        "Registration failed!";

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
      <Container maxWidth="sm">
        <Typography
          component="h6"
          sx={{
            color: "#333",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 3,
            fontSize: 24,
          }}
        >
          Create an Account
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            sx={{ mb: 4 }}
          />

          <Button type="submit" variant="contained" size="large" fullWidth>
            Register
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
