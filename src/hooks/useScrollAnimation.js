"use client"

import { useEffect, useRef, useState } from "react"


export const useScrollAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    const currentElement = elementRef.current
    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
    }
  }, [threshold])

  return [elementRef, isVisible]
}


export const useCounterAnimation = (targetValue, duration = 2000) => {
  const [count, setCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const startAnimation = () => {
    if (isAnimating) return

    setIsAnimating(true)
    const steps = 50
    const stepDuration = duration / steps
    const increment = targetValue / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= targetValue) {
        current = targetValue
        clearInterval(timer)
        setIsAnimating(false)
      }
      setCount(Math.floor(current))
    }, stepDuration)
  }

  return [count, startAnimation, isAnimating]
}


export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [isValid, setIsValid] = useState(false)

  const validateField = (name, value) => {
    const rules = validationRules[name]
    if (!rules) return ""

    for (const rule of rules) {
      if (rule.required && (!value || value.trim() === "")) {
        return rule.message || `${name} is required`
      }
      if (rule.pattern && !rule.pattern.test(value)) {
        return rule.message || `${name} is invalid`
      }
      if (rule.minLength && value.length < rule.minLength) {
        return rule.message || `${name} must be at least ${rule.minLength} characters`
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        return rule.message || `${name} must be no more than ${rule.maxLength} characters`
      }
    }
    return ""
  }

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }))

    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const validateAll = () => {
    const newErrors = {}
    let formIsValid = true

    Object.keys(validationRules).forEach((field) => {
      const error = validateField(field, values[field])
      newErrors[field] = error
      if (error) formIsValid = false
    })

    setErrors(newErrors)
    setIsValid(formIsValid)
    return formIsValid
  }

  const reset = () => {
    setValues(initialValues)
    setErrors({})
    setIsValid(false)
  }

  return {
    values,
    errors,
    isValid,
    handleChange,
    validateAll,
    reset,
  }
}


export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue]
}


export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}


export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return windowSize
}


export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition(window.pageYOffset)
    }

    window.addEventListener("scroll", updatePosition)
    updatePosition()

    return () => window.removeEventListener("scroll", updatePosition)
  }, [])

  return scrollPosition
}
