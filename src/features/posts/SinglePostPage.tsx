import { useParams } from "react-router-dom";
import { PostItem } from "./PostItem";

export const SinglePostPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();

  return <PostItem id={Number(id)} isSinglePage />;
};
