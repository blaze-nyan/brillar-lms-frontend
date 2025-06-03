"use client"
import { Card, CardContent, Typography, Box, Chip, Divider } from "@mui/material"
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Home as HomeIcon,
  SupervisorAccount as SupervisorIcon,
  Badge as BadgeIcon,
} from "@mui/icons-material"
import type { User } from "@/lib/types"

interface UserProfileCardProps {
  user: User
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <Box className="flex items-center justify-between mb-4">
          <Typography variant="h6" className="font-semibold">
            Profile Information
          </Typography>
          <Chip
            label={user.role === "admin" ? "Administrator" : "Employee"}
            color={user.role === "admin" ? "secondary" : "primary"}
            variant="outlined"
            size="small"
            icon={<BadgeIcon />}
          />
        </Box>

        <Box className="space-y-4">
          <Box className="flex items-center gap-3">
            <PersonIcon className="text-gray-500" />
            <Box>
              <Typography variant="body2" className="text-gray-500">
                Full Name
              </Typography>
              <Typography variant="body1" className="font-medium">
                {user.name}
              </Typography>
            </Box>
          </Box>

          <Box className="flex items-center gap-3">
            <EmailIcon className="text-gray-500" />
            <Box>
              <Typography variant="body2" className="text-gray-500">
                Email Address
              </Typography>
              <Typography variant="body1" className="font-medium">
                {user.email}
              </Typography>
            </Box>
          </Box>

          <Box className="flex items-start gap-3">
            <PhoneIcon className="text-gray-500 mt-1" />
            <Box>
              <Typography variant="body2" className="text-gray-500">
                Phone Numbers
              </Typography>
              <Box className="space-y-1">
                {user.phoneNumber.map((phone, index) => (
                  <Typography key={index} variant="body1" className="font-medium">
                    {phone}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>

          {user.education && (
            <>
              <Divider />
              <Box className="flex items-start gap-3">
                <SchoolIcon className="text-gray-500 mt-1" />
                <Box>
                  <Typography variant="body2" className="text-gray-500">
                    Education
                  </Typography>
                  <Typography variant="body1" className="font-medium">
                    {user.education}
                  </Typography>
                </Box>
              </Box>
            </>
          )}

          {user.address && (
            <Box className="flex items-start gap-3">
              <HomeIcon className="text-gray-500 mt-1" />
              <Box>
                <Typography variant="body2" className="text-gray-500">
                  Address
                </Typography>
                <Typography variant="body1" className="font-medium">
                  {user.address}
                </Typography>
              </Box>
            </Box>
          )}

          {user.supervisor && (
            <>
              <Divider />
              <Box className="flex items-center gap-3">
                <SupervisorIcon className="text-gray-500" />
                <Box>
                  <Typography variant="body2" className="text-gray-500">
                    Supervisor
                  </Typography>
                  <Typography variant="body1" className="font-medium">
                    {user.supervisor}
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}
