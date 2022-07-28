import { useAppSelector } from "../../hooks/typed-redux";
import { selectPostIds, useGetPostsQuery } from "./postsSlice";
import { PostItem } from "./PostItem";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

export const PostsList = (): JSX.Element => {
  const { isLoading, isSuccess, isError, error } = useGetPostsQuery();

  const postIds = useAppSelector(selectPostIds);

  let content: JSX.Element | JSX.Element[] | null = null;

  if (isLoading) {
    content = (
      <div className="d-flex justify-content-center py-4">
        <Spinner animation="border" variant="secondary" />
      </div>
    );
  } else if (isSuccess) {
    content = postIds.map((id) => <PostItem id={id} key={id} />);
  } else if (isError) {
    content = (
      <Alert variant="danger">
        {"message" in error ? error.message : "Error 💥"}
      </Alert>
    );
  }

  return <section className="d-flex flex-column gap-3">{content}</section>;
};
