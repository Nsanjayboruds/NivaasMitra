
export const filterProperties = (properties, filters) => {
  return properties.filter((property) => {
    
    if (filters.type && filters.type !== "all" && property.type !== filters.type) {
      return false
    }

    
    if (filters.priceRange && filters.priceRange !== "all") {
      const price = Number.parseInt(property.price.replace(/[₹,]/g, ""))
      switch (filters.priceRange) {
        case "under-500k":
          if (price >= 500000) return false
          break
        case "500k-1m":
          if (price < 500000 || price >= 1000000) return false
          break
        case "over-1m":
          if (price < 1000000) return false
          break
      }
    }

    
    if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false
    }

    
    if (filters.bedrooms && property.bedrooms < filters.bedrooms) {
      return false
    }

    
    if (filters.bathrooms && property.bathrooms < filters.bathrooms) {
      return false
    }

    return true
  })
}


export const sortProperties = (properties, sortBy) => {
  const sorted = [...properties]

  switch (sortBy) {
    case "price-low":
      return sorted.sort((a, b) => {
        const priceA = Number.parseInt(a.price.replace(/[₹,]/g, ""))
        const priceB = Number.parseInt(b.price.replace(/[₹,]/g, ""))
        return priceA - priceB
      })
    case "price-high":
      return sorted.sort((a, b) => {
        const priceA = Number.parseInt(a.price.replace(/[₹,]/g, ""))
        const priceB = Number.parseInt(b.price.replace(/[₹,]/g, ""))
        return priceB - priceA
      })
    case "newest":
      return sorted.sort((a, b) => (b.yearBuilt || 0) - (a.yearBuilt || 0))
    case "oldest":
      return sorted.sort((a, b) => (a.yearBuilt || 0) - (b.yearBuilt || 0))
    case "bedrooms":
      return sorted.sort((a, b) => b.bedrooms - a.bedrooms)
    case "area":
      return sorted.sort((a, b) => {
        const areaA = Number.parseInt(a.area.replace(/[^0-9]/g, ""))
        const areaB = Number.parseInt(b.area.replace(/[^0-9]/g, ""))
        return areaB - areaA
      })
    default:
      return sorted
  }
}


export const searchProperties = (properties, searchTerm) => {
  if (!searchTerm.trim()) return properties

  const term = searchTerm.toLowerCase()
  return properties.filter((property) => {
    return (
      property.title.toLowerCase().includes(term) ||
      property.location.toLowerCase().includes(term) ||
      property.type.toLowerCase().includes(term) ||
      property.description?.toLowerCase().includes(term) ||
      property.amenities?.some((amenity) => amenity.toLowerCase().includes(term))
    )
  })
}


export const formatPrice = (price) => {
  const numPrice = typeof price === "string" ? Number.parseInt(price.replace(/[₹,]/g, "")) : price

  if (numPrice >= 10000000) {
    return `₹${(numPrice / 10000000).toFixed(1)}Cr`
  } else if (numPrice >= 100000) {
    return `₹${(numPrice / 100000).toFixed(0)}L`
  } else {
    return `₹${numPrice.toLocaleString()}`
  }
}


export const calculateMortgage = (principal, annualRate, years, downPayment = 0) => {
  const loanAmount = principal - downPayment
  const monthlyRate = annualRate / 100 / 12
  const numberOfPayments = years * 12

  const monthlyPayment =
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

  const totalPayment = monthlyPayment * numberOfPayments
  const totalInterest = totalPayment - loanAmount

  return {
    monthlyPayment: Math.round(monthlyPayment),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    loanAmount,
  }
}
