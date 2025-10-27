"use client"

/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */

import { useState, useEffect } from "react"

import AddIcon from "@mui/icons-material/Add"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import FacebookIcon from "@mui/icons-material/Facebook"
import InstagramIcon from "@mui/icons-material/Instagram"
import LinkedInIcon from "@mui/icons-material/LinkedIn"
import TwitterIcon from "@mui/icons-material/Twitter"
import {
  Box,
  Stack,
  Paper,
  Alert,
  Button,
  Switch,
  Avatar,
  Divider,
  Checkbox,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
  FormControlLabel,
} from "@mui/material"

import { useGetAvailability, useSetAvailability, useDeleteAvailability } from "src/hooks/use-availability"
import { useClinicDetails, useUpdateClinicProfile } from "src/hooks/useClinicHooks"

import { insuranceImages, INSURANCE_OPTIONS } from "src/constant/insurance.options"

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const SOCIAL_MEDIA_PLATFORMS = [
  { id: "facebook", label: "Facebook", icon: FacebookIcon, placeholder: "https://facebook.com/yourpage" },
  { id: "instagram", label: "Instagram", icon: InstagramIcon, placeholder: "https://instagram.com/yourprofile" },
  { id: "twitter", label: "Twitter", icon: TwitterIcon, placeholder: "https://twitter.com/yourhandle" },
  { id: "linkedin", label: "LinkedIn", icon: LinkedInIcon, placeholder: "https://linkedin.com/company/yourcompany" },
]

const INSURANCE_PER_PAGE = 5

const STORAGE_KEYS = {
  SOCIAL_MEDIA: "clinic_social_media",
}

const convertTo12Hour = (time24) => {
  if (!time24) return ""
  const [hours, minutes] = time24.split(":")
  const hour = Number.parseInt(hours, 10)
  const ampm = hour >= 12 ? "PM" : "AM"
  const hour12 = hour % 12 || 12
  return `${hour12.toString().padStart(2, "0")}:${minutes}${ampm}`
}

const convertTo24Hour = (hour12, minute, ampm) => {
  let hour = Number.parseInt(hour12, 10)
  if (ampm === "PM" && hour !== 12) {
    hour += 12
  } else if (ampm === "AM" && hour === 12) {
    hour = 0
  }
  return `${hour.toString().padStart(2, "0")}:${minute}`
}

const checkTimeConflict = (newOpenTime, newCloseTime, existingSlots, editingSlotId = null) => {
  const newOpen = Number.parseInt(newOpenTime.split(":")[0], 10)
  const newClose = Number.parseInt(newCloseTime.split(":")[0], 10)

  for (const slot of existingSlots) {
    // eslint-disable-next-line no-continue
    if (editingSlotId && slot.id === editingSlotId) continue

    const existingOpen = Number.parseInt(slot.openHour.split(":")[0], 10)
    const existingClose = Number.parseInt(slot.closeHour.split(":")[0], 10)

    if (newOpen === existingOpen && newClose === existingClose) {
      return {
        hasConflict: true,
        message: `This time slot (${convertTo12Hour(newOpenTime)} - ${convertTo12Hour(newCloseTime)}) already exists for this day.`,
      }
    }

    if (
      (newOpen >= existingOpen && newOpen < existingClose) ||
      (newClose > existingOpen && newClose <= existingClose) ||
      (newOpen <= existingOpen && newClose >= existingClose)
    ) {
      return {
        hasConflict: true,
        message: `This time slot overlaps with existing slot (${convertTo12Hour(slot.openHour)} - ${convertTo12Hour(slot.closeHour)}).`,
      }
    }
  }

  return { hasConflict: false, message: "" }
}

export default function UserProfile() {
  const { data: fetchedAvailabilities, isLoading: availabilityLoading } = useGetAvailability()
  const setAvailabilityMutation = useSetAvailability()
  const deleteAvailabilityMutation = useDeleteAvailability()
  const { data: clinic } = useClinicDetails()
  const { mutate: updateClinicProfile, isPending: updatePending } = useUpdateClinicProfile()

  const [availabilities, setAvailabilities] = useState([])
  const [editingSlotId, setEditingSlotId] = useState(null)
  const [expandedDay, setExpandedDay] = useState(null)
  const [validationError, setValidationError] = useState(null)
  const [insuranceCurrentPage, setInsuranceCurrentPage] = useState(0)
  const [message, setMessage] = useState(null)
  const [insuranceSearchQuery, setInsuranceSearchQuery] = useState("")

  const [socialMedia, setSocialMedia] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEYS.SOCIAL_MEDIA)
      if (stored) {
        return JSON.parse(stored)
      }
    }
    return (
      clinic?.socialMedia || {
        facebook: "",
        instagram: "",
        twitter: "",
        linkedin: "",
        others: "",
      }
    )
  })

  // eslint-disable-next-line arrow-body-style
  const [supportedInsurance, setSupportedInsurance] = useState(() => {
    return INSURANCE_OPTIONS?.reduce((acc, option) => {
      const shortName = option?.name?.split(" (")[0]
      acc[shortName] = clinic?.supportInsurance?.includes(option.id) || false
      return acc
    }, {})
  })

  const [formData, setFormData] = useState({
    day: "Monday",
    openHour: "09",
    openMinute: "00",
    openAmpm: "AM",
    closeHour: "05",
    closeMinute: "00",
    closeAmpm: "PM",
    isClosed: true,
  })

  const filteredInsuranceOptions = INSURANCE_OPTIONS.filter((insurance) =>
    insurance.name.toLowerCase().includes(insuranceSearchQuery.toLowerCase()),
  )

  const totalInsurancePages = Math.ceil(filteredInsuranceOptions.length / INSURANCE_PER_PAGE)
  const startIndex = insuranceCurrentPage * INSURANCE_PER_PAGE
  const endIndex = startIndex + INSURANCE_PER_PAGE
  const currentInsuranceItems = filteredInsuranceOptions.slice(startIndex, endIndex)

  useEffect(() => {
    if (fetchedAvailabilities && Array.isArray(fetchedAvailabilities)) {
      setAvailabilities(fetchedAvailabilities)
    }
  }, [fetchedAvailabilities])

  useEffect(() => {
    if (clinic) {
      let socialMediaData = clinic?.socialMedia || {
        facebook: "",
        instagram: "",
        twitter: "",
        linkedin: "",
        others: "",
      }

      if (typeof window !== "undefined") {
        const storedSocialMedia = localStorage.getItem(STORAGE_KEYS.SOCIAL_MEDIA)
        if (storedSocialMedia) {
          socialMediaData = JSON.parse(storedSocialMedia)
        }
      }

      setSocialMedia(socialMediaData)

      const insuranceState = INSURANCE_OPTIONS.reduce((acc, option) => {
        const shortName = option.name.split(" (")[0]
        acc[shortName] = clinic.supportInsurance?.includes(option.id) || false
        return acc
      }, {})

      setSupportedInsurance(insuranceState)
    }
  }, [clinic])

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setValidationError(null)
  }

  const handleSocialMediaChange = (platform, value) => {
    const updatedSocialMedia = {
      ...socialMedia,
      [platform]: value,
    }
    setSocialMedia(updatedSocialMedia)
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.SOCIAL_MEDIA, JSON.stringify(updatedSocialMedia))
    }
  }

  const handleInsuranceChange = (e) => {
    const { name, checked } = e.target
    setSupportedInsurance((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleSaveProfileData = () => {
    const formDataToSend = new FormData()

    const supportedInsuranceIds = []
    Object.entries(supportedInsurance).forEach(([shortName, isChecked]) => {
      if (isChecked) {
        const option = INSURANCE_OPTIONS.find((opt) => opt.name.startsWith(shortName))
        if (option) supportedInsuranceIds.push(option.id)
      }
    })

    formDataToSend.append("supportInsurance", JSON.stringify(supportedInsuranceIds))
    formDataToSend.append("socialMedia", JSON.stringify(socialMedia))

    updateClinicProfile(formDataToSend, {
      onSuccess: (response) => {
        console.log("[v0] Profile update successful:", response)
        setMessage("Profile updated successfully!")
      },
      onError: (error) => {
        console.log("[v0] Profile update error:", error)
        console.log("[v0] Error response data:", error?.response?.data)
        setMessage(error?.response?.data?.message || "Failed to update profile.")
      },
    })
  }

  const handleAddAvailability = async () => {
    if (formData.day && formData.openHour && formData.closeHour) {
      const openTime24 = convertTo24Hour(formData.openHour, formData.openMinute, formData.openAmpm)
      const closeTime24 = convertTo24Hour(formData.closeHour, formData.closeMinute, formData.closeAmpm)

      const dayAvail = availabilities.find((item) => item.day === formData.day)
      const existingSlots = dayAvail?.slots || []

      const conflict = checkTimeConflict(openTime24, closeTime24, existingSlots, editingSlotId)
      if (conflict.hasConflict) {
        setValidationError(conflict.message)
        return
      }

      const newSlot = {
        id: Date.now(),
        openHour: openTime24,
        closeHour: closeTime24,
        isClosed: formData.isClosed,
      }

      let updatedAvailabilities = [...availabilities]

      if (editingSlotId) {
        // eslint-disable-next-line no-shadow
        updatedAvailabilities = updatedAvailabilities.map((dayAvail) => ({
          ...dayAvail,
          slots: dayAvail.slots.map((slot) =>
            slot.id === editingSlotId ? { ...slot, ...newSlot, id: slot.id } : slot,
          ),
        }))
        setEditingSlotId(null)
      } else {
        const existingDay = updatedAvailabilities.find((item) => item.day === formData.day)
        if (existingDay) {
          // eslint-disable-next-line no-shadow
          updatedAvailabilities = updatedAvailabilities.map((dayAvail) =>
            dayAvail.day === formData.day ? { ...dayAvail, slots: [...dayAvail.slots, newSlot] } : dayAvail,
          )
        } else {
          updatedAvailabilities = [
            ...updatedAvailabilities,
            {
              day: formData.day,
              slots: [newSlot],
            },
          ]
        }
      }

      setAvailabilities(updatedAvailabilities)

      try {
        const dayData = updatedAvailabilities.find((item) => item.day === formData.day)
        if (dayData && dayData.slots.length > 0) {
          await setAvailabilityMutation.mutateAsync({
            day: dayData.day,
            slots: dayData.slots,
            isClosed: formData.isClosed,
          })
        }
      } catch (error) {
        console.error("Failed to save availability:", error)
        setAvailabilities(availabilities)
      }

      setFormData({
        day: formData.day,
        openHour: "09",
        openMinute: "00",
        openAmpm: "AM",
        closeHour: "05",
        closeMinute: "00",
        closeAmpm: "PM",
        isClosed: true,
      })
      setValidationError(null)
      setExpandedDay(formData.day)
    }
  }

  const handleEditAvailability = (slot) => {
    const openTime = slot.openHour.split(":")
    const closeTime = slot.closeHour.split(":")

    const openHour = Number.parseInt(openTime[0], 10)
    const openMinute = openTime[1]
    const openAmpm = openHour >= 12 ? "PM" : "AM"
    const openHour12 = openHour % 12 || 12

    const closeHour = Number.parseInt(closeTime[0], 10)
    const closeMinute = closeTime[1]
    const closeAmpm = closeHour >= 12 ? "PM" : "AM"
    const closeHour12 = closeHour % 12 || 12

    setFormData({
      day: availabilities.find((d) => d.slots.some((s) => s.id === slot.id))?.day || "Monday",
      openHour: openHour12.toString().padStart(2, "0"),
      openMinute,
      openAmpm,
      closeHour: closeHour12.toString().padStart(2, "0"),
      closeMinute,
      closeAmpm,
      isClosed: slot.isClosed,
    })
    setEditingSlotId(slot.id)
    setValidationError(null)
  }

  const handleCancelEdit = () => {
    setEditingSlotId(null)
    setValidationError(null)
    setFormData({
      day: "Monday",
      openHour: "09",
      openMinute: "00",
      openAmpm: "AM",
      closeHour: "05",
      closeMinute: "00",
      closeAmpm: "PM",
      isClosed: true,
    })
  }

  const handleDeleteAvailability = async (dayIndex, slotId) => {
    const dayData = availabilities[dayIndex]
    const updatedAvailabilities = availabilities
      .map((dayAvail, idx) =>
        idx === dayIndex ? { ...dayAvail, slots: dayAvail.slots.filter((s) => s.id !== slotId) } : dayAvail,
      )
      .filter((dayAvail) => dayAvail.slots.length > 0)

    setAvailabilities(updatedAvailabilities)

    try {
      await deleteAvailabilityMutation.mutateAsync(dayData.day.toLowerCase())
    } catch (error) {
      console.error("Failed to delete availability:", error)
      setAvailabilities(availabilities)
    }
  }

  if (availabilityLoading) {
    return <CircularProgress sx={{ display: "block", margin: "2rem auto", color: "#00AC4F" }} />
  }

  return (
    <Box sx={{ p: 3, borderRadius: 2, maxWidth: "800px", margin: "0 auto", width: "100%" }}>
      <Typography variant="body1" sx={{ fontWeight: "bold", mb: 2 }}>
        Social Media Links
      </Typography>
      <Box sx={{ border: "1px solid #E0E0E0", borderRadius: "12px", p: 2, mb: 3 }}>
        <Stack spacing={2}>
          {SOCIAL_MEDIA_PLATFORMS.map((platform) => {
            const IconComponent = platform.icon
            return (
              <Box key={platform.id}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <IconComponent sx={{ fontSize: 24, color: "#666" }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {platform.label}
                  </Typography>
                </Stack>
                <TextField
                  fullWidth
                  size="small"
                  placeholder={platform.placeholder}
                  value={socialMedia[platform.id] || ""}
                  onChange={(e) => handleSocialMediaChange(platform.id, e.target.value)}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Box>
            )
          })}
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <AddIcon sx={{ fontSize: 24, color: "#666" }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Others
              </Typography>
            </Stack>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter other social media links (e.g., TikTok, YouTube, etc.)"
              value={socialMedia.others || ""}
              onChange={(e) => handleSocialMediaChange("others", e.target.value)}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
          </Box>
        </Stack>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="body1" sx={{ fontWeight: "bold", mb: 2 }}>
        Supported Insurance
      </Typography>
      <Box sx={{ border: "1px solid #E0E0E0", borderRadius: "12px", p: 2, mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search insurance providers..."
          value={insuranceSearchQuery}
          onChange={(e) => {
            setInsuranceSearchQuery(e.target.value)
            setInsuranceCurrentPage(0)
          }}
          variant="outlined"
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
        />
        <Stack spacing={1}>
          {currentInsuranceItems?.map((insurance) => (
            <Stack
              key={insurance.name}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                px: 2,
                py: 2,
                borderBottom: "1px solid #E0E0E0",
                "&:last-child": { borderBottom: "none" },
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar src={insuranceImages[insurance.name]} sx={{ width: 50, height: 50 }} />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {insurance.name.replace("_", " ")}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {insurance.subText}
                  </Typography>
                </Box>
              </Stack>
              <Checkbox
                checked={supportedInsurance[insurance.name] || false}
                name={insurance.name}
                onChange={handleInsuranceChange}
                sx={{
                  color: "#B0B0B0",
                  "&.Mui-checked": { color: "#000" },
                  "& .MuiSvgIcon-root": { fontSize: 28 },
                }}
              />
            </Stack>
          ))}
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: 2, pt: 2, borderTop: "1px solid #E0E0E0" }}
        >
          <Button
            variant="outlined"
            size="small"
            startIcon={<ChevronLeftIcon />}
            onClick={() => setInsuranceCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={insuranceCurrentPage === 0}
          >
            Previous
          </Button>

          <Typography variant="body2" sx={{ fontWeight: 500, color: "#666" }}>
            {insuranceCurrentPage + 1} of {totalInsurancePages || 1}
          </Typography>

          <Button
            variant="outlined"
            size="small"
            endIcon={<ChevronRightIcon />}
            onClick={() => setInsuranceCurrentPage((prev) => Math.min(totalInsurancePages - 1, prev + 1))}
            disabled={insuranceCurrentPage === totalInsurancePages - 1 || totalInsurancePages === 0}
          >
            Next
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="body1" sx={{ fontWeight: "bold", mb: 2 }}>
        Availability
      </Typography>

      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: "white", border: "1px solid #E0E0E0", borderRadius: 2 }}>
        <Stack spacing={2}>
          {DAYS_OF_WEEK.map((day) => {
            const dayAvail = availabilities.find((item) => item.day === day)
            const isExpanded = expandedDay === day

            return (
              <Box key={day}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ p: 1.5, bgcolor: "#FAFAFA", borderRadius: 1, border: "1px solid #E0E0E0" }}
                >
                  <Box flex={1}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {day}
                    </Typography>
                    {dayAvail && dayAvail.slots.length > 0 && (
                      <Stack spacing={0.5} sx={{ mt: 1 }}>
                        {dayAvail.slots.map((slot) => (
                          <Box
                            key={slot.id}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              p: 1,
                              bgcolor: "white",
                              borderRadius: 1,
                              border: "1px solid #E0E0E0",
                            }}
                          >
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                              {slot.isClosed
                                ? "Closed"
                                : `${convertTo12Hour(slot.openHour)} - ${convertTo12Hour(slot.closeHour)}`}
                            </Typography>
                            <Stack direction="row" spacing={0.5}>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  handleEditAvailability(slot)
                                  setExpandedDay(day)
                                }}
                                sx={{ color: "#F57C00", "&:hover": { bgcolor: "#FFF3E0" } }}
                              >
                                <EditIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  const dayIndex = availabilities.findIndex((d) => d.day === day)
                                  handleDeleteAvailability(dayIndex, slot.id)
                                }}
                                disabled={deleteAvailabilityMutation.isPending}
                                sx={{ color: "#D32F2F", "&:hover": { bgcolor: "#FFEBEE" } }}
                              >
                                <DeleteIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Stack>
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </Box>
                  <Button
                    size="small"
                    onClick={() => {
                      setExpandedDay(isExpanded ? null : day)
                      setFormData((prev) => ({ ...prev, day }))
                      setEditingSlotId(null)
                      setValidationError(null)
                    }}
                    sx={{ color: "#F57C00", fontWeight: 600, textTransform: "none", ml: 2 }}
                  >
                    {isExpanded ? "Cancel" : "+ Add Time"}
                  </Button>
                </Stack>

                {isExpanded && (
                  <Box sx={{ p: 2, bgcolor: "#FAFAFA", borderRadius: 1, mt: 1 }}>
                    <Stack spacing={2}>
                      {validationError && (
                        <Alert severity="error" onClose={() => setValidationError(null)}>
                          {validationError}
                        </Alert>
                      )}

                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 600, display: "block", mb: 1 }}>
                          Open Time
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <TextField
                            label="Hour"
                            type="number"
                            inputProps={{ min: "1", max: "12" }}
                            value={formData.openHour}
                            onChange={(e) => handleFormChange("openHour", e.target.value)}
                            size="small"
                            sx={{ width: 80 }}
                          />
                          <Typography>:</Typography>
                          <TextField
                            label="Min"
                            type="number"
                            inputProps={{ min: "0", max: "59" }}
                            value={formData.openMinute}
                            onChange={(e) => handleFormChange("openMinute", e.target.value)}
                            size="small"
                            sx={{ width: 80 }}
                          />
                          <TextField
                            select
                            value={formData.openAmpm}
                            onChange={(e) => handleFormChange("openAmpm", e.target.value)}
                            SelectProps={{ native: true }}
                            size="small"
                            sx={{ width: 80 }}
                          >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </TextField>
                        </Stack>
                      </Box>

                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 600, display: "block", mb: 1 }}>
                          Close Time
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <TextField
                            label="Hour"
                            type="number"
                            inputProps={{ min: "1", max: "12" }}
                            value={formData.closeHour}
                            onChange={(e) => handleFormChange("closeHour", e.target.value)}
                            size="small"
                            sx={{ width: 80 }}
                          />
                          <Typography>:</Typography>
                          <TextField
                            label="Min"
                            type="number"
                            inputProps={{ min: "0", max: "59" }}
                            value={formData.closeMinute}
                            onChange={(e) => handleFormChange("closeMinute", e.target.value)}
                            size="small"
                            sx={{ width: 80 }}
                          />
                          <TextField
                            select
                            value={formData.closeAmpm}
                            onChange={(e) => handleFormChange("closeAmpm", e.target.value)}
                            SelectProps={{ native: true }}
                            size="small"
                            sx={{ width: 80 }}
                          >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </TextField>
                        </Stack>
                      </Box>

                      <FormControlLabel
                        control={
                          <Switch
                            checked={!formData.isClosed}
                            onChange={(e) => handleFormChange("isClosed", !e.target.checked)}
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": { color: "#1976D2" },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#1976D2" },
                            }}
                          />
                        }
                        label={formData.isClosed ? "Closed" : "Open"}
                      />

                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={editingSlotId ? <EditIcon /> : <AddIcon />}
                          onClick={handleAddAvailability}
                          disabled={setAvailabilityMutation.isPending}
                          sx={{ color: "white", fontWeight: 600, textTransform: "none", flex: 1 }}
                        >
                          {setAvailabilityMutation.isPending ? "Saving..." : editingSlotId ? "Update Slot" : "Add Slot"}
                        </Button>
                        {editingSlotId && (
                          <Button
                            variant="outlined"
                            color="success"
                            onClick={() => {
                              handleCancelEdit()
                              setExpandedDay(null)
                            }}
                            sx={{ fontWeight: 600, textTransform: "none" }}
                          >
                            Cancel
                          </Button>
                        )}
                      </Stack>
                    </Stack>
                  </Box>
                )}

                {day !== DAYS_OF_WEEK[DAYS_OF_WEEK.length - 1] && <Divider sx={{ my: 1 }} />}
              </Box>
            )
          })}
        </Stack>
      </Paper>

      <Button
        variant="contained"
        color="success"
        fullWidth
        sx={{ py: 1.5, borderRadius: "10px", fontWeight: "bold", fontSize: 16 }}
        onClick={handleSaveProfileData}
        disabled={updatePending}
      >
        {updatePending ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Save Profile"}
      </Button>

      {message && (
        <Alert
          severity={message.includes("successfully") ? "success" : "error"}
          onClose={() => setMessage(null)}
          sx={{ mt: 2 }}
        >
          {message}
        </Alert>
      )}
    </Box>
  )
}
