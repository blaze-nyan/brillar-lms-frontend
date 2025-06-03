"use client"

import { useEffect } from "react"
import { Typography, Box, Grid } from "@mui/material"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchLeaveBalance, fetchLeaveHistory, setCurrentLeave } from "@/lib/features/leave/leaveSlice"
import { UserLayout } from "@/components/layout/user-layout"
import { LeaveBalanceCard } from "@/components/leave-balance-card"
import { LeaveRequestForm } from "@/components/leave-request-form"
import { CurrentLeaveStatus } from "@/components/current-leave-status"
import { UserProfileCard } from "@/components/user-profile-card"
import { LeaveHistory } from "@/components/leave-history"
import { CardSkeleton } from "@/components/loading/table-skeleton"

export default function UserDashboardPage() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { balance, currentLeave, leaveHistory, isLoading } = useAppSelector((state) => state.leave)

  useEffect(() => {
    // Fetch leave data when component mounts
    dispatch(fetchLeaveBalance())
    dispatch(fetchLeaveHistory())

    // Mock current leave data - in real app, this would come from API
    dispatch(
      setCurrentLeave({
        id: "1",
        leaveType: "annualLeave",
        startDate: "2024-01-15",
        endDate: "2024-01-19",
        daysRemaining: 2,
        totalDays: 5,
      }),
    )
  }, [dispatch])

  if (!user) {
    return null
  }

  // Mock leave balance data - in real app, this would come from API
  const mockBalance = balance || {
    annualLeave: { total: 10, used: 3, remaining: 7 },
    sickLeave: { total: 14, used: 2, remaining: 12 },
    casualLeave: { total: 5, used: 1, remaining: 4 },
  }

  return (
    <UserLayout>
      <Box className="mb-8">
        <Typography variant="h4" component="h1" className="font-bold text-gray-800 mb-2">
          Employee Dashboard
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Manage your leave requests and view your leave balance
        </Typography>
      </Box>

      {/* Leave Balance Cards */}
      <Box className="mb-8">
        <Typography variant="h6" className="font-semibold mb-4">
          Leave Balance
        </Typography>
        <Grid container spacing={3}>
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <CardSkeleton />
              </Grid>
            ))
          ) : (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <LeaveBalanceCard
                  leaveType="annualLeave"
                  total={mockBalance.annualLeave.total}
                  used={mockBalance.annualLeave.used}
                  remaining={mockBalance.annualLeave.remaining}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <LeaveBalanceCard
                  leaveType="sickLeave"
                  total={mockBalance.sickLeave.total}
                  used={mockBalance.sickLeave.used}
                  remaining={mockBalance.sickLeave.remaining}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <LeaveBalanceCard
                  leaveType="casualLeave"
                  total={mockBalance.casualLeave.total}
                  used={mockBalance.casualLeave.used}
                  remaining={mockBalance.casualLeave.remaining}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} lg={8}>
          <Box className="space-y-6">
            {/* Current Leave Status */}
            <CurrentLeaveStatus currentLeave={currentLeave} />

            {/* Leave Request Form */}
            <LeaveRequestForm />

            {/* Leave History */}
            <LeaveHistory leaveHistory={leaveHistory} isLoading={isLoading} />
          </Box>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} lg={4}>
          <UserProfileCard user={user} />
        </Grid>
      </Grid>
    </UserLayout>
  )
}
