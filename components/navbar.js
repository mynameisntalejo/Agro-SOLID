import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Link from "next/link"
import {useRouter} from "next/router"
import auth from "solid-auth-client";
import Typography from "@material-ui/core/Typography";

export default function NavigationBar() {
    const router = useRouter();

    return (
        <Navbar bg="dark"
                variant="dark"
                expand="lg"
        >
            <Link href="/">
                <Navbar.Brand className="btn">
                    <img alt="Agro-SOLID Logo"
                         src="/static/images/agro-solid-logo.png"
                         width="50"
                         height="50"
                         className="d-inline-block mr-2"
                    />
                    <Typography variant="h4"
                                className="font-weight-bold"
                    >
                        Agro-SOLID
                    </Typography>
                </Navbar.Brand>
            </Link>
            <Navbar.Toggle aria-controls="navigationBar"/>
            <Navbar.Collapse id="navigationBar">
                <Nav justify
                     variant="pills"
                     className="mr-auto"
                >
                    <Nav.Link href="/"
                              className={(router.pathname === "/") ? "active active-page" : ""}
                    >
                        <Typography variant="button"
                                    className="font-weight-bold"
                        >
                            Inicio
                        </Typography>
                    </Nav.Link>
                    <Nav.Link href="/profile"
                              className={(router.pathname === "/profile") ? "active active-page" : ""}
                    >
                        <Typography variant="button"
                                    className="font-weight-bold"
                        >
                            Mis datos
                        </Typography>
                    </Nav.Link>
                    <Nav.Link href="#"
                              onClick={() => auth.logout().then(() => router.push("/login"))}
                    >
                        <Typography variant="button"
                                    className="font-weight-bold"
                        >
                            Salir
                        </Typography>
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}