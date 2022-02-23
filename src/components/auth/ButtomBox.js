import { Link } from "react-router-dom";
import styled from "styled-components";
import { BaseBox } from "../shared";

const SButtonBox = styled(BaseBox)`
    padding: 20px 0px;
    text-align: center;
    a{
        font-weight: 600;
        margin-left: 5px;
        color: ${(props) => props.theme.accent};
    }
`;

function ButtomBox({ cta, link, linkText }) {
    return (
        <SButtonBox>
            <span>{cta}</span>
            <Link to={link}>{linkText}</Link>
        </SButtonBox>
    )
}

export default ButtomBox;