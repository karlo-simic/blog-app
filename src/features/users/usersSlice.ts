import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { apiSlice } from "../api/apiSlice";

export type User = {
  id: number;
  name: string;
  username: string;
};

const usersAdapter = createEntityAdapter<User>();

const initialState = usersAdapter.getInitialState();

type UsersResult = typeof initialState;

export const usersSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<UsersResult, void>({
      query: () => "/users",
      transformResponse: (responseData: User[]) => {
        return usersAdapter.setAll(initialState, responseData);
      },
      providesTags: [{ type: "User", id: "LIST" }],
    }),
  }),
});

export const { useGetUsersQuery } = usersSlice;

const selectUsersResult = usersSlice.endpoints.getUsers.select();

const selectUsersData = createSelector(
  selectUsersResult,
  (result) => result.data
);

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors(
  (state: RootState) => selectUsersData(state) ?? initialState
);
