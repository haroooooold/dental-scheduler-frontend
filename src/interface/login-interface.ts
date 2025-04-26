import * as Yup from "yup";

export const ILoginFormSchema = Yup.object().shape({
  username: Yup.string()
    .default("")
    .typeError("Account Type is required")
    .required(),
  password: Yup.string()
    .default("")
    .typeError("Account Type is required")
    .required(),
});
