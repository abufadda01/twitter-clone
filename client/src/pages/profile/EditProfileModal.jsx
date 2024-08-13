import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";



const EditProfileModal = () => {

	const {data : authUser} = useQuery({queryKey : ["authUser"]})

	const [formData, setFormData] = useState({
		fullName: authUser?.fullName || "",
		username: authUser?.username || "",
		email: authUser?.email || "",
		bio: authUser?.bio || "",
		link: authUser?.link || "",
		newPassword: "",
		currentPassword: "",
	});


	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	
	const queryClient = useQueryClient()


	const {mutate : updateProfile , isPending} = useMutation({
		mutationFn : async () => {
			try {

				const response = await axiosObj.patch("/api/user/update/profile" , formData)

				toast.success("profile updated successfully")
				return response.data

			} catch (error) {
				toast.error(error.response.data.msg)
			}
		} ,
		onSuccess : () => {
			queryClient.invalidateQueries({queryKey : ["authUser"]})
			queryClient.invalidateQueries({queryKey : ["userProfile"]})
		}
	})


	const handleSubmit = (e) => {
		e.preventDefault();
		updateProfile(); 
	};



	return (
		<>
		
			<button
				className='btn btn-outline rounded-full btn-sm'
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Edit profile
			</button>

			
			<dialog id='edit_profile_modal' className='modal'>
				
				<div className='modal-box border rounded-md border-gray-700 shadow-md'>
					
					<h3 className='font-bold text-lg my-3'>Update Profile</h3>

					<form
						className='flex flex-col gap-4'
						onSubmit={handleSubmit}
					>

						<div className='flex flex-wrap gap-2'>
							
							<input
								type='text'
								placeholder='Full Name'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.fullName}
								name='fullName'
								onChange={handleInputChange}
							/>

							<input
								type='text'
								placeholder='Username'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.username}
								name='username'
								onChange={handleInputChange}
							/>
						
						</div>

						<div className='flex flex-wrap gap-2'>

							<input
								type='email'
								placeholder='Email'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.email}
								name='email'
								onChange={handleInputChange}
							/>

							<textarea
								placeholder='Bio'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.bio}
								name='bio'
								onChange={handleInputChange}
							/>

						</div>

						<div className='flex flex-wrap gap-2'>
						
							<input
								type='password'
								placeholder='Current Password'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.currentPassword}
								name='currentPassword'
								onChange={handleInputChange}
							/>
						
							<input
								type='password'
								placeholder='New Password'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.newPassword}
								name='newPassword'
								onChange={handleInputChange}
							/>
						
						</div>

						<input
							type='text'
							placeholder='Link'
							className='flex-1 input border border-gray-700 rounded p-2 input-md'
							value={formData.link}
							name='link'
							onChange={handleInputChange}
						/>

						<button type="submit" className='btn btn-primary rounded-full btn-sm text-white'>{isPending ? "updating..." : "Update"}</button>
					
					</form>
				
				</div>
				
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>close</button>
				</form>
			
			</dialog>
		</>
	);
};
export default EditProfileModal;