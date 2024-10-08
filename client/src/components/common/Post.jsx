import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery , useQueryClient } from "@tanstack/react-query";
import { axiosObj } from "../../utils/axios/axiosObj";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../utils/date";



const Post = ({ post }) => {

	const [comment, setComment] = useState("");
	const postOwner = post.user;

	
	const queryClient = useQueryClient()
	
	const {data : authUser} =  useQuery({queryKey : ["authUser"]})
	
	const isLiked = post.likes.includes(authUser._id);


	const {mutate : deletePost , isPending} = useMutation({
		mutationFn : async () => {
			try {
				const res = await axiosObj.delete(`/api/post/${post?._id}`)
				return res.data
			} catch (error) {
				console.log(error)
			}
		},
		onSuccess : () => {
			toast.success("post deleted successfully")
			// to recall the queryFun for the querykey that called posts to refetch the posts 
			queryClient.invalidateQueries({queryKey : ["posts"]})
		}
	})



	const {mutate : likePost , isPending : isLiking} = useMutation({
		mutationFn : async () => {
			try {
				const res = await axiosObj.post(`/api/post/like/${post?._id}`)
				return res.data
			} catch (error) {
				console.log(error)
			}
		},
		onSuccess : (updatedLikes) => {
			// updatedLikes parameter will be the value that came from mutationFn response what basiclly we return from it
			// oldData will be the previous posts queryKey array we iterate over it then if it was the post that i like it i change the likes array value for this post to the value i get from the response
			// more effiecent than recall the queryKey for the posts and refetch all posts again
			queryClient.setQueryData(["posts"] , (oldData) => {
				return oldData.map(pos => {
					if(pos._id === post._id){
						return {...pos , likes : updatedLikes}
					}
					return pos
				})
			})
		}
	})



	const {mutate : commentOnPost , isPending : isCommenting} = useMutation({
		mutationFn : async ({comment}) => {
			try {
				const res = await axiosObj.post(`/api/post/comment/${post?._id}` , {text : comment})
				return res.data
			} catch (error) {
				console.log(error)
			}
		},
		onSuccess : () => {
			setComment("")
			queryClient.invalidateQueries({queryKey : ["posts"]})
		}
	})


	
	const isMyPost = authUser._id === post.user._id ;


	const formattedDate = formatPostDate(post.createdAt);



	const handleDeletePost = () => {
		deletePost()
	};

	

	const handlePostComment = (e) => {
		e.preventDefault();
		if(isCommenting) return
		commentOnPost({comment})
	};



	const handleLikePost = () => {
		likePost()
	};





	return (
		<>
			<div className='flex gap-2 items-start p-4 border-b border-gray-700'>

				<div className='avatar'>

					<Link to={`/profile/${postOwner.username}`} className='w-8 rounded-full overflow-hidden'>
						<img src={postOwner.profileImg || "/avatar-placeholder.png"} />
					</Link>

				</div>

				<div className='flex flex-col flex-1'>

					<div className='flex gap-2 items-center'>

						<Link to={`/profile/${postOwner.username}`} className='font-bold'>
							{postOwner.fullName}
						</Link>

						<span className='text-gray-700 flex gap-1 text-sm'>

							<Link to={`/profile/${postOwner.username}`}>@{postOwner.username}</Link>
							<span>·</span>
							<span>{formattedDate}</span>

						</span>

						{isMyPost && (
							<span className='flex justify-end flex-1'>
								{!isPending && <FaTrash className='cursor-pointer hover:text-red-500' onClick={handleDeletePost} />}
								{isPending && <LoadingSpinner size="sm"/>}
							</span>
						)}

					</div>

					<div className='flex flex-col gap-3 overflow-hidden'>

						<span>{post.text}</span>

						{post.img && (
							<img
								src={post.img}
								className='h-80 object-contain rounded-lg border border-gray-700'
								alt=''
							/>
						)}

					</div>

					<div className='flex justify-between mt-3'>

						<div className='flex gap-4 items-center w-2/3 justify-between'>

							<div
								className='flex gap-1 items-center cursor-pointer group'
								onClick={() => document.getElementById("comments_modal" + post._id).showModal()}
							>
								<FaRegComment className='w-4 h-4  text-slate-500 group-hover:text-sky-400' />

								<span className='text-sm text-slate-500 group-hover:text-sky-400'>
									{post.comments.length}
								</span>

							</div>

							{/* We're using Modal Component from DaisyUI */}

							<dialog id={`comments_modal${post._id}`} className='modal border-none outline-none'>

								<div className='modal-box rounded border border-gray-600'>

									<h3 className='font-bold text-lg mb-4'>COMMENTS</h3>

									<div className='flex flex-col gap-3 max-h-60 overflow-auto'>

										{post.comments.length === 0 && (
											<p className='text-sm text-slate-500'>
												No comments yet 🤔 Be the first one 😉
											</p>
										)}

										{post.comments.map((comment) => (

											<div key={comment._id} className='flex gap-2 items-start'>

												<div className='avatar'>

													<div className='w-8 rounded-full'>
														<img
															src={comment.user.profileImg || "/avatar-placeholder.png"}
														/>
													</div>

												</div>

												<div className='flex flex-col'>

													<div className='flex items-center gap-1'>

														<span className='font-bold'>{comment.user.fullName}</span>

														<span className='text-gray-700 text-sm'>
															@{comment.user.username}
														</span>

													</div>

													<div className='text-sm'>{comment.text}</div>

												</div>

											</div>

										))}

									</div>

									<form
										className='flex gap-2 items-center mt-4 border-t border-gray-600 pt-2'
										onSubmit={handlePostComment}
									>
										<textarea
											className='textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800'
											placeholder='Add a comment...'
											value={comment}
											onChange={(e) => setComment(e.target.value)}
										/>

										<button className='btn btn-primary rounded-full btn-sm text-white px-4'>

											{isCommenting || isLiking ? (
												<LoadingSpinner size="sm" />
											) : (
												"Post"
											)}

										</button>

									</form>

								</div>

								<form method='dialog' className='modal-backdrop'>
									<button className='outline-none'>close</button>
								</form>

							</dialog>

							<div className='flex gap-1 items-center group cursor-pointer'>
								<BiRepost className='w-6 h-6  text-slate-500 group-hover:text-green-500' />
								<span className='text-sm text-slate-500 group-hover:text-green-500'>0</span>
							</div>

							<div className='flex gap-1 items-center group cursor-pointer' onClick={handleLikePost}>

								{!isLiked && (
									<FaRegHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500' />
								)}

								{isLiked && <FaRegHeart className='w-4 h-4 cursor-pointer text-pink-500 ' />}

								<span
									className={`text-sm text-slate-500 group-hover:text-pink-500 ${
										isLiked ? "text-pink-500" : "text-slate-500"
									}`}
								>
									{post.likes.length}
								</span>

							</div>

						</div>

						<div className='flex w-1/3 justify-end gap-2 items-center'>
							<FaRegBookmark className='w-4 h-4 text-slate-500 cursor-pointer' />
						</div>

					</div>

				</div>

			</div>
            
		</>
	);
};
export default Post;