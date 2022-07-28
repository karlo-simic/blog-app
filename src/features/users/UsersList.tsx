import { useAppSelector } from "../../hooks/typed-redux";
import { selectAllUsers } from "./usersSlice";
import { LinkContainer } from "react-router-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";

export const UsersList = (): JSX.Element => {
  const users = useAppSelector(selectAllUsers);

  const content = users.map((user) => {
    return (
      <LinkContainer key={user.id} to={user.id.toString()}>
        <ListGroup.Item as="a">{user.name}</ListGroup.Item>
      </LinkContainer>
    );
  });

  return (
    <ListGroup style={{ width: "100%", maxWidth: "30rem" }}>
      <h2 className="mb-4">Users</h2>
      {content}
    </ListGroup>
  );
};
