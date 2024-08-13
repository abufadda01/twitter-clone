import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useQuery, useQueryClient , useMutation } from "@tanstack/react-query";
import { axiosObj } from "../../utils/axios/axiosObj";
import toast from "react-hot-toast";

import EmojiPicker from 'emoji-picker-react'


const CreatePost = () => {

	const [text, setText] = useState("");
	const [img, setImg] = useState(null);
	const [emojiPickerOpen , setEmojiPickerOpen] = useState(false)

	const imgRef = useRef(null);
	const emojiRef = useRef(null)

	const handleAddEmoji = (emoji) => {
		setText((text) => text + emoji.emoji)
	}
	
	
	const queryClient = useQueryClient()
	const {data : authUser} =  useQuery({queryKey : ["authUser"]})

	const {mutate : createPost , isPending , isError , error} = useMutation({
		mutationFn : async ({text , img}) => {
			try {
				const response = await axiosObj.post("/api/post/create" , {text , img})
				return response.data
			} catch (error) {
				// toast.error(error.response.data.msg)
				throw new Error(error.response.data.msg)
			}
		},
		onSuccess : () => {
			setText("")
			setImg(null)
			toast.success("post created successfully")
			queryClient.invalidateQueries({queryKey : ["posts"]})
		}
	})


	const handleSubmit = (e) => {
		e.preventDefault();
		createPost({text , img})
	};


	const handleImgChange = (e) => {

		const file = e.target.files[0];

		if (file) {
            
			const reader = new FileReader();

			reader.onload = () => {
				setImg(reader.result);
			};

			reader.readAsDataURL(file);

		}

	};



	useEffect(() => {

		function handleClickOutSide(event){
		  // if the clicked element (event.target) was not in the emojiRef (div that hold the emojies) close the emojies div
		  // that means i clicked outside the emoji container
		  if(emojiRef.current && !emojiRef.current.contains(event.target)){
			setEmojiPickerOpen(false)
		  }
		  
		}
	
		// add mouse down event in the all document , event.target will be the value of what we clicked over in the mouse down
		document.addEventListener("mousedown" , handleClickOutSide)
	
		return () => {
		  document.removeEventListener("mousedown" , handleClickOutSide)
		}
	
	  } , [emojiRef])

	  
	

	return (

		<div className='flex p-4 items-start gap-4 border-b border-gray-700'>

			<div className='avatar'>

				<div className='w-8 rounded-full'>
					<img src={authUser.profileImg || "/avatar-placeholder.png"} />
				</div>

			</div>

			<form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>

				<textarea
					className='textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800'
					placeholder='What is happening?!'
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>

				{img && (

					<div className='relative w-72 mx-auto'>

						<IoCloseSharp
							className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
							onClick={() => {
								setImg(null);
								imgRef.current.value = null;
							}}
						/>

						<img src={img} className='w-full mx-auto h-72 object-contain rounded' />

					</div>

				)}


				<div className='flex justify-between border-t py-2 border-t-gray-700'>

					<div className='flex relative gap-1 items-center'>

						<CiImageOn
							className='fill-primary w-6 h-6 cursor-pointer'
							onClick={() => imgRef.current.click()}
						/>

						{/* add emoji package */}
						<div onClick={() => setEmojiPickerOpen(true)} className="absolute bottom-1.5 right-[-28px]">
							<BsEmojiSmileFill  className='fill-primary w-5 h-5 cursor-pointer' />
						</div>

						<div ref={emojiRef} className='max-w-[80px] absolute bottom-2 top-4 right-[-120px]'>
            				<EmojiPicker width={380} height={360} theme='dark' open={emojiPickerOpen} onEmojiClick={handleAddEmoji} autoFocusSearch={false} />
          				</div>

					</div>

					<input type='file' hidden ref={imgRef} accept="image/*" onChange={handleImgChange} />

					<button className='btn btn-primary rounded-full btn-sm text-white px-4'>
						{isPending ? "Posting..." : "Post"}
					</button>

				</div>

				{isError && <div className='text-red-500'>{error.message}</div>}

			</form>

		</div>
	);
};
export default CreatePost;