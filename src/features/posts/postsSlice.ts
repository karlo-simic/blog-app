import { RootState } from "../../app/store";
import {
  createSelector,
  createEntityAdapter,
  EntityId,
} from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { apiSlice } from "../api/apiSlice";

const transformPosts = (posts: Post[]): Post[] => {
  let day = 1;
  return posts.map((post): Post => {
    post.date ??= sub(new Date(), { days: day++ }).toISOString();
    post.reactions ??= {
      likes: 0,
      cool: 0,
      hearts: 0,
      laughs: 0,
    };
    return post;
  });
};

export type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
  date: string;
  reactions: {
    likes: number;
    hearts: number;
    cool: number;
    laughs: number;
  };
};

export type PostReactions = Post["reactions"];

interface AddNewPostArg {
  userId: number;
  title: string;
  body: string;
}

interface AddReactionArg {
  postId: EntityId;
  reactions: PostReactions;
}

const postsAdapter = createEntityAdapter<Post>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = postsAdapter.getInitialState();

type PostsResult = typeof initialState;

export const postsSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getPosts: build.query<PostsResult, void>({
      query: () => "/posts",
      transformResponse: (responseData: Post[]) => {
        const transformedPosts = transformPosts(responseData);
        return postsAdapter.setAll(initialState, transformedPosts);
      },
      providesTags: (result) =>
        result
          ? [
              { type: "Post", id: "LIST" },
              ...result.ids.map((id) => ({ type: "Post" as const, id })),
            ]
          : [{ type: "Post", id: "LIST" }],
    }),
    getPostsByUserId: build.query<PostsResult, number>({
      query: (id) => `/posts?userId=${id}`,
      transformResponse: (responseData: Post[]) => {
        const transformedPosts = transformPosts(responseData);
        return postsAdapter.setAll(initialState, transformedPosts);
      },
      providesTags: (result) =>
        result
          ? [...result.ids.map((id) => ({ type: "Post" as const, id }))]
          : [],
    }),
    addNewPost: build.mutation<PostsResult, AddNewPostArg>({
      query: (postData) => ({
        url: "/posts",
        method: "POST",
        body: { ...postData, date: new Date().toISOString() },
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    updatePost: build.mutation<PostsResult, Post>({
      query: (post) => ({
        url: `/posts/${post.id}`,
        method: "PUT",
        body: { ...post, date: new Date().toISOString() },
      }),
      invalidatesTags: (_, __, post) => [{ type: "Post", id: post.id }],
    }),
    deletePost: build.mutation<void, Post>({
      query: ({ id }) => ({
        url: `/posts/${id}`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Post", id }],
    }),
    /* 
    Optimistic update
    */
    addReaction: build.mutation<void, AddReactionArg>({
      query: ({ postId, reactions }) => ({
        url: `/posts/${postId}`,
        method: "PATCH",
        body: { reactions },
      }),
      async onQueryStarted(
        { postId, reactions },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          postsSlice.util.updateQueryData("getPosts", undefined, (draft) => {
            const post = draft.entities[postId];
            if (post) post.reactions = reactions;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostsByUserIdQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useAddReactionMutation,
} = postsSlice;

const selectPostsResult = postsSlice.endpoints.getPosts.select();

const selectPostsData = createSelector(
  selectPostsResult,
  (result) => result.data
);

export const {
  selectIds: selectPostIds,
  selectAll: selectAllPosts,
  selectById: selectPostById,
} = postsAdapter.getSelectors(
  (state: RootState) => selectPostsData(state) ?? initialState
);
