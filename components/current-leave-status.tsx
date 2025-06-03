"use client"
import { Card, CardContent, Typography, Box, Chip, LinearProgress } from "@mui/material"
import {
  BeachAccess as VacationIcon,
  LocalHospital as SickIcon,
  EventAvailable as CasualIcon,
} from "@mui/icons-material"
import type { CurrentLeave } from "@/lib/types"

interface CurrentLeaveStatusProps {
  currentLeave: CurrentLeave | null
}

const leaveTypeConfig = {
  annualLeave: {
    title: "Annual Leave",
    icon: VacationIcon,
    color: "bg-blue-500",
    chipColor: "primary" as const,
  },
  sickLeave: {
    title: "Sick Leave",
    icon: SickIcon,
    color: "bg-red-500",
    chipColor: "error" as const,
  },
  casualLeave: {
    title: "Casual Leave",
    icon: CasualIcon,
    color: "bg-green-500",
    chipColor: "success" as const,
  },
}

export function CurrentLeaveStatus({ currentLeave }: CurrentLeaveStatusProps) {
  if (!currentLeave) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Typography variant="h6" className="font-semibold mb-2">
            Current Leave Status
          </Typography>
          <Typography variant="body2" className="text-gray-500">
            You are not currently on leave
          </Typography>
        </CardContent>
      </Card>
    )
  }

  const config = leaveTypeConfig[currentLeave.leaveType]
  const Icon = config.icon
  const progressPercentage = ((currentLeave.totalDays - currentLeave.daysRemaining) / currentLeave.totalDays) * 100

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card className="border-l-4 border-l-orange-500">
      <CardContent className="p-6">
        <Box className="flex items-center justify-between mb-4">
          <Typography variant="h6" className="font-semibold">
            Current Leave Status
          </Typography>
          <Chip label="On Leave" color="warning" variant="filled" size="small" />
        </Box>

        <Box className="flex items-center gap-3 mb-4">
          <Box className={`p-2 rounded-lg ${config.color}`}>
            <Icon className="text-white text-xl" />
          </Box>
          <Box>
            <Typography variant="subtitle1" className="font-semibold">
              {config.title}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              {formatDate(currentLeave.startDate)} - {formatDate(currentLeave.endDate)}
            </Typography>
          </Box>
        </Box>

        <Box className="mb-3">
          <Box className="flex justify-between items-center mb-1">
            <Typography variant="body2" className="text-gray-600">
              Progress
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              {currentLeave.totalDays - currentLeave.daysRemaining} / {currentLeave.totalDays} days
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            color="warning"
            className="h-2 rounded-full"
          />
        </Box>

        <Box className="flex justify-between items-center">
          <Typography variant="body2" className="text-gray-500">
            Days remaining:
          </Typography>
          <Chip label={`${currentLeave.daysRemaining} days`} color={config.chipColor} variant="outlined" size="small" />
        </Box>
      </CardContent>
    </Card>
  )
}
