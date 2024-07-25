import { Navigate, Route, Routes } from "react-router-dom";
import Register from "./pages/auth/register/Register";
import Login from "./pages/auth/login/Login";
import Home from "./pages/home/Home";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/notifications/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { Toaster } from "react-hot-toast";
import {useQuery} from "@tanstack/react-query"
import { axiosObj } from "./utils/axios/axiosObj";
import LoadingSpinner from "./components/common/LoadingSpinner";



function App() {

	const {data : authUser , isLoading} = useQuery({
		// we use queryKey to give a uinque name to our query to refers to it and use it later in any place
		// by this way : queryClient.invalidateQueries({queryKey : ["authUser"]})
		queryKey : ["authUser"] ,
		queryFn : async () => {
			try {
				const response = await axiosObj.get("/api/auth/getMe")
				if(response.status === 401) return null
				return response.data
			} catch (error) {
				console.log(error)
			}
		}
	})



	if(isLoading){
		return(
			<div className="h-full flex justify-center items-center">
				<LoadingSpinner size="lg"/>
			</div>
		)
	}




	return (

		<div className='flex max-w-6xl mx-auto'>

		{authUser && <Sidebar/>}

			<Routes>
				<Route path='/' element={authUser ? <Home /> : <Navigate to="/login"/>} />
				<Route path='/register' element={!authUser ? <Register /> : <Navigate to={"/"}/>} />
				<Route path='/login' element={!authUser ? <Login /> : <Navigate to="/"/>} />
				<Route path='/notifications' element={authUser ? <NotificationPage/> : <Navigate to={"/login"}/>} />
				<Route path='/profile/:username' element={authUser ? <ProfilePage/> : <Navigate to={"/login"}/>} />
			</Routes>

		{authUser && <RightPanel/>}

		<Toaster/>

		</div>
	);
}


export default App