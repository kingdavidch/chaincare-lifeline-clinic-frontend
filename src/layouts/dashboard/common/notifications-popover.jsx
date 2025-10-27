"use client"

import { useRef, useMemo, useState, useEffect } from "react"

import PropTypes from "prop-types"

// Material UI Components
import Avatar from "@mui/material/Avatar"
import Badge from "@mui/material/Badge"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import List from "@mui/material/List"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import ListSubheader from "@mui/material/ListSubheader"
import Popover from "@mui/material/Popover"
import Typography from "@mui/material/Typography"

import { useFetchClinicNotifications, useMarkRecentTwoNotificationsAsRead } from "src/hooks/useClinicHooks"

import { fToNow } from "src/utils/format-time"

// Custom Components and Hooks
import Iconify from "src/components/iconify"
import Scrollbar from "src/components/scrollbar"
import SvgColor from "src/components/svg-color"

import NotificationsModal from "./NotificationsModal"

// NotificationsPopover Component
export default function NotificationsPopover() {
  const [open, setOpen] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const { data } = useFetchClinicNotifications()
  const markRecentTwoAsRead = useMarkRecentTwoNotificationsAsRead()

  // Memoize the recent notifications to avoid recalculating on every render
  const recentNotifications = useMemo(() => data?.data?.slice(0, 2) || [], [data])

  // Use a ref to store recentNotifications and avoid re-renders
  const recentNotificationsRef = useRef(recentNotifications)
  recentNotificationsRef.current = recentNotifications

  // Use a ref to track if the mutation has been triggered
  const hasTriggeredMutation = useRef(false)

  // Calculate the number of unread notifications
  const totalUnRead = recentNotifications.filter((notification) => !notification.isRead).length

  const handleOpen = (event) => {
    setOpen(event.currentTarget)
  }

  const handleClose = () => {
    setOpen(null)
    // Reset the mutation trigger when the popover is closed
    hasTriggeredMutation.current = false
  }

  // Mark the recent two notifications as read when the popover is opened
  useEffect(() => {
    if (open && !hasTriggeredMutation.current) {
      markRecentTwoAsRead.mutate()
      hasTriggeredMutation.current = true // Set the ref to true to prevent future triggers
    }
  }, [open, markRecentTwoAsRead])

  return (
    <>
      {/* Feedback Button */}
      <IconButton
        onClick={() =>
          window.open(
            "https://docs.google.com/forms/d/e/1FAIpQLSdsDZvrqgF69d_wGZQaKmG43xPW3KGxm-beyKalHxSEx9RpRw/viewform?usp=header",
            "_blank",
            "noopener,noreferrer",
          )
        }
        sx={{ mr: 1 }}
      >
        <Badge
          badgeContent="Feedback"
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: "#00ac4f",
              color: "#fff",
              fontSize: "0.7rem",
              fontWeight: 500,
              padding: "0 6px",
              borderRadius: "8px",
              transform: "translate(-85%, 50%)",
            },
          }}
        >
          <Iconify icon="mdi:message-text" width={24} />
        </Badge>
      </IconButton>

      {/* Notifications Button */}
      <IconButton color={open ? "primary" : "default"} onClick={handleOpen}>
        <Badge
          badgeContent={totalUnRead}
          color="error"
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: "#00ac4f",
              color: "#fff",
            },
          }}
        >
          <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
        </Badge>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360,
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Scrollbar sx={{ height: { xs: 340, sm: "auto" } }}>
          <List
            disablePadding
            onClick={() => setModalOpen(true)}
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: "overline" }}>
                Recent
              </ListSubheader>
            }
          >
            {recentNotifications.map((notification) => (
              <NotificationItem key={notification._id} notification={notification} />
            ))}
          </List>
        </Scrollbar>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Box sx={{ p: 1 }}>
          <Button sx={{ color: "#00AC4F" }} fullWidth disableRipple onClick={() => setModalOpen(true)}>
            View All
          </Button>
        </Box>
      </Popover>

      {/* Notifications Modal */}
      <NotificationsModal open={modalOpen} setOpen={setModalOpen} />
    </>
  )
}

// NotificationItem Component
function NotificationItem({ notification }) {
  const { avatar, title } = renderContent(notification)

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: "1px",
        ...(!notification.isRead && {
          bgcolor: "action.selected",
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: "background.neutral" }}>{avatar}</Avatar>
      </ListItemAvatar>

      <ListItemText
        primary={
          <Typography
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
          >
            {title}
          </Typography>
        }
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: "flex",
              alignItems: "center",
              color: "text.disabled",
            }}
          >
            <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
            {fToNow(new Date(notification.createdAt))}
          </Typography>
        }
      />
    </ListItemButton>
  )
}

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    message: PropTypes.string,
    type: PropTypes.string,
    isRead: PropTypes.bool,
    createdAt: PropTypes.string,
  }),
}

// renderContent Function
function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography component="span" variant="body2" sx={{ color: "text.secondary" }}>
        &nbsp; {notification.message}
      </Typography>
    </Typography>
  )

  const typeConfig = {
    info: {
      icon: "material-symbols:info-outline",
      color: "#2196F3", // Blue
      bgColor: "#E3F2FD",
    },
    warning: {
      icon: "material-symbols:warning-outline",
      color: "#FFA000", // Amber
      bgColor: "#FFF8E1",
    },
    alert: {
      icon: "material-symbols:error-outline",
      color: "#D32F2F", // Red
      bgColor: "#FFEBEE",
    },
    wallet: {
      icon: "material-symbols:wallet-outline",
      color: "#4CAF50", // Green
      bgColor: "#E8F5E9",
    },
    order: {
      svg: "orders",
      color: "#9C27B0", // Purple
      bgColor: "#F3E5F5",
    },
    "test result": {
      svg: "test_result",
      color: "#00BCD4", // Cyan
      bgColor: "#E0F7FA",
    },
    claim: {
      svg: "claims",
      color: "#FF5722", // Deep Orange
      bgColor: "#FBE9E7",
    },
  }

  const config = typeConfig[notification.type] || {
    icon: "material-symbols:notifications-outline",
    color: "#757575",
    bgColor: "#EEEEEE",
  }

  const avatarContent = config.svg ? (
    <SvgColor src={`/assets/icons/navbar/${config.svg}.svg`} sx={{ width: 24, height: 24, color: config.color }} />
  ) : (
    <Iconify icon={config.icon} width={24} height={24} sx={{ color: config.color }} />
  )

  return {
    avatar: <Avatar sx={{ bgcolor: config.bgColor }}>{avatarContent}</Avatar>,
    title,
  }
}
