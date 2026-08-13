import './App.css'
import { Outlet} from 'react-router-dom'
import Navbar from './components/navigation/Navbar.tsx'
import Footer from './components/navigation/Footer.tsx'

function App() {

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default App
