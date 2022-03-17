import styled from "styled-components";

const Container = styled.div`
display: flex;
margin-top: 14vh;
justify-content: center;
align-items: center;
flex-direction: column;
`;

const Wrapper = styled.div`
    max-width: 350px;
    width: 100%;
`;

function AuthLayout({ children }) {
    return (
        <Container>
            <Wrapper>
                {children}
            </Wrapper>
        </Container>
    )
}

export default AuthLayout;