"use client"

import type React from "react"

import { Box, Typography, Button } from "@mui/material"
import { Inbox as InboxIcon, Add as AddIcon } from "@mui/icons-material"

interface EmptyTableProps {
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ReactNode
}

export function EmptyTable({
  title = "No data available",
  description = "There are no items to display at the moment.",
  actionLabel,
  onAction,
  icon,
}: EmptyTableProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        px: 2,
        textAlign: "center",
      }}
    >
      {icon || <InboxIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />}
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="contained" startIcon={<AddIcon />} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  )
}
