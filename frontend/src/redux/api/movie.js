import {apiSlice} from "./apiSlice.js";
import {MOVIE_URL, UPLOAD_URL} from "../constants.js";


export const moviesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllMovies: builder.query({
            query:()=>({
                url:`${MOVIE_URL}/movieslist`
            })
        }),

        createMovie: builder.mutation({
            query:(newMovie)=>({
                url:`${MOVIE_URL}/create-movie`,
                method:'POST',
                body:newMovie
            })
        }),

        updateMovie: builder.mutation({
            query:({id , updatedMovie})=>({
                url:`${MOVIE_URL}/update-movie/${id}`,
                method:'PUT',
                body:updatedMovie
            })
        }),

        addMovieReview: builder.mutation({
            query:({id ,rating , comment})=>({
                url:`${MOVIE_URL}/${id}/reviews`,
                method:'POST',
                body:{rating , comment}
            })
        }),

        deleteComment: builder.mutation({
            query:({id , commentId})=>({
                url:`${MOVIE_URL}/delete-comment`,
                method:'DELETE',
                body:{id , commentId}
            })
        }),

        deleteMovie: builder.mutation({
            query:(id)=>({
                url:`${MOVIE_URL}/${id}`,
                method:'DELETE'
            })
        }),

        getSpecificMovie: builder.query({
            query:(id)=>({
                url:`${MOVIE_URL}/specific-movie/${id}`
            })
        }),

        uploadImage: builder.mutation({
            query:(formData)=>({
                url:`${UPLOAD_URL}`,
                method:'POST',
                body:formData
            })
        }),

        getNewMovies: builder.query({
            query:()=>({
                url:`${MOVIE_URL}/new-movies`
            })
        }),

        getTopMovies: builder.query({
            query:()=>({
                url:`${MOVIE_URL}/top-movies`
            })
        }),

    })
})


export const {
    useGetAllMoviesQuery,
    useCreateMovieMutation,
    useUpdateMovieMutation,
    useAddMovieReviewMutation,
    useDeleteCommentMutation,
    useDeleteMovieMutation,
    useGetSpecificMovieQuery,
    useUploadImageMutation,
    useGetNewMoviesQuery,
    useGetTopMoviesQuery
} = moviesApiSlice