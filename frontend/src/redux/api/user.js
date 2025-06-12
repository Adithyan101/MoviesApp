import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";
// import { logout } from "../features/auth/authSlice";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/login`,
                method: 'POST',
                body: data
            })
        }),
        signup: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/signup`,
                method: 'POST',
                body:data
            })
        }),
        logout:builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: 'POST',
            }),
        }),

        profile:builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile`,
                method: 'PUT',
                body: data
            }),
        }),

        getUsers:builder.query({
            query: () => ({
                url: `${USERS_URL}/userslist`,
                method: 'GET',
            }),
        })
    })
})

export const {useLoginMutation, useSignupMutation, useLogoutMutation, useProfileMutation, useGetUsersQuery} = userApiSlice;