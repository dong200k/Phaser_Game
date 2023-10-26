import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { UserContext } from "../contexts/UserContextProvider";
import ClientFirebaseConnection from "../firebase/ClientFirebaseConnection";
import { useContext } from "react";
import Badge from 'react-bootstrap/Badge';


export default function NavigationBar(props){

    const { user, userRole } = useContext(UserContext);

    const onSubmit = (e) => {
        e.preventDefault();
        let email = document.getElementById("loginEmail").value;
        let password = document.getElementById("loginPassword").value;
        ClientFirebaseConnection.singleton.login(email, password).then((user) => {
            // console.log(user);
            document.getElementById("loginEmail").value = "";
            document.getElementById("loginPassword").value = "";
        }).catch(e => {
            console.log(e.message);
        });
    }

    const displayLogin = () => {

        let userRoleText = "";
        if(userRole === "gamemaster") userRoleText = "Game Master";
        else if(userRole === "admin") userRoleText = "Admin";
        else userRoleText = "";

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
                <div> 
                    <span style={{marginRight: "10px"}}>
                        Welcome: <Badge>{userRoleText}</Badge> {user.displayName} 
                    </span>
                    <button className="btn btn-dark" onClick={() => {ClientFirebaseConnection.singleton.logout()}}>Logout</button>
                </div>
            );
        }
    }

    return(
        <Navbar bg="light" expand="lg">
            <Container>
                {/* <Navbar.Brand href="#home"></Navbar.Brand> */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Link to="/json"><button className="btn btn-light">Json</button></Link>
                    <Link to="/role"><button className="btn btn-light">Roles</button></Link>
                    <Link to="/abilities"><button className="btn btn-light">Abilities</button></Link>
                    <Link to="/upgrade"><button className="btn btn-light">Upgrades</button></Link>
                    <Link to="/skill"><button className="btn btn-light">Skills</button></Link>
                    <Link to="/weapon"><button className="btn btn-light">Weapon</button></Link>
                    <Link to="/node"><button className="btn btn-light">Reusable nodes</button></Link>
                    <Link to="/monster"><button className="btn btn-light">Monster</button></Link>
                    <Link to="/dungeon"><button className="btn btn-light">Dungeon</button></Link>
                    <Link to="/asset"><button className="btn btn-light">Asset</button></Link>
                    <Link to="/backup"><button className="btn btn-light">Backup</button></Link>
                    <Link to="/admin"><button className="btn btn-light">Admin</button></Link>
                </Nav>
                </Navbar.Collapse>
                { displayLogin() }
            </Container>
        </Navbar>
    )
}