"use client"

import { useState } from "react"

import PropTypes from "prop-types"

import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Toolbar from "@mui/material/Toolbar"
import Tooltip from "@mui/material/Tooltip"
import { useTheme } from "@mui/material/styles"

import { useResponsive } from "src/hooks/use-responsive"
import { useClinicDetails } from "src/hooks/useClinicHooks"

import { bgBlur } from "src/theme/css"

import Iconify from "src/components/iconify"

import NotificationsPopover from "./common/notifications-popover"
import { NAV, HEADER } from "./config-layout"

export default function Header({ onOpenNav }) {
  const theme = useTheme()
  const lgUp = useResponsive("up", "lg")
  const { data: clinic } = useClinicDetails()
  const [copiedUrl, setCopiedUrl] = useState(false)

  const isSuspendedOrRejected =
    clinic?.status === "suspended" || clinic?.status === "rejected" || clinic?.status === "pending"

  const handleCopyShareUrl = () => {
    if (clinic?.shareUrl) {
      navigator.clipboard.writeText(clinic.shareUrl)
      setCopiedUrl(true)
      setTimeout(() => setCopiedUrl(false), 2000)
    }
  }

  const renderContent = (
    <>
      {!lgUp && (
        <IconButton onClick={onOpenNav} sx={{ mr: 1 }}>
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
      )}

      {clinic?.shareUrl && (
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            px: 2,
            py: 1,
            bgcolor: "rgba(0, 172, 79, 0.08)",
            borderRadius: 1,
            border: "1px solid rgba(0, 172, 79, 0.2)",
            mr: 2,
          }}
        >
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              wordBreak: "break-all",
            }}
          >
            <Box
              component="span"
              sx={{
                fontSize: "0.875rem",
                color: "text.secondary",
                fontWeight: 500,
              }}
            >
              {clinic.shareUrl}
            </Box>
          </Box>
          <Tooltip title={copiedUrl ? "Copied!" : "Copy URL"}>
            <IconButton
              size="small"
              onClick={handleCopyShareUrl}
              sx={{
                bgcolor: copiedUrl ? "#4CAF50" : "transparent",
                "&:hover": {
                  bgcolor: copiedUrl ? "#4CAF50" : "rgba(0, 172, 79, 0.1)",
                },
                flexShrink: 0,
              }}
            >
              <ContentCopyIcon
                sx={{
                  fontSize: 18,
                  color: copiedUrl ? "white" : "text.secondary",
                }}
              />
            </IconButton>
          </Tooltip>
        </Stack>
      )}

      <Box sx={{ flexGrow: 1 }} />

      <Stack direction="row" alignItems="center" spacing={1}>
        <NotificationsPopover />
      </Stack>
    </>
  )

  return (
    <AppBar
      sx={{
        boxShadow: "none",
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(["height"], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${NAV.WIDTH + 1}px)`,
          height: HEADER.H_DESKTOP,
        }),
      }}
    >
      {isSuspendedOrRejected && (
        <Box
          sx={{
            backgroundColor: "error.main",
            color: "common.white",
            textAlign: "center",
            py: 0.5,
            fontSize: "0.875rem",
          }}
        >
          Your account is currently {clinic?.status}. Some features may be restricted.
        </Box>
      )}

      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  )
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
}
