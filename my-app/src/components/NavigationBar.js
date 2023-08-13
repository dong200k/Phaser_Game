import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { UserContext } from "../contexts/UserContextProvider";
import ClientFirebaseConnection from "../firebase/ClientFirebaseConnection";

export default function NavigationBar(props){

    const onSubmit = (e) => {
        e.preventDefault();
        let email = document.getElementById("loginEmail").value;
        let password = document.getElementById("loginPassword").value;
        ClientFirebaseConnection.singleton.login(email, password).then((user) => {
            console.log(user);
            document.getElementById("loginEmail").value = "";
            document.getElementById("loginPassword").value = "";
        }).catch(e => {
            console.log(e.message);
        });
    }

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
                    <Link to="/monster"><Nav.Link href="monster">Monster</Nav.Link></Link>
                </Nav>
                </Navbar.Collapse>
                <UserContext.Consumer>
                    {
                        (userContext) => {
                            let user = userContext.user;
                            if(!user) {
                                return (
                                    <form id="loginForm" onSubmit={onSubmit}>
                                        <label htmlFor="email">Email:</label>
                                        <input type="email" name="email" id="loginEmail"></input>
                                        <label htmlFor="password">Password:</label>
                                        <input type="password" name="password" id="loginPassword"></input>
                                        <button>Submit</button>
                                    </form>
                                )
                            } else {
                                return (
                                    <div> Welcome: {user.displayName} 
                                    <button onClick={() => {ClientFirebaseConnection.singleton.logout()}}>Logout</button>
                                    </div>
                                );
                            }
                        }
                    }
                </UserContext.Consumer>
                
            </Container>
        </Navbar>
    )
}