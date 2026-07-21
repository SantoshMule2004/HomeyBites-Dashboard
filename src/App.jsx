import './styles/App.css'
import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div className='app'>
      <ToastContainer position='top-center' className="custom-toast-container" />
      <AppRoutes />
    </div>
  )
}

export default App