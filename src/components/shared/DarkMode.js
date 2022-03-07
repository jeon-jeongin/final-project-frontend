import { useReactiveVar } from "@apollo/client";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { darkModeVar, disableDarkMode, enableDarkMode } from "../../apollo";

const Container = styled.div`
`;

const DarkModeButton = styled.span`
`;

function DarkMode() {
    const darkMode = useReactiveVar(darkModeVar);
    return (
        <Container>
            <DarkModeButton onClick={darkMode ? disableDarkMode : enableDarkMode}>
                <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
            </DarkModeButton>
        </Container>
    )
}

export default DarkMode;