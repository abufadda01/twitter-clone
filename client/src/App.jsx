import { Route, Routes } from "react-router-dom";
import Register from "./pages/auth/register/Register";
import Login from "./pages/auth/login/Login";
import Home from "./pages/home/Home";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/notifications/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";


function App() {

	return (

		<div className='flex max-w-6xl mx-auto'>

      <Sidebar/>

			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/register' element={<Register />} />
				<Route path='/login' element={<Login />} />
				<Route path='/notifications' element={<NotificationPage  />} />
				<Route path='/profile/:username' element={<ProfilePage  />} />
			</Routes>

      <RightPanel/>

		</div>
	);
}


export default App