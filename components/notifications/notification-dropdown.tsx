"use client"

import React from "react"

import {
  Menu,
  Typography,
  Box,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Button,
} from "@mui/material"
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ClearAll as ClearAllIcon,
} from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { markNotificationAsRead, removeNotification, clearAllNotifications } from "@/lib/features/ui/uiSlice"

interface NotificationDropdownProps {
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircleIcon color="success" />
    case "error":
      return <ErrorIcon color="error" />
    case "warning":
      return <WarningIcon color="warning" />
    case "info":
      return <InfoIcon />
    default:
      return <InfoIcon />
  }
}

export function NotificationDropdown({ anchorEl, open, onClose }: NotificationDropdownProps) {
  const dispatch = useAppDispatch()
  const { notifications } = useAppSelector((state) => state.ui)

  const handleMarkAsRead = (notificationId: string) => {
    dispatch(markNotificationAsRead(notificationId))
  }

  const handleRemove = (notificationId: string) => {
    dispatch(removeNotification(notificationId))
  }

  const handleClearAll = () => {
    dispatch(clearAllNotifications())
  }

  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(timestamp).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return "Just now"
  }

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 360,
          maxHeight: 400,
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Notifications</Typography>
          {notifications.length > 0 && (
            <Button size="small" startIcon={<ClearAllIcon />} onClick={handleClearAll}>
              Clear All
            </Button>
          )}
        </Box>
      </Box>

      {notifications.length === 0 ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            No notifications
          </Typography>
        </Box>
      ) : (
        <List sx={{ p: 0, maxHeight: 300, overflow: "auto" }}>
          {notifications.slice(0, 10).map((notification, index) => (
            <React.Fragment key={notification.id}>
              <ListItem
                sx={{
                  bgcolor: notification.read ? "transparent" : "action.hover",
                  "&:hover": { bgcolor: "action.selected" },
                }}
              >
                <ListItemIcon>{getNotificationIcon(notification.type)}</ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: notification.read ? "normal" : "bold" }}>
                        {notification.title}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          {formatTime(notification.timestamp)}
                        </Typography>
                        <IconButton size="small" onClick={() => handleRemove(notification.id)}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {notification.message}
                    </Typography>
                  }
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                  sx={{ cursor: notification.read ? "default" : "pointer" }}
                />
                {!notification.read && (
                  <Badge
                    color="primary"
                    variant="dot"
                    sx={{
                      "& .MuiBadge-badge": {
                        right: 8,
                        top: 8,
                      },
                    }}
                  />
                )}
              </ListItem>
              {index < notifications.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Menu>
  )
}
