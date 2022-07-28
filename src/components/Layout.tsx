import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import Container from "react-bootstrap/Container";

export const Layout = (): JSX.Element => {
  return (
    <>
      <Navbar />
      <Container fluid="sm" className="d-flex justify-content-center">
        <Outlet />
      </Container>
    </>
  );
};
