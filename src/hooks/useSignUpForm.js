"use client"

import { useRef, useState, useEffect, useCallback } from "react"

import api from "src/api/axiosConfig"
import { countries } from "src/constant/countries.config"

export function useSignUpForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState("")
  const [currentCountryConfig, setCurrentCountryConfig] = useState(null)
  const autocompleteRef = useRef(null)

  const [formData, setFormData] = useState({
    clinicName: "",
    email: "",
    phoneNo: "",
    country: "",
    stateOrProvince: "",
    cityOrDistrict: "",
    street: "",
    postalCode: "",
    coordinates: { latitude: null, longitude: null },
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  })

  const [errors, setErrors] = useState({
    clinicName: "",
    email: "",
    phoneNo: "",
    country: "",
    stateOrProvince: "",
    cityOrDistrict: "",
    street: "",
    password: "",
    confirmPassword: "",
    termsAccepted: "",
  })

  useEffect(() => {
    if (formData.country) {
      const config = countries.find((c) => c.label === formData.country)
      setCurrentCountryConfig(config)
    }
  }, [formData.country])

  const validateField = useCallback(
    (name, value) => {
      let error = ""

      if (currentCountryConfig) {
        const isAddressField = ["stateOrProvince", "cityOrDistrict", "street"].includes(name)

        if (isAddressField && !currentCountryConfig.requiredFields.includes(name)) {
          return ""
        }
      }

      switch (name) {
        case "clinicName":
          if (!value.trim()) error = "Clinic name is required"
          break
        case "email":
          if (!value.trim()) {
            error = "Email is required"
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            error = "Please enter a valid email"
          }
          break
        case "phoneNo":
          if (!value.trim()) error = "Phone number is required"
          break
        case "country":
          if (!value) error = "Country is required"
          break
        case "stateOrProvince":
          if (!value.trim())
            error = `${currentCountryConfig?.fieldLabels?.stateOrProvince || "State/Province"} is required`
          break
        case "cityOrDistrict":
          if (!value.trim())
            error = `${currentCountryConfig?.fieldLabels?.cityOrDistrict || "City/District"} is required`
          break
        case "street":
          if (!value.trim()) error = "Street address is required"
          break
        case "password":
          if (!value.trim()) {
            error = "Password is required"
          } else if (value.length < 6) {
            error = "Password must be at least 6 characters"
          }
          break
        case "confirmPassword":
          if (!value.trim()) {
            error = "Please confirm your password"
          } else if (value !== formData.password) {
            error = "Passwords do not match"
          }
          break
        case "termsAccepted":
          if (!value) error = "You must accept the terms and policies"
          break
        default:
          break
      }
      return error
    },
    [formData.password, currentCountryConfig],
  )

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const fieldValue = type === "checkbox" ? checked : value

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }))

    if (name !== "termsAccepted") {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, fieldValue),
      }))
    }
  }

  const handleAddressChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }))
  }

  const handleCountryChange = (event, newValue) => {
    if (!newValue) return

    const countryValue = newValue.value || ""
    const countryLabel = newValue.label || ""

    localStorage.setItem("selectedCountry", countryLabel)

    setSelectedCountry(countryValue)
    setFormData((prev) => ({
      ...prev,
      country: countryLabel,
      stateOrProvince: "",
      cityOrDistrict: "",
      street: "",
      postalCode: "",
      coordinates: { latitude: null, longitude: null },
    }))

    setErrors((prev) => ({
      ...prev,
      country: validateField("country", countryLabel),
      stateOrProvince: "",
      cityOrDistrict: "",
      street: "",
    }))
  }

  const handlePlaceSelect = useCallback(
    (place) => {
      if (!place || !place.address_components || !currentCountryConfig) return

      const addressComponents = {}
      const coordinates = place.geometry?.location
        ? {
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
          }
        : { latitude: null, longitude: null }

      place.address_components.forEach((component) => {
        // Handle state/province/region fields
        if (component.types.includes("administrative_area_level_1")) {
          if (currentCountryConfig.fieldLabels.stateOrProvince) {
            addressComponents.stateOrProvince = component.long_name
          } else if (currentCountryConfig.fieldLabels.state) {
            addressComponents.stateOrProvince = component.long_name
          } else if (currentCountryConfig.fieldLabels.province) {
            addressComponents.stateOrProvince = component.long_name
          } else if (currentCountryConfig.fieldLabels.region) {
            addressComponents.stateOrProvince = component.long_name
          }
        }

        // Handle city/district fields
        if (component.types.includes("locality") || component.types.includes("administrative_area_level_2")) {
          if (currentCountryConfig.fieldLabels.cityOrDistrict) {
            addressComponents.cityOrDistrict = component.long_name
          } else if (currentCountryConfig.fieldLabels.city) {
            addressComponents.cityOrDistrict = component.long_name
          } else if (currentCountryConfig.fieldLabels.district) {
            addressComponents.cityOrDistrict = component.long_name
          }
        }

        // Handle street address
        if (component.types.includes("route")) {
          addressComponents.street = component.long_name
        }

        // Handle postal code
        if (component.types.includes("postal_code")) {
          addressComponents.postalCode = component.long_name
        }
      })

      setFormData((prev) => ({
        ...prev,
        ...addressComponents,
        coordinates,
      }))

      setErrors((prev) => ({
        ...prev,
        ...Object.keys(addressComponents).reduce((acc, key) => {
          acc[key] = validateField(key, addressComponents[key])
          return acc
        }, {}),
      }))
    },
    [currentCountryConfig, validateField],
  )

  useEffect(() => {
    const cleanupPrevious = () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event.clearInstanceListeners(autocompleteRef.current)
        autocompleteRef.current = null
      }
    }

    cleanupPrevious()

    if (!selectedCountry || !window.google?.maps?.places) {
      return undefined
    }

    const input = document.getElementById("address-input")
    if (!input) {
      return undefined
    }

    try {
      const newAutocomplete = new window.google.maps.places.Autocomplete(input, {
        componentRestrictions: { country: selectedCountry },
        fields: ["address_components", "geometry"],
        types: ["address"],
      })

      const placeChangedListener = newAutocomplete.addListener("place_changed", () => {
        const place = newAutocomplete.getPlace()
        handlePlaceSelect(place)
      })

      autocompleteRef.current = {
        instance: newAutocomplete,
        listener: placeChangedListener,
      }

      return () => {
        if (autocompleteRef.current) {
          window.google?.maps?.event.removeListener(autocompleteRef.current.listener)
          window.google?.maps?.event.clearInstanceListeners(autocompleteRef.current.instance)
          autocompleteRef.current = null
        }
        return undefined
      }
    } catch (error) {
      return undefined
    }
  }, [selectedCountry, handlePlaceSelect])

  const validateForm = () => {
    const newErrors = {
      clinicName: validateField("clinicName", formData.clinicName),
      email: validateField("email", formData.email),
      phoneNo: validateField("phoneNo", formData.phoneNo),
      country: validateField("country", formData.country),
      password: validateField("password", formData.password),
      confirmPassword: validateField("confirmPassword", formData.confirmPassword),
      termsAccepted: validateField("termsAccepted", formData.termsAccepted),
    }

    if (currentCountryConfig) {
      currentCountryConfig.requiredFields.forEach((field) => {
        newErrors[field] = validateField(field, formData[field])
      })
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error !== "")
  }

  const handleSubmit = async (e, navigate) => {
    e.preventDefault()

    if (!validateForm()) {
      const firstErrorField = Object.keys(errors).find((key) => errors[key])
      if (firstErrorField) {
        document.querySelector(`[name="${firstErrorField}"]`)?.focus()
      }
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const submissionData = {
        clinicName: formData.clinicName,
        email: formData.email,
        phoneNo: formData.phoneNo,
        stateOrProvince: formData.stateOrProvince,
        cityOrDistrict: formData.cityOrDistrict,
        street: formData.street,
        postalCode: formData.postalCode,
        coordinates: formData.coordinates,
        password: formData.password,
        termsAccepted: formData.termsAccepted,
        country: formData.country,
      }

      await api.post("/clinic/signup", submissionData)
      setMessage("Verify email to login")

      setTimeout(() => {
        navigate("/login")
      }, 2000)
    } catch (err) {
      setMessage(err?.response?.data?.message || "Sign-Up failed!")
    } finally {
      setLoading(false)
    }
  }

  return {
    showPassword,
    setShowPassword,
    loading,
    message,
    selectedCountry,
    currentCountryConfig,
    formData,
    setFormData,
    errors,
    handleChange,
    handleAddressChange,
    handleCountryChange,
    handleSubmit,
    validateField,
    setMessage,
  }
}
