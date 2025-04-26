import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Button,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface DecodedToken {
  email: string;
  exp: number;
  iat: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string>("");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      setUserEmail(decoded.email);
      fetchUserAppointments(decoded.email);
    } catch (err) {
      console.error("Invalid token, logging out...", err);
      localStorage.removeItem("authToken");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const fetchUserAppointments = async (email: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user-appointments`,
        {
          params: { userName: email },
        }
      );
      setAppointments(response.data.data || []);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 404) {
        setAppointments([]);
      } else {
        setError("Failed to load appointments.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const handleUpdateStatus = async (
    referenceId: string,
    dentistName: string,
    appointmentDate: string,
    newStatus: string
  ) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/appointments/update`, {
        referenceId,
        dentistName,
        appointmentDate,
        status: newStatus,
      });

      fetchUserAppointments(userEmail);
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const columns: GridColDef[] = [
    { field: "dentist_name", headerName: "Dentist", flex: 1 },
    { field: "appointment_date", headerName: "Date", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() =>
                handleUpdateStatus(
                  params.row.id,
                  params.row.dentist_name,
                  params.row.appointment_date,
                  "cancelled"
                )
              }
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              color="success"
              size="small"
              onClick={() =>
                handleUpdateStatus(
                  params.row.id,
                  params.row.dentist_name,
                  params.row.appointment_date,
                  "finished"
                )
              }
            >
              Finish
            </Button>
          </Box>
        );
      },
    },
  ];

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
            <Grid container spacing={2}>
              <Grid {...{ xs: 12, sm: 6, md: 3 }}>
                <Box display="flex" justifyContent="center">
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
                    Your Appointments
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="flex-end">
              <Grid container spacing={2}>
                <Grid {...{ xs: 12, sm: 6, md: 3 }}>
                  {userEmail && (
                    <Typography variant="body2" color="textSecondary" mb={1}>
                      Logged in as: {userEmail}
                    </Typography>
                  )}
                </Grid>
                <Grid {...{ xs: 12, sm: 6, md: 3 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleLogout}
                    size="small"
                  >
                    Logout
                  </Button>
                </Grid>
              </Grid>
            </Box>

            <br />

            {/* Appointments Section */}
            {loading ? (
              <Box display="flex" justifyContent="center" my={5}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : appointments.length === 0 ? (
              <Box textAlign="center" py={5}>
                <Typography>No appointments found.</Typography>
              </Box>
            ) : (
              <DataGrid
                rows={appointments.map((appt, index) => ({
                  id: appt.reference_id || index,
                  dentist_name: appt.dentist_name,
                  appointment_date: new Date(
                    appt.appointment_date
                  ).toLocaleDateString(),
                  status: appt.status,
                }))}
                columns={columns}
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: 2,
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#e3f2fd",
                    fontWeight: "bold",
                  },
                  maxWidth: "700px",
                }}
                initialState={{
                  pagination: { paginationModel: { pageSize: 5 } },
                }}
                pageSizeOptions={[5]}
              />
            )}

            <br />
            {/* Book Appointment Button */}
            <Box display="flex" justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/book")}
                sx={{
                  px: 6,
                  py: 1.5,
                  backgroundColor: "#1976D2",
                  fontWeight: "bold",
                  borderRadius: "40px",
                  "&:hover": { backgroundColor: "#1565C0" },
                }}
              >
                Book New Appointment
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
