"use client"

import type React from "react"
import { Snackbar, Alert, Slide, type SlideProps } from "@mui/material"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { removeNotification } from "@/lib/features/ui/uiSlice"

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const { notifications } = useAppSelector((state) => state.ui)

  const activeNotification = notifications.find((n) => !n.read)

  const handleClose = (notificationId: string) => {
    dispatch(removeNotification(notificationId))
  }

  return (
    <>
      {children}
      {activeNotification && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={() => handleClose(activeNotification.id)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          TransitionComponent={SlideTransition}
        >
          <Alert
            onClose={() => handleClose(activeNotification.id)}
            severity={activeNotification.type}
            variant="filled"
            sx={{ width: "100%" }}
          >
            <strong>{activeNotification.title}</strong>
            <br />
            {activeNotification.message}
          </Alert>
        </Snackbar>
      )}
    </>
  )
}
