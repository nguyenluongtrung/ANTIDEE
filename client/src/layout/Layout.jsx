import { Footer, Header } from '../components'
import { ToastContainer } from 'react-toastify'
import { Outlet } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'

export const Layout = () => {
  return (
    <div>
        <Header />
        <Outlet />
        <Footer />
        <ToastContainer />
    </div>
  )
}
