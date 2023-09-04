import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

export default function NavigationBar(){
    return(
        <Navbar bg="light" expand="lg">
            <Container>
                {/* <Navbar.Brand href="#home"></Navbar.Brand> */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Link to="/upgrade"><Nav.Link href="upgrade">Upgrades</Nav.Link></Link>
                    <Link to="/skill"><Nav.Link href="skill">Skills</Nav.Link></Link>
                    <Link to="/weapon"><Nav.Link href="weapon">Weapon</Nav.Link></Link>
                    <Link to="/node"><Nav.Link href="node">Reusable nodes</Nav.Link></Link>
                    <Link to="/role"><Nav.Link href="role">Roles</Nav.Link></Link>
                    <Link to="/abilities"><Nav.Link href="ability">Abilities</Nav.Link></Link>
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}