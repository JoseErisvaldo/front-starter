import { useRoutes } from 'react-router-dom'
import { appRoutes } from './routes/app.routes'

export function App() {
  return useRoutes(appRoutes)
}
