import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { POSTS } from "../../utils/db/dummy";
import { useQuery } from "@tanstack/react-query";
import { axiosObj } from "../../utils/axios/axiosObj";
import { useEffect } from "react";



const Posts = ({feedType}) => {


	const getPostsEndPoints = () => {
		switch(feedType){
			case "forYou" :
				return "/api/post";
			case "following" :
				return "/api/post/following";
			default :
				return "/api/post"
		}
	}


	const post_url = getPostsEndPoints()


	const {data : posts , isLoading , refetch , isRefetching} = useQuery({
		queryKey : ["posts"],
		queryFn : async () => {
			try {
				const response = await axiosObj.get(post_url)
				return response.data
			} catch (error) {
				console.log(error)
			}
		}	
	})


	useEffect(() => {
		refetch()
	}, [refetch , feedType])




	return (
		<>

			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}

			{!isLoading && !isRefetching && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}

		</>

	);
};

export default Posts;