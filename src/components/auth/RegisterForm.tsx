"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Container,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { AppDispatch } from "@/store";
import { registerUser } from "@/store/slices/authSlice";
import { useAuth } from "@/hooks/useAuth";
import { SUPERVISORS } from "@/utils/constants";

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string[];
  education: string;
  address: string;
  supervisor: string;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  phoneNumber: Yup.array()
    .of(Yup.string().required("Phone number is required"))
    .min(1, "At least one phone number is required"),
  education: Yup.string().required("Education is required"),
  address: Yup.string().required("Address is required"),
  supervisor: Yup.string().required("Supervisor is required"),
});

export const RegisterForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { error, isLoading, saveTokens } = useAuth();

  const initialValues: RegisterFormValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: [""],
    education: "",
    address: "",
    supervisor: "",
  };

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      const { confirmPassword, ...registerData } = values;
      const result = await dispatch(registerUser(registerData));

      if (result.type.endsWith("/fulfilled")) {
        // Type cast payload to any to resolve TypeScript error
        const payload = result.payload as any;
        const { accessToken, refreshToken } = payload.data;
        saveTokens(accessToken, refreshToken);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: "100%" }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Employee Registration
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, values, handleChange, handleBlur }) => (
              <Form>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 2,
                  }}
                >
                  <Field
                    as={TextField}
                    name="name"
                    label="Full Name"
                    fullWidth
                    margin="normal"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />

                  <Field
                    as={TextField}
                    name="email"
                    type="email"
                    label="Email Address"
                    fullWidth
                    margin="normal"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />

                  <Field
                    as={TextField}
                    name="password"
                    type="password"
                    label="Password"
                    fullWidth
                    margin="normal"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                  />

                  <Field
                    as={TextField}
                    name="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    fullWidth
                    margin="normal"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.confirmPassword && Boolean(errors.confirmPassword)
                    }
                    helperText={
                      touched.confirmPassword && errors.confirmPassword
                    }
                  />
                </Box>

                {/* Phone Numbers */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Phone Numbers
                  </Typography>
                  <FieldArray name="phoneNumber">
                    {({ push, remove }) => (
                      <Box>
                        {values.phoneNumber.map((phone, index) => (
                          <Box
                            key={index}
                            sx={{ display: "flex", gap: 1, mb: 1 }}
                          >
                            <TextField
                              name={`phoneNumber.${index}`}
                              label={`Phone ${index + 1}`}
                              fullWidth
                              value={phone}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                touched.phoneNumber &&
                                Array.isArray(touched.phoneNumber) &&
                                touched.phoneNumber[index] &&
                                Boolean(errors.phoneNumber?.[index])
                              }
                              helperText={
                                touched.phoneNumber &&
                                Array.isArray(touched.phoneNumber) &&
                                touched.phoneNumber[index] &&
                                errors.phoneNumber?.[index]
                              }
                            />
                            {values.phoneNumber.length > 1 && (
                              <IconButton
                                onClick={() => remove(index)}
                                color="error"
                                sx={{ mt: 1 }}
                              >
                                <RemoveIcon />
                              </IconButton>
                            )}
                            {index === values.phoneNumber.length - 1 && (
                              <IconButton
                                onClick={() => push("")}
                                color="primary"
                                sx={{ mt: 1 }}
                              >
                                <AddIcon />
                              </IconButton>
                            )}
                          </Box>
                        ))}
                      </Box>
                    )}
                  </FieldArray>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 2,
                    mt: 2,
                  }}
                >
                  <Field
                    as={TextField}
                    name="education"
                    label="Education"
                    fullWidth
                    multiline
                    rows={2}
                    value={values.education}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.education && Boolean(errors.education)}
                    helperText={touched.education && errors.education}
                  />

                  <Field
                    as={TextField}
                    name="address"
                    label="Address"
                    fullWidth
                    multiline
                    rows={2}
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.address && Boolean(errors.address)}
                    helperText={touched.address && errors.address}
                  />
                </Box>

                <FormControl fullWidth margin="normal">
                  <InputLabel>Supervisor</InputLabel>
                  <Field
                    as={Select}
                    name="supervisor"
                    label="Supervisor"
                    value={values.supervisor}
                    onChange={handleChange}
                    error={touched.supervisor && Boolean(errors.supervisor)}
                  >
                    {SUPERVISORS.map((supervisor) => (
                      <MenuItem key={supervisor} value={supervisor}>
                        {supervisor}
                      </MenuItem>
                    ))}
                  </Field>
                  {touched.supervisor && errors.supervisor && (
                    <Typography color="error" variant="caption" sx={{ ml: 2 }}>
                      {errors.supervisor}
                    </Typography>
                  )}
                </FormControl>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>

                <Box textAlign="center">
                  <Link
                    href="/login"
                    variant="body2"
                    sx={{ cursor: "pointer" }}
                  >
                    Already have an account? Sign In
                  </Link>
                </Box>
              </Form>
            )}
          </Formik>
        </Paper>
      </Box>
    </Container>
  );
};
