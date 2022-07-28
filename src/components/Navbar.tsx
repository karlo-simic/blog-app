import Container from "react-bootstrap/Container";
import BSNavbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";

export const Navbar = (): JSX.Element => {
  return (
    <BSNavbar bg="light" variant="light" className="mb-4">
      <Container fluid="sm">
        <LinkContainer to="/">
          <BSNavbar.Brand>Blogs</BSNavbar.Brand>
        </LinkContainer>
        <Nav className="ms-auto">
          <LinkContainer to="/">
            <Nav.Link>Home</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/users">
            <Nav.Link>Users</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/post">
            <Nav.Link>New Post</Nav.Link>
          </LinkContainer>
        </Nav>
      </Container>
    </BSNavbar>
  );
};
