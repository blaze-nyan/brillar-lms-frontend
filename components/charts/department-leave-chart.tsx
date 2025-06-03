"use client"

import { Paper, Typography, Box, useTheme } from "@mui/material"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface DepartmentLeaveData {
  department: string
  value: number
  color: string
}

interface DepartmentLeaveChartProps {
  data: DepartmentLeaveData[]
  title?: string
}

export function DepartmentLeaveChart({ data, title = "Leave Distribution by Department" }: DepartmentLeaveChartProps) {
  const theme = useTheme()

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
  ]

  return (
    <Paper elevation={2} sx={{ p: 3, height: 400 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: theme.shape.borderRadius,
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  )
}
