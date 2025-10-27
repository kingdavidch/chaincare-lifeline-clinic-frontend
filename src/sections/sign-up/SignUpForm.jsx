"use client"

/* eslint-disable */
import { Link } from "react-router-dom"

import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import {
  Box,
  Card,
  Alert,
  Button,
  Checkbox,
  Snackbar,
  TextField,
  CardHeader,
  IconButton,
  Typography,
  CardContent,
  InputAdornment,
  CircularProgress,
  FormControlLabel,
} from "@mui/material"

import { useEffect, useState } from "react"
import { useSignUpForm } from "src/hooks/useSignUpForm"
import { CountrySelect, StateSelect, CitySelect } from "react-country-state-city"
import "react-country-state-city/dist/react-country-state-city.css"

export function SignUpForm() {
  const {
    showPassword,
    setShowPassword,
    loading,
    message,
    formData,
    setFormData,
    errors,
    handleChange,
    handleAddressChange,
    handleSubmit,
    setMessage,
  } = useSignUpForm()

  const [countryid, setCountryid] = useState(0)
  const [stateid, setStateid] = useState(0)

  useEffect(() => {
    // Country, state, and city will be empty until user selects them
  }, [])

  return (
    <Box sx={{ width: "100%", maxWidth: 400 }}>
      <Card sx={{ width: "100%", maxWidth: 400, p: 3, borderRadius: 3, boxShadow: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <img src="/assets/lifeline_logos-4.png" width={200} alt="logo" style={{ marginBottom: "20px" }} />
        </Box>

        <CardHeader title="Sign Up" titleTypographyProps={{ variant: "h5" }} subheader="Create your clinic account" />
        <CardContent>
          <form onSubmit={(e) => handleSubmit(e)} noValidate>
            <TextField
              label="Clinic Name"
              variant="outlined"
              fullWidth
              margin="normal"
              name="clinicName"
              required
              value={formData.clinicName}
              onChange={handleChange}
              error={!!errors.clinicName}
              helperText={errors.clinicName}
              inputProps={{ maxLength: 100 }}
            />

            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              name="email"
              required
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />

            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              margin="normal"
              name="phoneNo"
              required
              value={formData.phoneNo}
              onChange={handleChange}
              error={!!errors.phoneNo}
              helperText={errors.phoneNo}
            />

            <Box sx={{ my: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Country <span style={{ color: "red" }}>*</span>
              </Typography>
              <CountrySelect
                style={{ border: "none", outline: "none", height: "40px" }}
                containerClassName="form-group"
                inputClassName="form-control"
                onChange={(e) => {
                  setCountryid(e.id)
                  setFormData((prev) => ({
                    ...prev,
                    country: e.name,
                    stateOrProvince: "",
                    cityOrDistrict: "",
                    street: "",
                    postalCode: "",
                  }))
                  setStateid(0)
                }}
                placeHolder="Select Country"
              />
              {errors.country && (
                <Typography variant="caption" sx={{ color: "red", display: "block", mt: 0.5 }}>
                  {errors.country}
                </Typography>
              )}
            </Box>

            <Box sx={{ my: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                State
              </Typography>
              <StateSelect
                style={{ border: "none", outline: "none", height: "40px" }}
                containerClassName="form-group"
                inputClassName="form-control"
                countryid={countryid}
                onChange={(e) => {
                  setStateid(e.id)
                  setFormData((prev) => ({
                    ...prev,
                    stateOrProvince: e.name,
                    cityOrDistrict: "",
                  }))
                }}
                placeHolder="Select State"
              />
            </Box>

            <Box sx={{ my: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                City
              </Typography>
              <CitySelect
                style={{ border: "none", outline: "none", height: "40px" }}
                containerClassName="form-group"
                inputClassName="form-control"
                countryid={countryid}
                stateid={stateid}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    cityOrDistrict: e.name,
                  }))
                }}
                placeHolder="Select City"
              />
            </Box>

            <TextField
              label="Street Address"
              variant="outlined"
              fullWidth
              margin="normal"
              name="street"
              required
              value={formData.street}
              onChange={handleChange}
              error={!!errors.street}
              helperText={errors.street}
              placeholder="e.g., 45 KN 5 Rd"
            />

            <TextField
              label="Postal Code"
              variant="outlined"
              fullWidth
              margin="normal"
              name="postalCode"
              required
              value={formData.postalCode}
              onChange={handleChange}
              error={!!errors.postalCode}
              helperText={errors.postalCode}
              placeholder="e.g., 00250"
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              required
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              required
              margin="normal"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />

            <FormControlLabel
              control={
                <Checkbox name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange} required />
              }
              label={
                <span style={{ cursor: "default" }}>
                  Agree to our{" "}
                  <span
                    role="link"
                    tabIndex={0}
                    style={{ color: "#1976d0", textDecoration: "underline", cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open("https://www.privacypolicies.com/live/f5d723d2-09ee-420b-a76b-59a2a72c3c9d", "_blank")
                    }}
                  >
                    Terms and Policies
                  </span>
                </span>
              }
              sx={{ marginY: 1 }}
            />

            {errors.termsAccepted && (
              <Typography color="error" variant="caption" display="block" gutterBottom>
                {errors.termsAccepted}
              </Typography>
            )}

            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ paddingY: 1.2, marginTop: 2, backgroundColor: "#00AC4F" }}
              type="submit"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Sign Up"}
            </Button>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2">
                Already have an account?{" "}
                <Link to="/login" style={{ textDecoration: "none", color: "#00AC4F" }}>
                  Log In
                </Link>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>

      <Snackbar open={!!message} autoHideDuration={3000} onClose={() => setMessage(null)}>
        <Alert onClose={() => setMessage(null)} severity="info" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
