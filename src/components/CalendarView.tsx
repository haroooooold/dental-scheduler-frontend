import { Calendar, momentLocalizer } from "react-big-calendar";
import { Box, Typography } from "@mui/material";
import { useAppSelector } from "../hooks";
import { useMemo } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parseISO } from "date-fns";

const localizer = {
  ...momentLocalizer((date: { toISOString: () => string }) =>
    parseISO(date.toISOString())
  ),
  formats: {
    dateFormat: "dd",
    dayFormat: "eeee, MMM d",
  },
  format: (date: string | number | Date, formatStr: string) =>
    format(date, formatStr), // Added format function
};

export default function CalendarView() {
  const { items } = useAppSelector((state) => state.appointments);

  const events = useMemo(
    () =>
      items.map((appt) => ({
        title: appt.name,
        start: new Date(appt.date),
        end: new Date(appt.date),
      })),
    [items]
  );

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>
        Full Appointment Calendar
      </Typography>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
      />
    </Box>
  );
}
