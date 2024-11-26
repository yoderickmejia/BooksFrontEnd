import DashboardLayoutAccountSidebar from './assets/Pages/Home';
import Login from './assets/Pages/Login';
import Book from './assets/Pages/Book';
import SignUp from './assets/Pages/SignUp';
import EditBook from './assets/components/editBook';  

import './App.css';
import { BrowserRouter , Routes, Route } from 'react-router-dom';
function App() {
  return (
  
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/book/:id" element={<Book  />} />
    <Route path="/home" element={<DashboardLayoutAccountSidebar />} />
    <Route path="/edit/:id" element={<EditBook />} />
   
    
  </Routes>
  </BrowserRouter>


    
  )
}

export default App