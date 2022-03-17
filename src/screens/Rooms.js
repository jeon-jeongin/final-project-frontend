import { gql, useMutation, useQuery } from "@apollo/client";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import styled from "styled-components";
import PageTitle from "../components/PageTitle";
import { FatLink, FatText } from "../components/shared";
import { ROOM_FRAGMENT } from "../fragments";
import useUser from "../hooks/useUser";
import Room from "./Room";

function Rooms() {
    const { data: meData } = useUser();
    const { data } = useQuery(SEE_ROOMS_QUERY);

    const [notMe, setNotMe] = useState("");

    useEffect(() => {
        if (data) {
            if (Object.keys(data?.seeRooms).length !== 0) {
                setNotMe((data?.seeRooms[0]?.users).find((user) => user.username !== meData?.me?.username))
            }
        }
    }, [data]);

    const [message, setMessage] = useState(false);

    const onMessageClick = () => {
        setMessage(message => !message);
    }
    return (
        <Layout>
            <PageTitle title="Direct" />
            <RoomsContainers>
                <RoomsContainer>
                    <RoomsHeader>
                        <div>
                            <Avatar src={meData?.me?.avatar} />
                            <Username>{meData?.me?.username}</Username>
                        </div>
                    </RoomsHeader>
                    {notMe ?
                        <RoomsUsers onClick={onMessageClick}>
                            <div>
                                <Avatar src={notMe?.avatar} />
                                <Username>{notMe?.username}</Username>
                            </div>
                        </RoomsUsers>
                        :
                        <RoomsUsers>
                            <div>
                                <Avatar />
                                <Username />
                            </div>
                        </RoomsUsers>
                    }
                </RoomsContainer>
                <RoomsContainer>
                    {message ?
                        <>
                            {data?.seeRooms.map((room) => (
                                <Room key={room.id} {...room} />
                            ))}
                        </>
                        :
                        <Container>
                            <FontAwesomeIcon icon={faPaperPlane} />
                            <Title>내 메세지</Title>
                            <Subtitle>친구에게 메시지를 보내보세요.</Subtitle>
                        </Container>
                    }
                </RoomsContainer>
            </RoomsContainers>
        </Layout>
    )
}

export default Rooms;

const SEE_ROOMS_QUERY = gql`
    query seeRooms {
        seeRooms {
            ...RoomParts
        }
    }
    ${ROOM_FRAGMENT}
`;

const Layout = styled.div`
    height: 80vh;
    border-radius: 4px;
    border: 1px solid ${(props) => props.theme.borderColor};
    background-color: ${(props) => props.theme.bgColor};
`;

const RoomsContainers = styled.div`
    max-width: 930px;
    display: flex;
    justify-content: space-between;
`;

const RoomsContainer = styled.div`
`;

const Avatar = styled.img`
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.fontColor};
`;

const Username = styled(FatText)`
  font-size: 15px;
  margin-left: 15px;
`;

const RoomsHeader = styled.div`
  padding: 15px;
  width: 310px;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  border-right: 1px solid ${(props) => props.theme.borderColor};
  display: flex;
  align-items: center;
  justify-content: space-between;
  div{
        display: flex;
        align-items: center;
        font-size: 13px;
    }
  svg{
        font-size: 17px;
    }
`;

const RoomsUsers = styled.div`
    width: 310px;
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: auto;
    div{
        display: flex;
        align-items: center;
        font-size: 13px;
    }
    &:hover {
        background-color: ${(props) => props.theme.hoverColor};
  }
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 620px;
    margin-top: 220px;
    svg {
        font-size: 75px;
    }
`;

const Title = styled(FatLink)`
  font-size: 20px;
  text-align: center;
  margin-top: 25px;
  color: ${(props) => props.theme.fontColor};

`;

const Subtitle = styled(FatLink)`
  font-size: 15px;
  text-align: center;
  margin-top: 15px;
`;