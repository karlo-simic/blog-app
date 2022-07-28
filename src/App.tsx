import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { PostsList } from "./features/posts/PostsList";
import { NewPostForm } from "./features/posts/NewPostForm";
import { SinglePostPage } from "./features/posts/SinglePostPage";
import { EditPostForm } from "./features/posts/EditPostForm";
import { UsersList } from "./features/users/UsersList";
import { UserPage } from "./features/users/UserPage";

export const App = (): JSX.Element => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<PostsList />} />
        <Route path="post">
          <Route index element={<NewPostForm />} />
          <Route path=":id" element={<SinglePostPage />} />
          <Route path="edit/:id" element={<EditPostForm />} />
        </Route>
        <Route path="users">
          <Route index element={<UsersList />} />
          <Route path=":id" element={<UserPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
};
