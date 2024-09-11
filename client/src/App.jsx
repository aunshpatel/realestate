import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';
import MyListing from './pages/MyListing';
import DeleteProfileInstructions from './pages/DeleteProfileInstructions';
import MobileAppPrivacyPolicy from './pages/MobileAppPrivacyPolicy';
import ContactUs from './pages/ContactUs';

export default function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/about" element={<About />} />
        <Route path="/listing/:listingId" element={<Listing />} />
        <Route path="/delete-profile-instructions" element={<DeleteProfileInstructions />} />
        <Route path="/mobileapp-privacy-policy" element={<MobileAppPrivacyPolicy />} />
        <Route path="/all-listings" element={<Search />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route path='/update-listing/:listingID' element={<UpdateListing />} />
          <Route path='/my-listing' element={<MyListing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}