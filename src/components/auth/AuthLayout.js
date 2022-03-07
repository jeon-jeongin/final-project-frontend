import { useReactiveVar } from "@apollo/client";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { darkModeVar, disableDarkMode, enableDarkMode } from "../../apollo";

const Container = styled.div`
display: flex;
height: 75vh;
justify-content: center;
align-items: center;
flex-direction: column;
`;

const Wrapper = styled.div`
    max-width: 350px;
    width: 100%;
`;

const Footer = styled.footer`
    margin-top: 20px;
`;

const DarkModeButton = styled.span`
`;

function AuthLayout({ children }) {
    const darkMode = useReactiveVar(darkModeVar);
    return (
        <Container>
            <Wrapper>
                {children}
            </Wrapper>
            <Footer>
                <DarkModeButton onClick={darkMode ? disableDarkMode : enableDarkMode}>
                    <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
                </DarkModeButton>
            </Footer>
        </Container>
    )
}

export default AuthLayout;