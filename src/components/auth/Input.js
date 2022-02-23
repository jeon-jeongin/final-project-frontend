import styled from "styled-components";

const Input = styled.input`
    width: 100%;
    padding: 7px;
    margin-top: 5px;
    background-color: ${(props) => props.theme.bgColor};
    border-radius: 3px;
    border: 0.5px solid ${(props) => (props.hasError ? props.theme.formErrorColor : props.theme.borderColor)};
    box-sizing:border-box;
    &::placeholder{
        font-size: 12px;
    }
    &:focus{
        border-color: ${(props) => props.theme.fontColor};
    }
`;

export default Input;