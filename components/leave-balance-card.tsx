"use client"
import { Card, CardContent, Typography, Box, LinearProgress, Chip } from "@mui/material"
import {
  BeachAccess as VacationIcon,
  LocalHospital as SickIcon,
  EventAvailable as CasualIcon,
} from "@mui/icons-material"
import type { LeaveType } from "@/lib/types"

interface LeaveBalanceCardProps {
  leaveType: LeaveType
  total: number
  used: number
  remaining: number
}

const leaveTypeConfig = {
  annualLeave: {
    title: "Annual Leave",
    icon: VacationIcon,
    color: "bg-blue-500",
    progressColor: "primary" as const,
  },
  sickLeave: {
    title: "Sick Leave",
    icon: SickIcon,
    color: "bg-red-500",
    progressColor: "error" as const,
  },
  casualLeave: {
    title: "Casual Leave",
    icon: CasualIcon,
    color: "bg-green-500",
    progressColor: "success" as const,
  },
}

export function LeaveBalanceCard({ leaveType, total, used, remaining }: LeaveBalanceCardProps) {
  const config = leaveTypeConfig[leaveType]
  const usagePercentage = (used / total) * 100
  const Icon = config.icon

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <Box className="flex items-center justify-between mb-4">
          <Box className="flex items-center gap-3">
            <Box className={`p-2 rounded-lg ${config.color}`}>
              <Icon className="text-white text-xl" />
            </Box>
            <Typography variant="h6" className="font-semibold">
              {config.title}
            </Typography>
          </Box>
          <Chip
            label={`${remaining} days`}
            color={remaining > 0 ? "success" : "error"}
            variant="outlined"
            size="small"
          />
        </Box>

        <Box className="mb-3">
          <Box className="flex justify-between items-center mb-1">
            <Typography variant="body2" className="text-gray-600">
              Used: {used} / {total} days
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              {usagePercentage.toFixed(0)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={usagePercentage}
            color={config.progressColor}
            className="h-2 rounded-full"
          />
        </Box>

        <Box className="flex justify-between text-sm">
          <Typography variant="body2" className="text-gray-500">
            Remaining: <span className="font-semibold text-gray-800">{remaining} days</span>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
