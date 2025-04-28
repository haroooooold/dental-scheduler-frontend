import { useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Container,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import InputField from "../components/input-fields";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ILoginFormSchema } from "../interface/login-interface";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export interface ILoginFormSchema {
  username: string;
  password: string;
}

const defaultLoginValues: ILoginFormSchema = {
  username: "",
  password: "",
};

const LoginValidationSchema = yup.object({
  username: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function Login() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<ILoginFormSchema>({
    defaultValues: defaultLoginValues,
    resolver: yupResolver(LoginValidationSchema),
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<ILoginFormSchema> = async (data) => {
    setIsProcessing(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        {
          email: data.username,
          password: data.password,
        }
      );

      const token = response.data?.token; // ✅ updated

      console.log("Login response:", response.data); // Log the entire response

      if (!token) {
        throw new Error("Token not found. Please try again.");
      }

      localStorage.setItem("authToken", token);

      setToast({
        open: true,
        message: "Login successful! Redirecting...",
        severity: "success",
      });

      reset();

      setTimeout(() => navigate("/dashboard"), 500);
    } catch (error: any) {
      console.error(error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error_message ||
        error.message ||
        "Login failed. Please try again.";

      setToast({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
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
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Box>
            <Box
              sx={{
                width: "100%",
                background: "linear-gradient(to right, #e3f2fd, #bbdefb)",
                padding: 3,
                borderRadius: 2,
                boxShadow: 3,
                border: "1px solid #ccc",
              }}
            >
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
                Sign In
              </Typography>

              <form onSubmit={handleSubmit(onSubmit)} autoComplete="on">
                <Grid container spacing={2}>
                  <InputField
                    {...register("username")}
                    id="username"
                    label="Email"
                    errors={errors}
                    sx={{ width: "100%" }}
                  />
                </Grid>
                <Grid container spacing={2}>
                  <InputField
                    {...register("password")}
                    id="password"
                    label="Password"
                    type="password"
                    errors={errors}
                    sx={{ width: "100%" }}
                  />
                </Grid>
                <Grid container spacing={2}>
                  <Grid {...{ xs: 12, sm: 6, md: 3 }}>
                    <Box display="flex" justifyContent="center">
                      <LoadingButton
                        variant="contained"
                        type="submit"
                        sx={{
                          width: "100%",
                          boxShadow: 1,
                          backgroundColor: "#1976D2",
                          color: "#fff",
                          "&:hover": {
                            backgroundColor: "#1565C0",
                          },
                        }}
                        loading={isProcessing}
                      >
                        Log In
                      </LoadingButton>
                    </Box>
                  </Grid>
                  <Grid {...{ xs: 12, sm: 6, md: 3 }}>
                    <Box display="flex" justifyContent="center">
                      <Button
                        variant="outlined"
                        sx={{
                          color: "#1976d2",
                          borderColor: "#1976d2",
                          "&:hover": {
                            backgroundColor: "#e3f2fd",
                            borderColor: "#1565c0",
                            color: "#0d47a1",
                          },
                        }}
                        onClick={() => navigate("/register")}
                      >
                        Sign up
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Box>
        </Container>
      </Box>

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
    </>
  );
}
