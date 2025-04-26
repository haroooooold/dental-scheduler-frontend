import { forwardRef } from "react";
import { TextField, TextFieldProps, Typography } from "@mui/material";

/**
 * Props for the InputField component.
 * @extends Omit<TextFieldProps, 'ref'>
 */
interface InputFieldProps extends Omit<TextFieldProps, "ref"> {
  /** Object containing validation errors */
  errors: Record<string, any>;
  /** Unique identifier for the input field */
  id: string;
  /** Variant of the TextField */
  variant?: TextFieldProps["variant"];
  /** Additional styles for the TextField */
  sx?: object;
}

/**
 * InputField component
 *
 * A customized text input field that integrates with form validation.
 * It displays error messages and applies error styles when validation fails.
 *
 * @component
 * @param {InputFieldProps} props - The component props
 * @param {React.Ref<HTMLInputElement>} ref - Forwarded ref for the input element
 * @returns {JSX.Element} The rendered InputField component
 */
const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ errors, id, sx, variant, ...etc }, ref) => {
    return (
      <>
        <TextField
          ref={ref}
          variant={variant || "outlined"}
          size="small"
          {...etc}
          sx={{
            marginBottom: id === "search" ? 0 : errors[id] ? 0.5 : 2,
            "& .MuiOutlinedInput-root": {
              "& > fieldset": { borderColor: errors[id] && "#FF5630" },
            },
            ".MuiInputBase-root": { height: "40px" },
            ...sx,
          }}
        />
        {errors[id] && (
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontSize: 12,
              marginBottom: 1,
              marginLeft: 1,
              fontWeight: 400,
              lineHeight: "19.92px",
              letterSpacing: "0.4px",
              color: "#FF5630",
            }}
          >
            {errors[id].message}
          </Typography>
        )}
      </>
    );
  }
);

export default InputField;
