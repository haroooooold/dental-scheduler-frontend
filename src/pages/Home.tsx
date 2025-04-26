import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

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
      <Container maxWidth="md" sx={{ textAlign: "center" }}>
        <Typography
          variant="h2"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "#0d47a1" }}
        >
          Book Your Dental Appointment
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: "600px", margin: "0 auto" }}
        >
          Simple, secure, and available 24/7 — because your dental deserves
          top-tier care.
        </Typography>

        <Box display="flex" flexWrap="wrap" justifyContent="center" gap={3}>
          <Button
            variant="contained"
            size="large"
            sx={{
              borderRadius: "40px",
              px: 5,
              py: 1.5,
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
            onClick={() => navigate("/register")}
          >
            Sign up
          </Button>

          <Button
            variant="outlined"
            size="large"
            sx={{
              borderRadius: "40px",
              px: 5,
              py: 1.5,
              color: "#1976d2",
              borderColor: "#1976d2",
              "&:hover": {
                backgroundColor: "#e3f2fd",
                borderColor: "#1565c0",
                color: "#0d47a1",
              },
            }}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
