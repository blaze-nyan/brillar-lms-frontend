"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Tabs,
  Tab,
  Container,
  Link,
} from "@mui/material";
import { AppDispatch } from "@/store";
import { loginUser, loginAdmin } from "@/store/slices/authSlice";
import { useAuth } from "@/hooks/useAuth";

interface LoginFormValues {
  email: string;
  password: string;
}

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const LoginForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { error, isLoading, saveTokens } = useAuth();
  const [loginType, setLoginType] = useState<"user" | "admin">("user");

  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const action = loginType === "user" ? loginUser : loginAdmin;
      const result = await dispatch(action(values));

      if (result.type.endsWith("/fulfilled")) {
        // Type cast payload to any to resolve TypeScript error
        const payload = result.payload as any;
        const { accessToken, refreshToken } = payload.data;
        saveTokens(accessToken, refreshToken);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: "100%" }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Brillar LMS
          </Typography>

          <Tabs
            value={loginType}
            onChange={(_, newValue) => setLoginType(newValue)}
            centered
            sx={{ mb: 3 }}
          >
            <Tab label="Employee Login" value="user" />
            <Tab label="Admin Login" value="admin" />
          </Tabs>

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

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>

                {loginType === "user" && (
                  <Box textAlign="center">
                    <Link
                      href="/register"
                      variant="body2"
                      sx={{ cursor: "pointer" }}
                    >
                      Don&apos;t have an account? Sign Up
                    </Link>
                  </Box>
                )}
              </Form>
            )}
          </Formik>
        </Paper>
      </Box>
    </Container>
  );
};
