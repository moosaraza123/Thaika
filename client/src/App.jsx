import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/Signin.jsx';
import SignUp from './pages/Signup';
import About from './pages/About';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header.jsx';
import Predict_Lahore from './pages/Predict_Lahore.jsx';
import CreateListing from './pages/CreateListing.jsx';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing.jsx';
import Search from './pages/Search.jsx';
import Cities from './pages/Cities.jsx';
import Predict_Karachi from './pages/Predict_Karachi.jsx';
export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/search' element={<Search />} />
        <Route path='/about' element={<About />} />
        <Route path='/cities' element={<Cities />} />
        <Route path='/predict_lahore' element={<Predict_Lahore />} />
        <Route path='/predict_karachi' element={<Predict_Karachi />} />
      


        <Route path='/listing/:listingId' element={<Listing />} />
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route
            path='/update-listing/:listingId'
            element={<UpdateListing />}
          />
        </Route>

      

       
      </Routes>
    </BrowserRouter>
  );
}