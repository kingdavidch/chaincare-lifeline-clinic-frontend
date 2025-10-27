/* eslint-disable */
"use client"

// eslint-disable-next-line import/no-extraneous-dependencies
import { Loader } from "@googlemaps/js-api-loader"

import { useRef, useState, useEffect } from "react"

import ISO6391 from "iso-639-1"

import CameraAltIcon from "@mui/icons-material/CameraAlt"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import MailOutlineIcon from "@mui/icons-material/MailOutline"
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid"
import HomeIcon from "@mui/icons-material/Home"
import BusinessIcon from "@mui/icons-material/Business"
import LaptopIcon from "@mui/icons-material/Laptop"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked"
import CloseIcon from "@mui/icons-material/Close"
import Alert from "@mui/material/Alert"
import {
  Box,
  Menu,
  Stack,
  Button,
  Avatar,
  Divider,
  Checkbox,
  MenuItem,
  TextField,
  IconButton,
  CircularProgress,
  Chip,
  Select,
  Typography,
  FormControl,
  OutlinedInput,
  Link,
} from "@mui/material"
import "react-country-state-city/dist/react-country-state-city.css"

import { useClinicDetails, useUpdateClinicProfile } from "src/hooks/useClinicHooks"

import UploadCertificateModal from "./UploadCertificateModal"

const AVAILABLE_LANGUAGES = ISO6391.getAllNames()

const STORAGE_KEYS = {
  DELIVERY_METHODS: "clinic_delivery_methods",
  LANGUAGES_SPOKEN: "clinic_languages_spoken",
}

const DELIVERY_METHODS = [
  { id: "home", label: "Home Service", icon: HomeIcon },
  { id: "inPerson", label: "In-Person", icon: BusinessIcon },
  { id: "online", label: "Online Session", icon: LaptopIcon },
]

const extractLinks = (text) => {
  const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`[\]]*)/g
  return text.match(urlRegex) || []
}

const capitalizeFirstLetter = (str) => {
  if (!str) return ""
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const LOCATION_CHANGE_EMAIL = "clinical@mylifeline.world"

export default function SettingsForm() {
  const { mutate: updateClinicProfile, isPending } = useUpdateClinicProfile()
  const { data: clinic } = useClinicDetails()
  const [avatarUrl, setAvatarUrl] = useState(clinic?.avatar || "")
  const [selectedFile, setSelectedFile] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [message, setMessage] = useState(null)
  const [locationLoading, setLocationLoading] = useState(false)

  const [openCertificateModal, setOpenCertificateModal] = useState(false)

  const getCityValue = (cityData) => {
    if (Array.isArray(cityData) && cityData.length > 0) {
      return cityData[0]?.value || ""
    }
    return cityData || ""
  }

  const [formDataState, setFormDataState] = useState({
    clinicName: clinic?.clinicName || "",
    username: clinic?.username || "",
    email: clinic?.email || "",
    phoneNumber: clinic?.phoneNo || "",
    address: clinic?.address || "",
    password: "",
    onlineStatus: clinic?.onlineStatus || "online",
    country: clinic?.country || "",
    stateOrProvince: clinic?.location?.stateOrProvince || "",
    cityOrDistrict: getCityValue(clinic?.location?.cityOrDistrict) || "",
    coordinates: clinic?.location?.coordinates || { latitude: 0, longitude: 0 },
    bio: clinic?.bio || "",
    languagesSpoken: (() => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEYS.LANGUAGES_SPOKEN)
        return stored ? JSON.parse(stored) : clinic?.languagesSpoken || []
      }
      return clinic?.languagesSpoken || []
    })(),
    deliveryMethods: (() => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEYS.DELIVERY_METHODS)
        if (stored) {
          return JSON.parse(stored)
        }
      }
      return {
        home: clinic?.deliveryMethods?.includes("home") || false,
        inPerson: clinic?.deliveryMethods?.includes("inPerson") || false,
        online: clinic?.deliveryMethods?.includes("online") || false,
      }
    })(),
  })

  console.log("form data", formDataState.country)
  console.log("form data", formDataState.stateOrProvince)
  console.log("form data", formDataState.cityOrDistrict)

  const initialFormData = useRef(formDataState)

  useEffect(() => {
    if (clinic) {
      let languagesSpoken = clinic?.languagesSpoken || []
      let deliveryMethods = {
        home: clinic?.deliveryMethods?.includes("home") || false,
        inPerson: clinic?.deliveryMethods?.includes("inPerson") || false,
        online: clinic?.deliveryMethods?.includes("online") || false,
      }

      // Prioritize localStorage for languages and delivery methods only
      if (typeof window !== "undefined") {
        const storedLanguages = localStorage.getItem(STORAGE_KEYS.LANGUAGES_SPOKEN)
        if (storedLanguages) {
          languagesSpoken = JSON.parse(storedLanguages)
        }

        const storedDeliveryMethods = localStorage.getItem(STORAGE_KEYS.DELIVERY_METHODS)
        if (storedDeliveryMethods) {
          deliveryMethods = JSON.parse(storedDeliveryMethods)
        }
      }

      const initialData = {
        clinicName: clinic.clinicName,
        username: clinic?.username || "",
        email: clinic.email,
        phoneNumber: clinic.phoneNo,
        address: clinic?.location?.street || "",
        country: clinic?.country || "",
        stateOrProvince: clinic?.location?.stateOrProvince || "",
        cityOrDistrict: getCityValue(clinic?.location?.cityOrDistrict) || "",
        coordinates: clinic?.location?.coordinates || { latitude: 0, longitude: 0 },
        bio: clinic?.bio || "",
        password: "",
        onlineStatus: clinic.onlineStatus || "online",
        languagesSpoken,
        deliveryMethods,
      }

      setFormDataState(initialData)
      initialFormData.current = initialData
      setAvatarUrl(clinic.avatar || "")
    }
  }, [clinic])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormDataState((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDeliveryMethodChange = (methodId) => {
    const updatedMethods = {
      ...formDataState.deliveryMethods,
      [methodId]: !formDataState.deliveryMethods[methodId],
    }
    setFormDataState((prev) => ({
      ...prev,
      deliveryMethods: updatedMethods,
    }))
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.DELIVERY_METHODS, JSON.stringify(updatedMethods))
    }
  }

  const handleRemoveLanguage = (languageToRemove) => {
    const updatedLanguages = formDataState.languagesSpoken.filter((lang) => lang !== languageToRemove)
    setFormDataState((prev) => ({
      ...prev,
      languagesSpoken: updatedLanguages,
    }))
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.LANGUAGES_SPOKEN, JSON.stringify(updatedLanguages))
    }
  }

  const fileInputRef = useRef(null)

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleAvatarChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"]
      if (!allowedTypes.includes(file.type)) {
        alert("Invalid file type. Please upload an image (JPEG, JPG, PNG, or GIF).")
        return
      }

      // Validate file size (5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        alert("File size exceeds the limit of 5MB.")
        return
      }

      // Proceed with the image
      setAvatarUrl(URL.createObjectURL(file))
      setSelectedFile(file)
    }
  }

  const hasChanges = () => {
    const currentData = { ...formDataState, avatar: selectedFile ? "updated" : clinic?.avatar }
    const initialData = initialFormData.current

    const hasChangesDetected =
      currentData.clinicName !== initialData.clinicName ||
      currentData.username !== initialData.username ||
      currentData.email !== initialData.email ||
      currentData.phoneNumber !== initialData.phoneNo ||
      currentData.address !== initialData.address ||
      currentData.password !== initialData.password ||
      currentData.onlineStatus !== initialData.onlineStatus ||
      currentData.avatar !== initialData.avatar ||
      JSON.stringify(currentData.languagesSpoken) !== JSON.stringify(initialData.languagesSpoken) ||
      JSON.stringify(currentData.deliveryMethods) !== JSON.stringify(initialData.deliveryMethods)

    return hasChangesDetected
  }

  const handleSave = () => {
    if (!hasChanges()) {
      setMessage("No changes detected.")
      return
    }

    const formData = new FormData()

    if (selectedFile) {
      formData.append("avatar", selectedFile)
    }

    formData.append("clinicName", formDataState.clinicName)
    formData.append("username", formDataState.username)
    formData.append("phoneNo", formDataState.phoneNumber)
    formData.append("email", formDataState.email)
    formData.append("street", formDataState.address)
    formData.append("onlineStatus", formDataState.onlineStatus)

    if (formDataState.coordinates?.latitude && formDataState.coordinates?.longitude) {
      formData.append("coordinates", JSON.stringify(formDataState.coordinates))
    }

    if (formDataState.bio) {
      formData.append("bio", formDataState.bio)
    }

    if (formDataState.password) {
      formData.append("password", formDataState.password)
    }

    const languagesArray = formDataState.languagesSpoken.map((lang) => lang.toLowerCase())
    formData.append("languages", JSON.stringify(languagesArray))

    const deliveryMethodsArray = []
    if (formDataState.deliveryMethods.home) deliveryMethodsArray.push(0)
    if (formDataState.deliveryMethods.inPerson) deliveryMethodsArray.push(1)
    if (formDataState.deliveryMethods.online) deliveryMethodsArray.push(2)
    formData.append("deliveryMethods", JSON.stringify(deliveryMethodsArray))

    updateClinicProfile(formData, {
      onSuccess: (response) => {
        console.log("[v0] Profile update successful:", response)
        setMessage("Profile updated successfully!")
        initialFormData.current = formDataState
      },
      onError: (error) => {
        console.log("[v0] Profile update error:", error)
        console.log("[v0] Error response data:", error?.response?.data)
        setMessage(error?.response?.data?.message || "Failed to update clinic profile.")
      },
    })
  }

  const handleStatusClick = (event) => setAnchorEl(event.currentTarget)
  const handleStatusClose = (newStatus) => {
    if (newStatus) {
      setFormDataState((prev) => ({
        ...prev,
        onlineStatus: newStatus.toLowerCase(),
      }))
    }
    setAnchorEl(null)
  }

  const handleOpenCertificateModal = () => setOpenCertificateModal(true)
  const handleCloseCertificateModal = () => setOpenCertificateModal(false)

  const getCurrentLocation = async () => {
    setLocationLoading(true)
    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by your browser")
      }

      // Get current position
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        })
      })

      // Initialize Google Maps API
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
        libraries: ["places"],
      })

      const google = await loader.load()
      const geocoder = new google.maps.Geocoder()

      // Reverse geocode the coordinates
      const response = await geocoder.geocode({
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
      })

      if (response.results.length > 0) {
        const address = response.results[0]
        const components = address.address_components.reduce((acc, component) => {
          component.types.forEach((type) => {
            acc[type] = component.long_name
          })
          return acc
        }, {})

        setFormDataState((prev) => ({
          ...prev,
          address: address.formatted_address,
          stateOrProvince: components.administrative_area_level_1 || "",
          cityOrDistrict: components.locality || components.administrative_area_level_2 || "",
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        }))
        setMessage("Location successfully detected!")
      }
    } catch (error) {
      console.log(error)

      let errorMessage = "Failed to get location. Please enter manually."
      if (error?.code === 1) {
        errorMessage = "Location permission denied. Please allow location access in your browser settings."
      } else if (error?.code === 2) {
        errorMessage = "Location unavailable. Please check your internet or try again."
      } else if (error?.code === 3) {
        errorMessage = "Location request timed out. Please try again."
      } else if (error?.message) {
        errorMessage = `Error: ${error.message}`
      }
      setMessage(errorMessage)
    } finally {
      setLocationLoading(false)
    }
  }

  return (
    <>
      <Box sx={{ p: 3, borderRadius: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
          <Stack spacing={0.5} sx={{ flex: 1 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={avatarUrl || "/assets/profile.png"}
                  sx={{ width: 90, height: 90, border: "3px solid #ddd" }}
                />
                <IconButton
                  component="label"
                  sx={{ position: "absolute", bottom: 0, right: 0, bgcolor: "white", boxShadow: 2 }}
                >
                  <CameraAltIcon fontSize="small" />
                  <input type="file" ref={fileInputRef} accept="image/*" hidden onChange={handleAvatarChange} />
                </IconButton>
              </Box>

              <Stack direction="row" spacing={1} alignItems="center">
                <Button variant="outlined" size="small" onClick={triggerFileSelect}>
                  Change picture
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<CloudUploadIcon />}
                  onClick={handleOpenCertificateModal}
                  disabled={clinic?.certificateStatus === "approved"}
                >
                  Upload Certificate
                </Button>

                <Button
                  variant="contained"
                  onClick={handleStatusClick}
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    bgcolor: formDataState.onlineStatus === "online" ? "#00AC4F" : "gray",
                    color: "white",
                  }}
                >
                  {formDataState.onlineStatus === "online" ? "Online" : "Offline"}
                </Button>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleStatusClose(null)}>
                  <MenuItem onClick={() => handleStatusClose("online")}>
                    <Box sx={{ width: 10, height: 10, bgcolor: "green", borderRadius: "50%", mr: 1 }} />
                    Online
                  </MenuItem>
                  <MenuItem onClick={() => handleStatusClose("offline")}>
                    <Box sx={{ width: 10, height: 10, bgcolor: "red", borderRadius: "50%", mr: 1 }} />
                    Offline
                  </MenuItem>
                </Menu>
              </Stack>
            </Stack>

            <Typography variant="caption" color="text.secondary" sx={{ textAlign: "left", ml: "145px", mt: 0.5 }}>
              Please upload your official certificate of operation for verification and approval.
            </Typography>
          </Stack>
        </Stack>

        {/* 👇 Include Modal Component at the bottom */}
        <UploadCertificateModal open={openCertificateModal} handleClose={handleCloseCertificateModal} />

        <Stack spacing={2}>
          <TextField
            label="Clinic Name"
            name="clinicName"
            fullWidth
            value={formDataState.clinicName}
            onChange={handleChange}
            inputProps={{ maxLength: 100 }}
          />

          <TextField
            label="Username"
            name="username"
            fullWidth
            value={formDataState.username}
            onChange={handleChange}
            inputProps={{ maxLength: 50 }}
            placeholder="e.g., med_plus"
          />

          <TextField
            label="Email"
            name="email"
            fullWidth
            value={formDataState.email}
            onChange={handleChange}
            disabled
            InputProps={{
              startAdornment: <MailOutlineIcon sx={{ mr: 1, color: "gray" }} />,
            }}
          />

          <TextField
            label="Phone Number"
            name="phoneNumber"
            fullWidth
            value={formDataState.phoneNumber}
            onChange={handleChange}
            InputProps={{ startAdornment: <PhoneAndroidIcon sx={{ mr: 1, color: "gray" }} /> }}
          />

          <TextField
            label="Country"
            fullWidth
            value={capitalizeFirstLetter(formDataState.country)}
            disabled
            variant="outlined"
          />
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: -1.5, mb: 1 }}>
            To change your country, please send a message to{" "}
            <Link href={`mailto:${LOCATION_CHANGE_EMAIL}`} sx={{ fontWeight: 600 }}>
              {LOCATION_CHANGE_EMAIL}
            </Link>
          </Typography>

          <TextField
            label="State/Province"
            fullWidth
            value={capitalizeFirstLetter(formDataState.stateOrProvince)}
            disabled
            variant="outlined"
          />
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: -1.5, mb: 1 }}>
            To change your state/province, please send a message to{" "}
            <Link href={`mailto:${LOCATION_CHANGE_EMAIL}`} sx={{ fontWeight: 600 }}>
              {LOCATION_CHANGE_EMAIL}
            </Link>
          </Typography>

          <TextField
            label="City"
            fullWidth
            value={capitalizeFirstLetter(formDataState.cityOrDistrict)}
            disabled
            variant="outlined"
          />
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: -1.5, mb: 1 }}>
            To change your city, please send a message to{" "}
            <Link href={`mailto:${LOCATION_CHANGE_EMAIL}`} sx={{ fontWeight: 600 }}>
              {LOCATION_CHANGE_EMAIL}
            </Link>
          </Typography>

          <Box>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formDataState.address}
              onChange={(e) =>
                setFormDataState((prev) => ({
                  ...prev,
                  address: e.target.value,
                }))
              }
              margin="normal"
              variant="outlined"
              required
            />

            <Button
              variant="contained"
              color="primary"
              onClick={getCurrentLocation}
              disabled={locationLoading}
              startIcon={locationLoading ? <CircularProgress size={24} /> : <LocationOnIcon />}
              sx={{ mt: 2 }}
            >
              {locationLoading ? "Getting Location..." : "Use Current Location"}
            </Button>

            <Box>
              <TextField
                label="Bio"
                name="bio"
                fullWidth
                multiline
                minRows={3}
                value={formDataState.bio}
                onChange={handleChange}
                inputProps={{ maxLength: 1000 }}
                margin="normal"
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                {formDataState.bio.length} / 1000 characters
              </Typography>

              {(() => {
                const links = extractLinks(formDataState.bio)
                return (
                  links.length > 0 && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: "#333" }}>
                        Links found:
                      </Typography>
                      <Stack spacing={0.5}>
                        {links.map((url, i) => (
                          <Link
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              display: "block",
                              color: "#1E88E5",
                              textDecoration: "none",
                              fontSize: "0.875rem",
                              wordBreak: "break-all",
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                          >
                            {url}
                          </Link>
                        ))}
                      </Stack>
                    </Box>
                  )
                )
              })()}
            </Box>
          </Box>

          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            value={formDataState.password}
            onChange={handleChange}
            InputProps={{ startAdornment: <LockOutlinedIcon sx={{ mr: 1, color: "gray" }} /> }}
          />
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body1" sx={{ fontWeight: "bold", mb: 2 }}>
          Delivery Methods
        </Typography>
        <Stack direction="row" spacing={3} sx={{ mb: 3, justifyContent: "space-between" }}>
          {DELIVERY_METHODS.map((method) => {
            const IconComponent = method.icon
            const isSelected = formDataState.deliveryMethods[method.id]
            return (
              <Box
                key={method.id}
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => handleDeliveryMethodChange(method.id)}
              >
                <Box
                  sx={{
                    width: "100%",
                    border: "1px solid #E0E0E0",
                    borderRadius: "12px",
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    bgcolor: "#FAFAFA",
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "#F5F5F5",
                    },
                  }}
                >
                  <IconComponent sx={{ fontSize: 60, color: "#FFA500", mb: 2 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500, textAlign: "center", color: "#666" }}>
                    {method.label}
                  </Typography>
                </Box>
                <Box sx={{ mt: 1.5 }}>
                  {isSelected ? (
                    <CheckCircleIcon sx={{ fontSize: 28, color: "#00AC4F" }} />
                  ) : (
                    <RadioButtonUncheckedIcon sx={{ fontSize: 28, color: "#E0E0E0" }} />
                  )}
                </Box>
              </Box>
            )
          })}
        </Stack>

        <Alert
          severity="info"
          sx={{
            mb: 3,
            borderRadius: "12px",
            bgcolor: "#E3F2FD",
            "& .MuiAlert-icon": {
              color: "#1976D2",
            },
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            <strong>Expand Your Reach:</strong> Consider enabling Online Session delivery to serve clients across
            different cities and countries. This enhances your clinic's visibility, accessibility, and patronage
            globally.
          </Typography>
        </Alert>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body1" sx={{ fontWeight: "bold", mb: 2 }}>
          Languages Spoken
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Select
            multiple
            displayEmpty
            value={formDataState.languagesSpoken}
            onChange={(e) => {
              const newLanguages = e.target.value
              setFormDataState((prev) => ({
                ...prev,
                languagesSpoken: newLanguages,
              }))
              if (typeof window !== "undefined") {
                localStorage.setItem(STORAGE_KEYS.LANGUAGES_SPOKEN, JSON.stringify(newLanguages))
              }
            }}
            input={<OutlinedInput />}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <Typography color="text.secondary">Choose languages</Typography>
              }
              return null
            }}
            sx={{
              borderRadius: "12px",
              "& .MuiSelect-select": {
                py: 1.5,
              },
            }}
          >
            {AVAILABLE_LANGUAGES.map((language) => (
              <MenuItem key={language} value={language}>
                <Checkbox checked={formDataState.languagesSpoken.indexOf(language) > -1} />
                <Typography>{language}</Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Language Tags */}
        {formDataState.languagesSpoken.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: "wrap", gap: 1 }}>
            {formDataState.languagesSpoken.map((language) => (
              <Chip
                key={language}
                label={language}
                onDelete={() => handleRemoveLanguage(language)}
                deleteIcon={<CloseIcon />}
                sx={{
                  bgcolor: "#F5F5F5",
                  "& .MuiChip-deleteIcon": {
                    color: "#666",
                    "&:hover": {
                      color: "#000",
                    },
                  },
                }}
              />
            ))}
          </Stack>
        )}

        <Button
          variant="contained"
          color="success"
          fullWidth
          sx={{ py: 1.5, mt: 3, borderRadius: "10px", fontWeight: "bold", fontSize: 16 }}
          onClick={handleSave}
          disabled={isPending}
        >
          {isPending ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Save"}
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
    </>
  )
}
