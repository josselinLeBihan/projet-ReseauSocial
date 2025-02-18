import { useState, useEffect } from "react"

// This hook is used to check if the media query is matched or not
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query)

    const updateMatch = () => setMatches(mediaQueryList.matches)
    updateMatch()

    mediaQueryList.addEventListener("change", updateMatch)
    return () => mediaQueryList.removeEventListener("change", updateMatch)
  }, [query])

  return matches
}

export default useMediaQuery
