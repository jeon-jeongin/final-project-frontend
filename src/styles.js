import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

export const lightTheme = {
    accent: "#0095f6",
    borderColor: "#dbdbdb",
    fontColor: "#2c2c2c",
    bgColor: "#fafafa"
};

export const darkTheme = {
    fontColor: "#fafafa",
    bgColor: "#2c2c2c"
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
        color: #262626;
    }
    a{
        text-decoration: none;
    }
`;