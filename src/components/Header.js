import lightLogo from '../images/lightLogo.svg';
import darkLogo from '../images/darkLogo.svg';
import { useReactiveVar } from "@apollo/client";
import { darkModeVar, isLoggedInVar, logUserOut } from "../apollo";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseChimney, faPlusSquare, faSearch } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import routes from '../routes';
import useUser from '../hooks/useUser';
import Avatar from './Avatar';
import DarkMode from './shared/DarkMode';
import { useNavigate } from "react-router-dom";
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';


function Header() {
    const isLoggedIn = useReactiveVar(isLoggedInVar);
    const darkMode = useReactiveVar(darkModeVar);
    const { data } = useUser();
    const navigate = useNavigate();
    return (
        <SHeader>
            <Wrapper>
                <Column>
                    <Link to={routes.home}>
                        {
                            darkMode ?
                                (<img width="150px" height="30px" src={darkLogo} alt="굿즈 로고" />)
                                : (<img width="150px" height="30px" src={lightLogo} alt="굿즈 로고" />)
                        }
                    </Link>
                </Column>
                <DarkMode />
                <Column>
                    {isLoggedIn ? (
                        <IconsContainer>
                            <Icon>
                                <Link to={routes.home}>
                                    <FontAwesomeIcon icon={faHouseChimney} size="lg" />
                                </Link>
                            </Icon>
                            <Icon>
                                <Link to={`/uploadFeed`}>
                                    <FontAwesomeIcon icon={faPlusSquare} size="lg" />
                                </Link>
                            </Icon>
                            <Icon>
                                <Link to={`/rooms`}>
                                    <FontAwesomeIcon icon={faPaperPlane} size="lg" />
                                </Link>
                            </Icon>
                            <Icon>
                                <Link to={`/search`}>
                                    <FontAwesomeIcon icon={faSearch} size="lg" />
                                </Link>
                            </Icon>
                            <Icon>
                                <Link to={`/users/${data?.me?.username}`}>
                                    <Avatar url={data?.me?.avatar} />
                                </Link>
                            </Icon>
                            <Button onClick={() => logUserOut(navigate)}>Log out</Button>
                        </IconsContainer>
                    ) : (
                        <Link to={routes.home}>
                            <Button>Log In</Button>
                        </Link>
                    )}
                </Column>
            </Wrapper>
        </SHeader>
    );
}
export default Header;


const SHeader = styled.header`
  width: 100%;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  background-color: ${(props) => props.theme.bgColor};
  padding: 18px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  max-width: 930px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Column = styled.div``;

const Icon = styled.span`
  margin-left: 15px;
`;

const Button = styled.span`
  background-color: ${(props) => props.theme.accent};
  border-radius: 4px;
  padding: 8px 10px;
  margin-left: 15px;
  color: white;
  font-weight: 600;
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
`;
