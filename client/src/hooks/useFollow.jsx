import { useMutation , useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosObj } from "../utils/axios/axiosObj";


const useFollow = () => {

    const queryClient = useQueryClient()

    const {mutate : follow , isPending} = useMutation({
        mutationFn : async (userId) => {
            try {
                const response = await axiosObj.post(`/api/user/follow/${userId}`)
                return response.data
            } catch (error) {
                toast.error(error.response.data.msg)
            }
        },
        onSuccess : () => {
            Promise.all(
                [
                    queryClient.invalidateQueries({queryKey : ["suggestedUsers"]}),
                    queryClient.invalidateQueries({queryKey : ["authUser"]})
                ]
            )
        }
    })

    return {follow , isPending}
    
}


export default useFollow