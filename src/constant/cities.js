export const rwandaCities = [
  "Kigali",
  "Butare",
  "Gitarama",
  "Ruhengeri",
  "Gisenyi",
  "Byumba",
  "Cyangugu",
  "Kibuye",
  "Rwamagana",
  "Kibungo",
  "Muhanga",
  "Nyanza",
  "Bugarama",
  "Kayonza",
  "Nyamata",
  "Ruhango",
  "Gikongoro",
  "Nyagatare",
  "Busogo",
  "Rubengera",
  "Gicumbi",
  "Kamembe",
  "Huye",
]

export const genericRegions = [
  "North Africa",
  "West Africa",
  "East Africa",
  "Southern Africa",
  "North America",
  "South America",
  "Europe",
  "Middle East",
  "Asia",
  "Britain",
]

export const locations = [...rwandaCities, ...genericRegions]

export const getLocationsByCountry = (country) => country === "Rwanda" ? rwandaCities : genericRegions
