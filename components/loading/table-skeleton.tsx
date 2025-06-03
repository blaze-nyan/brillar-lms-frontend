"use client"

import { Skeleton, TableRow, TableCell, Box } from "@mui/material"

interface TableSkeletonProps {
  rows?: number
  columns?: number
}

export function TableSkeleton({ rows = 5, columns = 6 }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton variant="text" width="100%" height={20} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

export function CardSkeleton() {
  return (
    <Box sx={{ p: 2 }}>
      <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={120} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="80%" height={20} />
    </Box>
  )
}
