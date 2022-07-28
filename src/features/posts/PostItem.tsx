import type { EntityId } from "@reduxjs/toolkit";
import { useAppSelector } from "../../hooks/typed-redux";
import { intlFormat, parseISO } from "date-fns";
import { selectAllUsers } from "../users/usersSlice";
import { Link, Navigate } from "react-router-dom";
import { ReactionButtons } from "./ReactionButtons";
import { LinkContainer } from "react-router-bootstrap";
import { selectPostById } from "./postsSlice";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

interface PostItemProps {
  id: EntityId;
  isSinglePage?: boolean;
}

export const PostItem = ({
  id,
  isSinglePage = false,
}: PostItemProps): JSX.Element => {
  const post = useAppSelector((state) => selectPostById(state, id));

  const users = useAppSelector(selectAllUsers);

  if (!post) return <Navigate to="/" />;

  const author = users.find((user) => user.id === post.userId);

  const dateString = intlFormat(parseISO(post.date), {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card
      style={{ maxWidth: "30rem", width: "100%" }}
      className="d-block "
      as="article"
    >
      <Card.Body>
        <Card.Subtitle className="mb-2">
          {author?.name || "Unknown author"} wrote
        </Card.Subtitle>
        <Card.Title>
          {!isSinglePage && <Link to={`/post/${post.id}`}>{post.title}</Link>}
          {isSinglePage && post.title}
        </Card.Title>
        <Card.Text>
          <span className="pe-2 text-muted">{dateString} —</span>
          {post.body}
        </Card.Text>
        {!isSinglePage && (
          <Link to={`/post/${post.id}`} className="mb-2 d-block">
            Read more...
          </Link>
        )}
        <ReactionButtons postId={post.id} reactions={post.reactions} />
        {isSinglePage && (
          <LinkContainer to={`/post/edit/${post.id}`}>
            <Button variant="outline-danger" className="mt-2">
              Edit
            </Button>
          </LinkContainer>
        )}
      </Card.Body>
    </Card>
  );
};
