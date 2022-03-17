import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Input from "../components/auth/Input";
import Messages from "../components/message/Messages";
import { FatText } from "../components/shared";
import useUser from "../hooks/useUser";

function Room({ users, id }) {
    const { data: meData } = useUser();

    const { data, subscribeToMore } = useQuery(ROOM_QUERY, {
        variables: {
            id
        }
    });

    const messages = data?.seeRoom?.messages;
    const notMe = users.find((user) => user.username !== meData?.me?.username);

    const client = useApolloClient();
    const updateQuery = (prevQuery, options) => {
        const {
            subscriptionData: {
                data: { roomUpdates: message },
            },
        } = options;
        if (message.id) {
            const incomingMessage = client.cache.writeFragment({
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
              `,
                data: message,
            });
            client.cache.modify({
                id: `Room:${data?.seeRoom?.id}`,
                fields: {
                    messages(prev) {
                        const existingMessage = prev.find(
                            (aMessage) => aMessage.__ref === incomingMessage.__ref
                        );
                        if (existingMessage) {
                            return prev;
                        }
                        return [...prev, incomingMessage];
                    },
                },
            });
        }
    };

    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        if (data?.seeRoom && !subscribed) {
            subscribeToMore({
                document: ROOM_UPDATES,
                variables: {
                    id: data?.seeRoom?.id,
                },
                updateQuery,
            });
            setSubscribed(true)
        }
    }, [data, subscribed]);

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
                    roomId: id,
                }
            })
        }
    };

    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "auto" })
        }
    }
    useEffect(scrollToBottom, [messages]);

    return (
        <>
            {data ?
                <RoomContainer>
                    <RoomHeader>
                        <div>
                            <Link to={`/users/${notMe?.username}`}>
                                <Avatar src={notMe?.avatar} />
                            </Link>
                            <Link to={`/users/${notMe?.username}`}>
                                <Username>{notMe?.username}</Username>
                            </Link>
                        </div>
                    </RoomHeader>
                    <RoomContext>
                        {messages.map((message) => (
                            <RoomText key={message.id} outGoing={message?.user?.username === meData?.me?.username}>
                                <Messages
                                    avatar={message.user.avatar}
                                    payload={message.payload}
                                />
                            </RoomText>
                        )
                        )}
                        {messagesEndRef ? <div ref={messagesEndRef} /> : null}

                    </RoomContext>
                    <form onSubmit={handleSubmit(onSubmitValid)}>
                        <DirectInput
                            ref={register({
                                required: true
                            })}
                            name="message"
                            type="text"
                            placeholder="Write a message..." />
                    </form>
                </RoomContainer>
                : null}
        </>
    )
}

export default Room;

const ROOM_QUERY = gql`
  query seeRoom($id: Int!) {
    seeRoom(id: $id) {
      id
      messages {
        id
        payload
        user {
          username
          avatar
        }
        read
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

const ROOM_UPDATES = gql`
  subscription roomUpdates($id: Int!) {
    roomUpdates(id: $id) {
      id
      payload
      user {
        username
        avatar
      }
      read
    }
  }
`;

const RoomContainer = styled.div`
`;

const Avatar = styled.img`
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.fontColor};
`;

const Username = styled(FatText)`
  font-size: 15px;
  margin-left: 15px;
`;

const RoomHeader = styled.div`
  padding: 19px;
  width: 620px;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
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

const RoomContext = styled.div`
    padding: 14px;
    height: 62vh;
    overflow: auto;
`;
const RoomText = styled.div`
    padding: 7px;
    color: ${(props) => props.theme.fontColor};
    display: flex;
    align-items: center;
    flex-direction: ${(props) => props.outGoing ? "row-reverse" : "row"};
`;

const DirectInput = styled(Input)`
    border-radius: 60px;
    width: 95%;
    margin: 10px 0px 0px 10px;
    border: 1px solid ${(props) => props.theme.borderColor};
`;
