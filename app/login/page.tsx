"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
} from "@mui/material"
import { Formik, Form, Field } from "formik"
import * as Yup from "yup"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { loginUser, clearError } from "@/lib/features/auth/authSlice"
import Link from "next/link"

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
})

export default function LoginPage() {
  const [userType, setUserType] = useState<"admin" | "user">("user")
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { isLoading, error } = useAppSelector((state) => state.auth)

  const handleUserTypeChange = (event: React.MouseEvent<HTMLElement>, newUserType: "admin" | "user" | null) => {
    if (newUserType !== null) {
      setUserType(newUserType)
      dispatch(clearError())
    }
  }

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const result = await dispatch(
        loginUser({
          email: values.email,
          password: values.password,
          role: userType,
        }),
      ).unwrap()

      if (result) {
        router.push("/dashboard")
      }
    } catch (error) {
      // Error is handled by the slice
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Container maxWidth="sm">
        <Paper elevation={8} className="p-8 rounded-2xl">
          <Box className="text-center mb-8">
            <Typography variant="h4" component="h1" className="font-bold text-gray-800 mb-2">
              Leave Management System
            </Typography>
            <Typography variant="body1" className="text-gray-600">
              Sign in to your account
            </Typography>
          </Box>

          <Box className="mb-6 flex justify-center">
            <ToggleButtonGroup
              value={userType}
              exclusive
              onChange={handleUserTypeChange}
              aria-label="user type"
              className="bg-gray-100 rounded-lg"
            >
              <ToggleButton value="user" className="px-6 py-2">
                User
              </ToggleButton>
              <ToggleButton value="admin" className="px-6 py-2">
                Admin
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, values, handleChange, handleBlur }) => (
              <Form className="space-y-4">
                <Field
                  as={TextField}
                  fullWidth
                  name="email"
                  label="Email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  className="mb-4"
                />

                <Field
                  as={TextField}
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  className="mb-6"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  className="py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    `Sign In as ${userType === "admin" ? "Admin" : "User"}`
                  )}
                </Button>
              </Form>
            )}
          </Formik>

          {userType === "user" && (
            <Box className="mt-6 text-center">
              <Typography variant="body2" className="text-gray-600">
                Don't have an account?{" "}
                <Link href="/register" className="text-blue-600 hover:text-blue-800 font-semibold">
                  Sign up here
                </Link>
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </div>
  )
}
