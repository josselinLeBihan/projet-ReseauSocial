import React, { useEffect } from "react"
import App from "./App"

const ErrorComponent = ({ errorMessage }) => (
  <div className="text-red-500 font-bold text-center">{errorMessage}</div>
)

function AppContainer() {
  const location = useLocation()
  const [store, setStore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // check le status du serveur
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        await axios.get("/server-status")
      } catch (err) {
        setError("Server is down. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    checkServerStatus()
  }, [])

  // initialisation du store redux, inclu le data fetching et l'authentification
  //pendant le chargement de la page s'assure que le store est initialisé avec les données nécessaires avant de rendre l'application
  useEffect(() => {
    const initializeStore = async () => {
      try {
        const appStore = await createAppStore()
        setStore(appStore)
      } catch (err) {
        setError(`Error initializing the app: ${err.message}`)
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
        <title>{getTitleFromRoute(location.pathname)}</title>
      </Helmet>
      <App />
    </Provider>
  )
}

export default AppContainer
