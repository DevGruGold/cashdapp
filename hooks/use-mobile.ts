"use client"

import { useState, useEffect } from "react"

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Function to check if the device is mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera

      // Check if userAgent contains mobile-specific keywords
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i

      // Also check screen width for responsive design
      const isMobileWidth = window.innerWidth <= 768

      setIsMobile(mobileRegex.test(userAgent) || isMobileWidth)
    }

    // Check on initial load
    checkMobile()

    // Check on window resize
    window.addEventListener("resize", checkMobile)

    // Clean up event listener
    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  return isMobile
}
