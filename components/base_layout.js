import Head from "next/head";
import Container from "react-bootstrap/Container";

export default function BaseLayout({children, pageTitle}) {
    return (
        <div>
            <Head>
                <title>
                    Agro-SOLID {(pageTitle) ? ` - ${pageTitle}` : ""}
                </title>
                <meta charSet="utf-8"/>
                <meta name="viewport"
                      content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>

            <Container fluid className="my-5">
                {children}
            </Container>
        </div>
    );
}