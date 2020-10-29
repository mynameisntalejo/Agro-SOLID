import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Link from "next/link"
import {useRouter} from "next/router"

export default function NavigationBar() {
    const router = useRouter();

    return (
        <Navbar bg="dark"
                variant="dark"
                expand="lg"
                fixed="top"
        >
            <Link href="/">
                <Navbar.Brand className="btn">
                    <img alt="Agro-SOLID Logo"
                         src="/static/images/agro-solid-logo.png"
                         width="50"
                         height="50"
                         className="d-inline-block mr-2"
                    />
                    Agro-SOLID
                </Navbar.Brand>
            </Link>
            <Navbar.Toggle aria-controls="navigationBar"/>
            <Navbar.Collapse id="navigationBar">
                <Nav justify
                     variant="pills"
                     className="mr-auto"
                >
                    <Nav.Link href="/"
                              className={(router.pathname === "/") ? "active" : ""}
                    >
                        Inicio
                    </Nav.Link>
                    <Nav.Link href="/profile"
                              className={(router.pathname === "/profile") ? "active" : ""}
                    >
                        Mis datos
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}