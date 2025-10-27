"use client"

import { useQueryClient } from "@tanstack/react-query"

import { useState } from "react"

import PropTypes from "prop-types"

import CloseIcon from "@mui/icons-material/Close"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"
import { Box, Modal, Stack, Button, Typography, IconButton, CircularProgress } from "@mui/material"

import { useUploadCertificate } from "src/hooks/useClinicHooks"

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
}

export default function UploadCertificateModal({ open, handleClose }) {
  const [certificateFile, setCertificateFile] = useState(null)
  const [fileName, setFileName] = useState("")
  const [fileType, setFileType] = useState(null)
  const [fileURL, setFileURL] = useState(null)
  const [errors, setErrors] = useState({})

  const { mutate: uploadCertificate, isPending } = useUploadCertificate()
  const queryClient = useQueryClient()

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/gif"]

      if (!allowedTypes.includes(file.type)) {
        alert("Only PDF, JPEG, JPG, PNG, or GIF files are allowed.")
        e.target.value = ""
        return
      }

      // Validate file size (10MB to match backend)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        alert("File size must be less than 10MB.")
        e.target.value = ""
        return
      }

      setCertificateFile(file)
      setFileName(file.name)
      setFileType(file.type.includes("image") ? "image" : "pdf")

      // Only create preview for images
      if (file.type.startsWith("image/")) {
        setFileURL(URL.createObjectURL(file))
      } else {
        setFileURL(null) // No preview for PDFs
      }

      setErrors((prev) => ({ ...prev, certificate: "" }))
    } else {
      e.target.value = ""
      setCertificateFile(null)
      setFileName("")
      setFileURL(null)
    }
  }

  const handleSubmit = () => {
    if (!certificateFile) {
      setErrors({ certificate: "Please select a PDF file." })
      return
    }

    const formData = new FormData()
    formData.append("certificate", certificateFile)

    uploadCertificate(formData, {
      onSuccess: () => {
        alert("Certificate uploaded successfully!")
        setCertificateFile(null)
        setFileName("")
        setFileURL(null)
        setErrors({})
        queryClient.invalidateQueries({ queryKey: ["clinicNotifications"] })
        handleClose()
      },
      onError: (error) => {
        setErrors({ backend: error?.response?.data?.message || "Failed to upload certificate." })
      },
    })
  }

  const renderFilePreview = () => {
    if (!fileURL && !certificateFile) {
      return <CloudUploadIcon fontSize="large" />
    }

    if (fileType === "pdf") {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#F3F4F6",
          }}
        >
          <PictureAsPdfIcon fontSize="large" color="error" />
        </div>
      )
    }

    return (
      <img
        src={fileURL || "/placeholder.svg"}
        alt="Certificate preview"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    )
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <IconButton aria-label="close" onClick={handleClose} sx={{ position: "absolute", right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>
          Upload Clinic Certificate
        </Typography>

        <Stack spacing={2} alignItems="center">
          {/* File Upload Button */}
          <IconButton
            component="label"
            sx={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              border: "2px dashed #ddd",
              backgroundColor: "#F3F4F6",
              "&:hover": { backgroundColor: "#E5E7EB" },
              padding: 0,
              overflow: "hidden",
            }}
          >
            {renderFilePreview()}
            <input
              type="file"
              hidden
              accept=".pdf,.jpg,.jpeg,.png,.gif"
              onChange={handleFileChange}
              disabled={isPending}
            />
          </IconButton>

          {fileName && (
            <Typography
              variant="body2"
              sx={{ cursor: "pointer", color: "#4B5563" }}
              onClick={() => window.open(fileURL, "_blank")}
            >
              {fileName.length > 20 ? `${fileName.substring(0, 17)}...` : fileName}
            </Typography>
          )}

          {errors.certificate && (
            <Typography color="error" sx={{ fontSize: "0.75rem" }}>
              {errors.certificate}
            </Typography>
          )}
          {errors.backend && (
            <Typography color="error" sx={{ fontSize: "0.75rem" }}>
              {errors.backend}
            </Typography>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
            This certificate will not be displayed in your public profile. It is for verification purposes only.
          </Typography>

          <Button
            variant="contained"
            color="success"
            disabled={isPending || !certificateFile}
            onClick={handleSubmit}
            fullWidth
            sx={{ mt: 2 }}
          >
            {isPending ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Submit"}
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}

UploadCertificateModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
}
