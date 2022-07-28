import { useAppSelector } from "../../hooks/typed-redux";
import { selectUserById } from "./usersSlice";
import { useGetPostsByUserIdQuery } from "../posts/postsSlice";
import { useParams, Navigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

export const UserPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();

  const user = useAppSelector((state) => selectUserById(state, Number(id)));

  const {
    data: posts,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPostsByUserIdQuery(Number(id));

  if (!user) return <Navigate to="/" />;

  let content: JSX.Element | JSX.Element[] | null = null;

  if (isLoading) {
    content = (
      <div className="d-flex justify-content-center py-4">
        <Spinner animation="border" variant="secondary" />
      </div>
    );
  } else if (isSuccess) {
    content = posts.ids.map((id) => {
      return (
        <LinkContainer key={id} to={`/post/${id}`}>
          <ListGroup.Item as="a">{posts.entities[id]!.title}</ListGroup.Item>
        </LinkContainer>
      );
    });
  } else if (isError) {
    content = (
      <Alert variant="danger">
        {"message" in error ? error.message : "Error 💥"}
      </Alert>
    );
  }

  return (
    <ListGroup style={{ width: "100%", maxWidth: "30rem" }}>
      <h2 className="mb-4">{user.name}</h2>
      {content}
    </ListGroup>
  );
};
