import { gql, useQuery } from "@apollo/client";
import { faPaperPlane, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import styled from "styled-components";
import RoomModal from "../components/message/RoomModal";
import RoomsUsersList from "../components/message/RoomsUsersList";
import PageTitle from "../components/PageTitle";
import { FatLink, FatText } from "../components/shared";
import { ROOM_FRAGMENT } from "../fragments";
import useUser from "../hooks/useUser";

function Rooms() {
    const { data: meData } = useUser();
    const { data } = useQuery(SEE_ROOMS_QUERY);

    const [modalOn, setModalOn] = useState(false);
    const openModal = () => {
        setModalOn(true);
    }
    const closeModal = () => {
        setModalOn(false);
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
                        <div>
                            <RoomAction onClick={openModal}>
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </RoomAction>
                        </div>
                        {modalOn && <RoomModal closeModal={closeModal} />}
                    </RoomsHeader>
                    {data?.seeRooms.map((room) => (
                        <RoomsUsersList key={room.id} {...room} />
                    ))}
                </RoomsContainer>
                <RoomsContainer>
                    <Container>
                        <FontAwesomeIcon icon={faPaperPlane} />
                        <Title>내 메세지</Title>
                        <Subtitle>친구에게 메시지를 보내보세요.</Subtitle>
                        <MessageBtn onClick={openModal}>메시지 보내기</MessageBtn>
                    </Container>
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

const RoomsContainer = styled.div``;

const RoomAction = styled.div``;

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
        font-size: 18px;
    }
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin-right: 220px;
    margin-top: 200px;
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

const MessageBtn = styled.span`
  background-color: ${(props) => props.theme.accent};
  border-radius: 4px;
  width: 60%;
  padding: 9px;
  text-align: center;
  color: white;
  font-weight: 600;
  margin: 20px 0px 0px 40px;
`;