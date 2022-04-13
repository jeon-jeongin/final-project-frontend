import useUser from "../../hooks/useUser";
import { FatText } from "../shared";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

function RoomsUsersList({ users, id }) {
    const { data: meData } = useUser("");
    const notMe = users.find((user) => user.username !== meData?.me?.username);

    const navigate = useNavigate();

    const updateDeleteRoom = (cache, result) => {
        const {
            data: {
                deleteRoom: { ok },
            },
        } = result;
        if (ok) {
            cache.evict({ id: `Room:${id}` });
        }
        navigate(`/rooms`)
    };
    const [deleteRoomMutation] = useMutation(DELETE_ROOM_MUTATION, {
        variables: {
            id,
        },
        update: updateDeleteRoom,
    });
    const onDeleteClick = () => {
        if (window.confirm("채팅방에서 나가시겠습니까?")) {
            alert("나가기를 하면 대화내용이 모두 삭제되고 채팅 목록에서도 삭제 됩니다.");
            deleteRoomMutation();
        } else {
            alert("취소합니다");
        }
    };
    return (
        <>
            {notMe ?
                <RoomsUsers>
                    <Link to={`/rooms/${notMe?.username}`} >
                        <div>
                            <Avatar src={notMe?.avatar} />
                            <Username>{notMe?.username}</Username>
                        </div>
                    </Link>
                    <div>
                        <Button onClick={onDeleteClick}>나가기</Button>
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
        </>
    )
}

export default RoomsUsersList;

const DELETE_ROOM_MUTATION = gql`
  mutation deleteRoom($id: Int!) {
    deleteRoom(id: $id) {
      ok
    }
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

const Button = styled.span`
  background-color: ${(props) => props.theme.accent};
  border-radius: 4px;
  padding: 8px;
  text-align: center;
  color: white;
  font-weight: 600;
  font-size: 12px;
`;