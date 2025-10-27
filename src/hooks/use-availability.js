import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { getAvailability, setAvailability, deleteAvailability } from "src/api/api"

export const useGetAvailability = () =>
  useQuery({
    queryKey: ["availability"],
    queryFn: async () => {
      const data = await getAvailability()
      console.log("[v0] Raw API response:", data)

      const transformed = data.map((item) => ({
        day: item.day.charAt(0).toUpperCase() + item.day.slice(1),
        isClosed: item.isClosed,
        slots: item.timeRanges.map((range, idx) => ({
          id: `${item.day}-${idx}`,
          openHour: `${String(range.openHour).padStart(2, "0")}:00`,
          closeHour: `${String(range.closeHour).padStart(2, "0")}:00`,
          isClosed: item.isClosed,
        })),
      }))

      console.log("[v0] Transformed availability:", transformed)
      return transformed
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 30000,
    onError: (error) => {
      console.error("[v0] Get availability error:", error.response?.data || error.message)
      throw error
    },
  })

export const useSetAvailability = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (availabilityData) => {
      console.log("[v0] Sending availability data:", availabilityData)
      const result = await setAvailability(availabilityData)
      return result
    },
    onSuccess: (data) => {
      console.log("[v0] Availability set successfully:", data)
      queryClient.invalidateQueries({ queryKey: ["availability"] })
    },
    onError: (error) => {
      console.error("[v0] Availability mutation error:", error.response?.data || error.message)
      throw error
    },
  })
}

export const useDeleteAvailability = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (day) => {
      console.log("[v0] Deleting availability for day:", day)
      const result = await deleteAvailability(day)
      return result
    },
    onSuccess: (data) => {
      console.log("[v0] Availability deleted successfully:", data)
      queryClient.invalidateQueries({ queryKey: ["availability"] })
    },
    onError: (error) => {
      console.error("[v0] Delete availability error:", error.response?.data || error.message)
      throw error
    },
  })
}
