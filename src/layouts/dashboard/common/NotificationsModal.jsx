"use client"

import { useState } from "react"

import PropTypes from "prop-types"

import {
  Box,
  Card,
  Table,
  Modal,
  Button,
  Select,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  CardContent,
  TableContainer,
  CircularProgress,
} from "@mui/material"

import {
  useClearNotifications,
  useFetchClinicNotifications,
  useMarkAllNotificationsAsRead,
} from "src/hooks/useClinicHooks"

import CustomPagination from "src/components/pagination"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
}

const notificationTypes = ["all", "order", "test result", "claim", "wallet", "info", "warning", "alert"]

export default function NotificationsModal({ open, setOpen }) {
  const handleClose = () => setOpen(false)
  const [page, setPage] = useState(0)
  const [typeFilter, setTypeFilter] = useState("all")

  const { data, isLoading, isError } = useFetchClinicNotifications({
    type: typeFilter === "all" ? undefined : typeFilter,
    page,
  })

  const markAllAsRead = useMarkAllNotificationsAsRead()
  const clearNotifications = useClearNotifications()

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate()
  }

  const handleClearAll = () => {
    clearNotifications.mutate()
  }

  const totalPages = data?.pagination?.totalPages || 1
  const notifications = data?.data || []

  return (
    <Modal open={open} onClose={handleClose}>
      <Card sx={style}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 5 }}>
            <Typography variant="h3" gutterBottom>
              All Notifications
            </Typography>
            <Box display="flex" gap={2}>
              <Select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value)
                  setPage(0)
                }}
                size="small"
                sx={{ minWidth: 150 }}
              >
                {notificationTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type === "all"
                      ? "All Types"
                      : type
                          .split(" ")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                  </MenuItem>
                ))}
              </Select>

              <Button
                variant="contained"
                onClick={handleMarkAllAsRead}
                disabled={markAllAsRead.isLoading}
                sx={{ backgroundColor: "#00AC4F", color: "#fff" }}
              >
                {markAllAsRead.isLoading ? "Marking..." : "Mark All as Read"}
              </Button>

              <Button
                variant="contained"
                onClick={handleClearAll}
                disabled={clearNotifications.isLoading}
                sx={{ backgroundColor: "#d32f2f", color: "#fff" }}
              >
                {clearNotifications.isLoading ? "Clearing..." : "Clear All"}
              </Button>
            </Box>
          </Box>

          <TableContainer sx={{ maxHeight: 400, overflow: "auto" }}>
            {isLoading && (
              <Box display="flex" justifyContent="center" sx={{ my: 4 }}>
                <CircularProgress sx={{ color: "#00AC4F" }} />
              </Box>
            )}

            {!isLoading && isError && (
              <Typography color="error" align="center" sx={{ mt: 4 }}>
                Failed to load notifications.
              </Typography>
            )}

            {!isLoading && !isError && notifications.length > 0 && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Message</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {notifications.map((notification) => (
                    <TableRow key={notification._id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold" sx={{ textTransform: "capitalize" }}>
                          {notification.type}
                        </Typography>
                      </TableCell>
                      <TableCell>{notification.title}</TableCell>
                      <TableCell>{notification.message}</TableCell>
                      <TableCell>{new Date(notification.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Typography variant="body2" color={notification.isRead ? "text.secondary" : "#00AC4F"}>
                          {notification.isRead ? "Read" : "Unread"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {!isLoading && !isError && notifications.length === 0 && (
              <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
                No notifications found.
              </Typography>
            )}
          </TableContainer>

          {!isLoading && !isError && totalPages > 1 && (
            <CustomPagination count={totalPages} page={page + 1} onPageChange={(_, newPage) => setPage(newPage - 1)} />
          )}
        </CardContent>
      </Card>
    </Modal>
  )
}

NotificationsModal.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
}
