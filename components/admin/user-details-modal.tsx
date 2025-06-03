"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Tabs,
  Tab,
  MenuItem,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { updateUser } from "@/lib/features/admin/adminSlice"
import { LeaveHistory } from "@/components/leave-history"
import type { User, LeaveRequest } from "@/lib/types"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

interface UserDetailsModalProps {
  open: boolean
  onClose: () => void
  user: User | null
  viewOnly?: boolean
  leaveHistory?: LeaveRequest[]
}

const supervisors = ["Ko Kaung San Phoe", "Ko Kyaw Swa Win", "Dimple", "Budiman"]
const statuses = ["active", "inactive", "on_leave"]

export function UserDetailsModal({ open, onClose, user, viewOnly = false, leaveHistory = [] }: UserDetailsModalProps) {
  const dispatch = useAppDispatch()
  const { isSubmitting, error } = useAppSelector((state) => state.admin)

  const [tabValue, setTabValue] = useState(0)
  const [userData, setUserData] = useState<Partial<User>>(user || {})
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(user?.phoneNumber || [""])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleChange = (field: keyof User, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePhoneChange = (index: number, value: string) => {
    const newPhoneNumbers = [...phoneNumbers]
    newPhoneNumbers[index] = value
    setPhoneNumbers(newPhoneNumbers)
  }

  const handleAddPhone = () => {
    setPhoneNumbers([...phoneNumbers, ""])
  }

  const handleRemovePhone = (index: number) => {
    const newPhoneNumbers = [...phoneNumbers]
    newPhoneNumbers.splice(index, 1)
    setPhoneNumbers(newPhoneNumbers)
  }

  const handleSubmit = async () => {
    if (!user?.id) return

    try {
      await dispatch(
        updateUser({
          userId: user.id,
          userData: { ...userData, phoneNumber: phoneNumbers.filter((p) => p.trim() !== "") },
        }),
      ).unwrap()
      onClose()
    } catch (error) {
      // Error handled by Redux
    }
  }

  if (!user) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {viewOnly ? "User Details" : "Edit User"}
        <Typography variant="body2" color="text.secondary">
          {user.email}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="user details tabs">
            <Tab label="Profile" />
            <Tab label="Leave History" />
          </Tabs>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                fullWidth
                value={userData.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={viewOnly || isSubmitting}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                fullWidth
                value={userData.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                disabled={viewOnly || isSubmitting}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Role"
                fullWidth
                value={userData.role || "user"}
                onChange={(e) => handleChange("role", e.target.value)}
                disabled={viewOnly || isSubmitting}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Status"
                fullWidth
                value={userData.status || "active"}
                onChange={(e) => handleChange("status", e.target.value)}
                disabled={viewOnly || isSubmitting}
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.replace("_", " ").toUpperCase()}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Supervisor"
                fullWidth
                value={userData.supervisor || ""}
                onChange={(e) => handleChange("supervisor", e.target.value)}
                disabled={viewOnly || isSubmitting}
              >
                {supervisors.map((supervisor) => (
                  <MenuItem key={supervisor} value={supervisor}>
                    {supervisor}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Phone Numbers
              </Typography>
              {phoneNumbers.map((phone, index) => (
                <Box key={index} sx={{ display: "flex", gap: 1, mb: 1 }}>
                  <TextField
                    label={`Phone ${index + 1}`}
                    fullWidth
                    value={phone}
                    onChange={(e) => handlePhoneChange(index, e.target.value)}
                    disabled={viewOnly || isSubmitting}
                  />
                  {!viewOnly && phoneNumbers.length > 1 && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemovePhone(index)}
                      disabled={isSubmitting}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              ))}
              {!viewOnly && (
                <Button variant="outlined" onClick={handleAddPhone} disabled={isSubmitting}>
                  Add Phone
                </Button>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Education"
                fullWidth
                multiline
                rows={2}
                value={userData.education || ""}
                onChange={(e) => handleChange("education", e.target.value)}
                disabled={viewOnly || isSubmitting}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                fullWidth
                multiline
                rows={3}
                value={userData.address || ""}
                onChange={(e) => handleChange("address", e.target.value)}
                disabled={viewOnly || isSubmitting}
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <LeaveHistory leaveHistory={leaveHistory} />
        </TabPanel>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          {viewOnly ? "Close" : "Cancel"}
        </Button>
        {!viewOnly && (
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            Save Changes
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
