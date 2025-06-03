"use client"

import type React from "react"
import { useState } from "react"
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  TablePagination,
  IconButton,
  Tooltip,
} from "@mui/material"
import { Visibility as ViewIcon } from "@mui/icons-material"
import type { LeaveRequest } from "@/lib/types"

interface LeaveHistoryProps {
  leaveHistory: LeaveRequest[]
  isLoading?: boolean
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "success"
    case "rejected":
      return "error"
    case "pending":
      return "warning"
    default:
      return "default"
  }
}

const getLeaveTypeLabel = (leaveType: string) => {
  switch (leaveType) {
    case "annualLeave":
      return "Annual Leave"
    case "sickLeave":
      return "Sick Leave"
    case "casualLeave":
      return "Casual Leave"
    default:
      return leaveType
  }
}

export function LeaveHistory({ leaveHistory, isLoading = false }: LeaveHistoryProps) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const paginatedHistory = leaveHistory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <Card>
      <CardContent className="p-6">
        <Typography variant="h6" className="font-semibold mb-4">
          Leave History
        </Typography>

        {leaveHistory.length === 0 ? (
          <Box className="text-center py-8">
            <Typography variant="body1" className="text-gray-500">
              No leave requests found
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Leave Type</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell align="center">Days</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Applied Date</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedHistory.map((request) => (
                    <TableRow key={request.id} hover>
                      <TableCell>
                        <Typography variant="body2" className="font-medium">
                          {getLeaveTypeLabel(request.leaveType)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{formatDate(request.startDate)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{formatDate(request.endDate)}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" className="font-medium">
                          {request.days}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          color={getStatusColor(request.status) as any}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{formatDate(request.appliedDate)}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton size="small">
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={leaveHistory.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </CardContent>
    </Card>
  )
}
