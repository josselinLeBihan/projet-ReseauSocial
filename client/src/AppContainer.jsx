import React, { useEffect, useState } from "react"
import App from "./App"
import CommonLoading from "./Components/Loader/CommonLoading"
import createAppStore from "./redux/store"
import axios from "axios"
import { Provider } from "react-redux"
import { Helmet } from "react-helmet"
import { logger } from "./utils/logger"

const ErrorComponent = ({ errorMessage }) => (
  <div className="text-red-500 font-bold text-center">{errorMessage}</div>
)

function AppContainer() {
  const [store, setStore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check le status du serveur
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        await axios.get("/server-status")
        logger.info("Statut du serveur vérifié avec succès")
      } catch (err) {
        setError(
          "Le serveur n'est pas disponible pour le moment. Veuillez réessayer plus tard. " +
            err.message,
        )
      } finally {
        setLoading(false)
      }
    }
    checkServerStatus()
  }, [])

  // Initialisation du store redux, inclu le data fetching et l'authentification
  // Pendant le chargement de la page s'assure que le store est initialisé avec les données nécessaires avant de rendre l'application
  useEffect(() => {
    const initializeStore = async () => {
      try {
        const appStore = await createAppStore()
        setStore(appStore)
        logger.info("Store initialisé avec succès")
      } catch (err) {
        setError(`Erreur lors de l'intialisation de App: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }
    initializeStore()
  }, [])

  if (loading || error) {
    return (
      <div className="flex items-center justify-center h-screen">
        {loading ? <CommonLoading /> : <ErrorComponent errorMessage={error} />}
      </div>
    )
  }

  return (
    <Provider store={store}>
      <Helmet>
        <title>My App</title>
      </Helmet>
      <App />
    </Provider>
  )
}

export default AppContainer
