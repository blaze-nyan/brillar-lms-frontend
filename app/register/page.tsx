"use client"
import { useRouter } from "next/navigation"
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  MenuItem,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material"
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material"
import { Formik, Form, Field, FieldArray } from "formik"
import * as Yup from "yup"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { registerUser } from "@/lib/features/auth/authSlice"
import Link from "next/link"

const supervisors = ["Ko Kaung San Phoe", "Ko Kyaw Swa Win", "Dimple", "Budiman"]

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  phoneNumber: Yup.array()
    .of(Yup.string().required("Phone number is required"))
    .min(1, "At least one phone number is required"),
  education: Yup.string().required("Education is required"),
  address: Yup.string().required("Address is required"),
  supervisor: Yup.string().required("Supervisor is required"),
})

export default function RegisterPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { isLoading, error } = useAppSelector((state) => state.auth)

  const handleSubmit = async (values: any) => {
    try {
      const { confirmPassword, ...userData } = values
      const result = await dispatch(registerUser(userData)).unwrap()

      if (result) {
        router.push("/dashboard")
      }
    } catch (error) {
      // Error is handled by the slice
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4">
      <Container maxWidth="md">
        <Paper elevation={8} className="p-8 rounded-2xl">
          <Box className="text-center mb-8">
            <Typography variant="h4" component="h1" className="font-bold text-gray-800 mb-2">
              Create Account
            </Typography>
            <Typography variant="body1" className="text-gray-600">
              Join our Leave Management System
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
              phoneNumber: [""],
              education: "",
              address: "",
              supervisor: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, values, handleChange, handleBlur, setFieldValue }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    as={TextField}
                    fullWidth
                    name="name"
                    label="Full Name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />

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
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  />

                  <Field
                    as={TextField}
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                    helperText={touched.confirmPassword && errors.confirmPassword}
                  />
                </div>

                <Box>
                  <Typography variant="subtitle1" className="mb-2 font-semibold">
                    Phone Numbers
                  </Typography>
                  <FieldArray name="phoneNumber">
                    {({ push, remove }) => (
                      <div className="space-y-2">
                        {values.phoneNumber.map((phone, index) => (
                          <div key={index} className="flex gap-2">
                            <TextField
                              fullWidth
                              label={`Phone Number ${index + 1}`}
                              value={phone}
                              onChange={(e) => setFieldValue(`phoneNumber.${index}`, e.target.value)}
                              error={touched.phoneNumber?.[index] && Boolean(errors.phoneNumber?.[index])}
                              helperText={touched.phoneNumber?.[index] && errors.phoneNumber?.[index]}
                              InputProps={{
                                endAdornment: values.phoneNumber.length > 1 && (
                                  <InputAdornment position="end">
                                    <IconButton onClick={() => remove(index)} size="small">
                                      <DeleteIcon />
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={() => push("")}
                          className="mt-2"
                        >
                          Add Phone Number
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                </Box>

                <Field
                  as={TextField}
                  fullWidth
                  name="education"
                  label="Education"
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
                  fullWidth
                  name="address"
                  label="Address"
                  multiline
                  rows={3}
                  value={values.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.address && Boolean(errors.address)}
                  helperText={touched.address && errors.address}
                />

                <Field
                  as={TextField}
                  fullWidth
                  select
                  name="supervisor"
                  label="Supervisor"
                  value={values.supervisor}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.supervisor && Boolean(errors.supervisor)}
                  helperText={touched.supervisor && errors.supervisor}
                >
                  {supervisors.map((supervisor) => (
                    <MenuItem key={supervisor} value={supervisor}>
                      {supervisor}
                    </MenuItem>
                  ))}
                </Field>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  className="py-3 text-lg font-semibold bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
                </Button>
              </Form>
            )}
          </Formik>

          <Box className="mt-6 text-center">
            <Typography variant="body2" className="text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-green-600 hover:text-green-800 font-semibold">
                Sign in here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </div>
  )
}
