import { toast } from "react-toastify";
import { useDeleteCommentMutation, useGetAllMoviesQuery } from "../../redux/api/movie";

const AllComents = () => {

    const {data:movie, refetch} = useGetAllMoviesQuery();
    console.log("movie",movie)

    const [deleteComment] = useDeleteCommentMutation();

  return (
    <div className="text-white">
        {movie?.movies.map((m)=>(
            <section key={m._id} className="flex flex-col justify-center items-center">

            {m?.reviews.map((review)=>(
                <div key={review._id} className="flex flex-col justify-center items-center">
                    <div className="flex justify-between">
                        <p>{review.name}</p>
                        <p>{review.comment}</p>
                        <button onClick={async()=>{await deleteComment(review._id); refetch(); toast.success("Comment deleted")}}>Delete</button>
                    </div>
                </div>
            ))}

            </section>
        ))}
        
    </div>
  )
}

export default AllComents