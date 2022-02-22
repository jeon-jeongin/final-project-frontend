import Logo from '../images/ourGoods.svg';
import styled from "styled-components";
import { Link } from 'react-router-dom';

function Login() {
    return (
        <Container>
            <Wrapper>
                <TopBox>
                    <div>
                        <img width="150px" height="40px" src={Logo} alt="굿즈 로고" />
                    </div>
                    <form>
                        <Input type="text" placeholder="Username" />
                        <Input type="password" placeholder="Password" />
                        <Button type="submit" value="Log in" />
                    </form>
                </TopBox>
                <ButtonBox>
                    <span>계정이 없으신가요?</span>
                    <Link to="/sign-up">Sign up</Link>
                </ButtonBox>
            </Wrapper>
        </Container>
    )
}
export default Login;

const Container = styled.div`
    display: flex;
    height: 100vh;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

const Wrapper = styled.div`
    max-width: 350px;
    width: 100%;
`;
const WhiteBox = styled.div`
    background-color: white;
    border: 1px solid ${(props) => props.theme.borderColor};
    width: 100%;
`;

const TopBox = styled(WhiteBox)`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 35px 40px 20px 40px;
    margin-bottom: 10px;
    form{
        margin-top: 23px;
        width: 100%;
        display: flex;
        justify-items: center;
        align-items: center;
        flex-direction: column;
    }
`;
const Input = styled.input`
    width: 100%;
    padding: 7px;
    margin-top: 5px;
    background-color: #fafafa;
    border-radius: 3px;
    border: 0.5px solid ${(props) => props.theme.borderColor};
    box-sizing:border-box;
    &::placeholder{
        font-size: 12px;
    }
`;

const Button = styled.input`
    border: none;
    margin-top: 15px;
    background-color: ${(props) => props.theme.accent};
    color: white;
    text-align: center;
    padding: 8px 0px;
    font-weight: 600;
    width: 100%;
`;

const ButtonBox = styled(WhiteBox)`
    padding: 20px 0px;
    text-align: center;
    a{
        font-weight: 600;
        margin-left: 5px;
        color: ${(props) => props.theme.accent};
    }
`;