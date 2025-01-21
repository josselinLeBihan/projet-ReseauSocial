/**
 * Verifies if a token is valid basé sur sa date d'expiration.
 * @param {string} token - Le token à vérifier
 * @returns {boolean} - true si le token est valide, false sinon
 */
const isValidToken = (token) => {
  if (!token) {
    return false
  }

  const payload = token.split(".")[1]
  if (!payload) {
    return false
  }

  const decodedPayload = JSON.parse(window.atob(payload))

  const expiryTime = decodedPayload.exp * 1000
  const currentTime = Date.now()
  return expiryTime > currentTime
}

export { isValidToken }
