import { gql, useMutation, useQuery } from "@apollo/client";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import useUser from "../../hooks/useUser";
import Input from "../auth/Input";
import { FatText } from "../shared";

function RoomModal({ closeModal }) {
    const navigate = useNavigate()

    const onCloseClick = () => {
        closeModal()
    }
    const { data: meData } = useUser();

    const { data } = useQuery(SEE_FOLLOEING_QUERY, {
        variables: {
            username: meData?.me?.username
        }
    })

    const [userId, setUserId] = useState("");
    console.log(typeof parseInt(userId))

    const onCheckedhandler = (e) => {
        e.preventDefault();
        setUserId(e.target.value);
    }

    const { register, setValue, handleSubmit, getValues } = useForm();
    const updateSendMessage = (cache, result) => {
        const {
            data: {
                sendMessage: { ok, id },
            },
        } = result;
        if (ok && meData) {
            const { message } = getValues();
            setValue("message", "");
            const messageObj = {
                __typename: "Message",
                id,
                payload: message,
                user: {
                    username: meData.me.username,
                    avatar: meData.me.avatar,
                },
                read: true,
            };
            const messageFragment = cache.writeFragment({
                data: messageObj,
                fragment: gql`
                    fragment NewMessage on Message {
                        id
                        payload
                        user {
                            username
                            avatar
                        }
                        read
                    }
                `
            });
            cache.modify({
                id: `Room:${data?.seeRoom?.id}`,
                fields: {
                    messages(prev) {
                        return [...prev, messageFragment];
                    },
                },
            });
            navigate(`/rooms`);
            window.location.reload();
        }
    };
    const [sendMessageMutation, { loading: sendingMessage }] = useMutation(
        SEND_MESSAGE_MUTATION,
        {
            update: updateSendMessage,
        }
    );

    const onSubmitValid = ({ message }) => {
        if (!sendingMessage) {
            sendMessageMutation({
                variables: {
                    payload: message,
                    userId: parseInt(userId)
                }
            })
        }
    };

    return (
        <>
            <ModalContainers>
                <ModalContainer>
                    <ModalHeader>
                        <ModalCloseBtn onClick={onCloseClick}>
                            <FontAwesomeIcon icon={faClose} />
                        </ModalCloseBtn>
                    </ModalHeader>
                    <ModalContext>
                        <ModalUserList>
                            {data?.seeFollowing?.following.map((user) => (
                                <Users key={user.id}>
                                    <div>
                                        <Avatar src={user.avatar} />
                                        <Username>{user.username}</Username>
                                    </div>
                                    <div>
                                        <CheckBox
                                            type="checkbox"
                                            onChange={(e) => onCheckedhandler(e)}
                                            value={user.id}
                                            bChecked={userId == user.id}
                                        />
                                        <label htmlFor={user.id}></label>
                                    </div>
                                </Users>
                            ))}
                        </ModalUserList>
                    </ModalContext>
                    <form onSubmit={handleSubmit(onSubmitValid)}>
                        <ModalInput
                            ref={register({
                                required: true
                            })}
                            name="message"
                            type="text"
                            placeholder="Write a message..." />
                    </form>
                </ModalContainer>
            </ModalContainers>

        </>
    )
}

export default RoomModal;

const SEE_FOLLOEING_QUERY = gql`
    query seeFollowing($username: String!) {
        seeFollowing(username: $username) {
            ok
            error
            following {
                id
                username
                avatar
            }
        }
    }
`;

const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage($payload: String!, $roomId: Int, $userId: Int) {
    sendMessage(payload: $payload, roomId: $roomId, userId: $userId) {
      ok
      id
    }
  }
`;

const ModalContainers = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6); 
`;

const ModalContainer = styled.div`
    border: 1px solid ${(props) => props.theme.borderColor};
    border-radius: 10px;
    background-color: ${(props) => props.theme.bgColor};
    width: 400px;
    height: 600px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
`

const ModalHeader = styled.header`
    margin-left: 88%;
    padding: 15px 0px;
`
const ModalCloseBtn = styled.button`
    background-color: inherit;
    border: none;
    svg {
        color: ${(props) => props.theme.fontColor};
    }
`;

const ModalContext = styled.main`
    overflow: auto;
`
const ModalUserList = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 auto;
`;

const Users = styled.div`
    width: 350px;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    div{
        display: flex;
        align-items: center;
        font-size: 13px;
    }
    &:hover {
        background-color: ${(props) => props.theme.hoverColor};
    }
`

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

const CheckBox = styled.input`
    height: 24px;
    width: 24px;
    border-radius: 50%;
    background-color: ${(props) => props.bChecked ? props.theme.accent : "inherit"};
    border: 1px solid ${(props) => props.bChecked ? "none" : props.theme.fontColor};
    margin-left: 80px;
`;

const ModalInput = styled(Input)`
    border-radius: 60px;
    width: 335px;
    margin: 10px 0px 15px 10px;
    border: 1.5px solid ${(props) => props.theme.borderColor};
`;

