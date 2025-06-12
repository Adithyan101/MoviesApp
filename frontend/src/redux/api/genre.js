import {apiSlice} from "./apiSlice.js";
import {GENRE_URL} from "../constants.js";



export const genreApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        listGenres: builder.query({
            query:()=>({
                url:`${GENRE_URL}/genres`,

            })
        }),
        createGenre: builder.mutation({
            query:(data)=>({
                url:`${GENRE_URL}`,
                method:'POST',
                body:data
            })
        }),
        updateGenre: builder.mutation({
            query:({id , updateGenre})=>({
                url:`${GENRE_URL}/${id}`,
                method:'PUT',
                body:updateGenre
            })
        }),
        removeGenre: builder.mutation({
            query:(id)=>({
                url:`${GENRE_URL}/${id}`,
                method:'DELETE'
            })
        }),
        getSpecificGenre: builder.query({
            query:(id)=>({
                url:`${GENRE_URL}/${id}`
            })
        })
    })
})


export const {useListGenresQuery, useCreateGenreMutation, useUpdateGenreMutation, useRemoveGenreMutation, useGetSpecificGenreQuery} = genreApiSlice