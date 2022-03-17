import styled from "styled-components";

function Messages({ avatar, payload }) {

    return (
        <>
            <Avatar src={avatar} />
            <Message>{payload}</Message>
        </>
    )
}

export default Messages;

const Avatar = styled.img`
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.fontColor};
`;

const Message = styled.div`
    display: inline;
    padding: 9px;
    margin: 0px 8px;
    border-radius: 15px;
    background-color: ${(props) => props.theme.hoverColor};
`;
