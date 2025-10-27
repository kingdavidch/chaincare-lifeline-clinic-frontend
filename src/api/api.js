import api from "./axiosConfig"

// Fetch clinic details
export const getClinicDetails = async () => {
  const response = await api.get("/clinic/me")
  return response.data.data
}

// Fetch earnings
export const getEarnings = async () => {
  const response = await api.get("/clinic/earnings")
  return response.data.data
}

// Fetch test distribution
export const getTestDistribution = async () => {
  const response = await api.get("/clinic/test-distribution")
  return response.data.data
}

// Fetch popular tests
export const getPopularTests = async () => {
  const response = await api.get("/clinic/popular-tests")
  return response.data.data
}

// Fetch test sales with filter
export const getTestSales = async (filterType = "monthly") => {
  const response = await api.get(`/clinic/test-sales?filter=${filterType}`)
  return response.data.data
}

// Fetch earnings overview
export const getEarningsOverview = async (filterType = "monthly") => {
  const response = await api.get(`/clinic/earnings-overview?filter=${filterType}`)
  return response.data.data
}

// Fetch all availability
export const getAvailability = async () => {
  const response = await api.get("/availability/")
  return response.data.data || []
}

// Set availability for a specific day
export const setAvailability = async (availabilityData) => {
  const { day, slots, isClosed } = availabilityData

  const timeRanges = slots.map((slot) => ({
    openHour: Number.parseInt(slot.openHour.split(":")[0], 10),
    closeHour: Number.parseInt(slot.closeHour.split(":")[0], 10),
  }))

  const payload = {
    day: day.toLowerCase(),
    timeRanges,
    isClosed,
  }

  const response = await api.post("/availability/set", payload)
  return response.data.data
}

export const deleteAvailability = async (day) => {
  const response = await api.delete("/availability/delete", {
    data: {
      day: day.toLowerCase(),
    },
  })
  return response.data.data
}
