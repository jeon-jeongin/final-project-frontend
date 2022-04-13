import { gql, useQuery } from "@apollo/client";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import styled from "styled-components";
import RoomModal from "../components/message/RoomModal";
import RoomsUsersList from "../components/message/RoomsUsersList";
import RoomUser from "../components/message/RoomUser";
import PageTitle from "../components/PageTitle";
import { FatText } from "../components/shared";
import { ROOM_FRAGMENT } from "../fragments";
import useUser from "../hooks/useUser";

function Room() {
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
                    {data?.seeRooms.map((room) => (
                        <RoomUser key={room.id} {...room} />
                    ))}
                </RoomsContainer>
            </RoomsContainers>
        </Layout>
    )
}

export default Room;

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