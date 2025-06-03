"use client"

import { Paper, Typography, Box, useTheme } from "@mui/material"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface LeaveUtilizationData {
  month: string
  annualLeave: number
  sickLeave: number
  casualLeave: number
}

interface LeaveUtilizationChartProps {
  data: LeaveUtilizationData[]
  title?: string
}

export function LeaveUtilizationChart({ data, title = "Leave Utilization Trends" }: LeaveUtilizationChartProps) {
  const theme = useTheme()

  return (
    <Paper elevation={2} sx={{ p: 3, height: 400 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
            <YAxis stroke={theme.palette.text.secondary} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: theme.shape.borderRadius,
              }}
            />
            <Legend />
            <Bar dataKey="annualLeave" fill={theme.palette.primary.main} name="Annual Leave" />
            <Bar dataKey="sickLeave" fill={theme.palette.error.main} name="Sick Leave" />
            <Bar dataKey="casualLeave" fill={theme.palette.success.main} name="Casual Leave" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  )
}
