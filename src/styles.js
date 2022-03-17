import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

export const lightTheme = {
    accent: "#4d88d8",
    formErrorColor: "#ff5f4e",
    noticeColor: "#8e8e8e",
    borderColor: "#dbdbdb",
    fontColor: "#262626",
    bgColor: "#fafafa",
    hoverColor: "#efefef"
};

export const darkTheme = {
    accent: "#62A4EC",
    formErrorColor: "#c4483b",
    noticeColor: "#b0aeae",
    borderColor: "#3a3b3d",
    fontColor: "#fafafa",
    bgColor: "#1e1f21",
    hoverColor: "#3e3e3e"
};

export const GlobalStyles = createGlobalStyle`
    ${reset}
    input {
        all: unset;
    }
    * {
        box-sizing:border-box;
    }
    body{
        background-color: ${(props) => props.theme.bgColor};
        font-size: 14px;
        font-family:'Open Sans', sans-serif;
        color: ${(props) => props.theme.fontColor};
    }
    textarea {
        background-color: ${(props) => props.theme.bgColor};
        font-family:'Open Sans', sans-serif;
        color: ${(props) => props.theme.fontColor};
        resize: none;
    }
    a{
        text-decoration: none;
        color: inherit;
    }
`;