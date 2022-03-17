import styled from "styled-components";
import { FatText } from "../shared";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";

function Comment({ id, photoId, isMine, author, payload }) {
    const updateDeleteComment = (cache, result) => {
        const {
            data: {
                deleteComment: { ok },
            },
        } = result;
        if (ok) {
            cache.evict({ id: `Comment:${id}` });
            cache.modify({
                id: `Photo:${photoId}`,
                fields: {
                    commentNumber(prev) {
                        return prev - 1;
                    },
                },
            });
        }
    };
    const [deleteCommentMutation] = useMutation(DELETE_COMMENT_MUTATION, {
        variables: {
            id,
        },
        update: updateDeleteComment,
    });
    const onDeleteClick = () => {
        deleteCommentMutation();
    };

    const [input, setInput] = useState(false);

    const { register, handleSubmit, setValue, getValues } = useForm();

    const editCommentUpdate = (cache, { data: { editComment } }) => {
        const { payload } = getValues();
        setValue("payload", "");
        cache.writeFragment({
            id: `Comment:${id}`,
            fragment: gql`
                fragment BSName on Comment {
                    payload
                }
                `,
            data: {
                payload: payload
            }
        })
        cache.modify({
            id: cache.identify(Comment),
            fields: {
                payload(prev) {
                    return [...prev, payload]
                }

            }
        })

    };
    const [editCommentMutation, { loading }] = useMutation(
        EDIT_COMMENT_MUTATION,
        {
            update: editCommentUpdate,
        }
    );

    const onValid = (data) => {
        const { payload } = data;
        if (loading) {
            return;
        }
        editCommentMutation({
            variables: {
                id,
                payload,
            }
        })
    };

    const onEditClick = () => {
        setInput(input => !input);
    }

    return (
        <>
            <CommentContainers>
                <CommentContainer>
                    <Link to={`/users/${author}`}>
                        <FatText>{author}</FatText>
                    </Link>
                    <CommentCaption>
                        {payload.split(" ").map((word, index) =>
                            /#/.test(word) ? (

                                <React.Fragment key={index}>
                                    <Link to={`/hashtags/${word}`}>{word}</Link>{" "}
                                </React.Fragment>
                            ) : (
                                <React.Fragment key={index}>{word} </React.Fragment>
                            )
                        )}
                    </CommentCaption>
                </CommentContainer>
                <CommentContainer>
                    {isMine ? (
                        <>
                            <Button onClick={onEditClick}>
                                <FontAwesomeIcon icon={faEdit} />
                            </Button>
                            <Button onClick={onDeleteClick}>
                                <FontAwesomeIcon icon={faTrashCan} />
                            </Button>
                        </>
                    )
                        : null}
                </CommentContainer>
            </CommentContainers>
            <CommentEditContainers>
                {input ? (<form onSubmit={handleSubmit(onValid)}>
                    <PostCommentInput
                        name="payload"
                        ref={register({ required: true })}
                        type="text"
                        placeholder="Edit a comment..."
                    />
                </form>) : null}
            </CommentEditContainers>
        </>
    );
}

export default Comment;

Comment.propTypes = {
    isMine: PropTypes.bool,
    id: PropTypes.number,
    photoId: PropTypes.number,
    author: PropTypes.string.isRequired,
    payload: PropTypes.string.isRequired,
};

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($id: Int!) {
    deleteComment(id: $id) {
      ok
    }
  }
`;

const EDIT_COMMENT_MUTATION = gql`
  mutation editComment($id: Int!, $payload: String!) {
    editComment(id: $id, payload: $payload) {
      ok
      error
    }
  }
`;


const CommentContainers = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 7px;
`;
const CommentContainer = styled.div``;

const CommentEditContainers = styled.div`
    margin-bottom: 7px;
`;

const CommentCaption = styled.span`
    margin-left: 10px;
    a {
        background-color: inherit;
        color: ${(props) => props.theme.accent};
        cursor: pointer;
        &:hover {
        text-decoration: underline;
        }
    }
`;

const Button = styled.button`
    background-color: inherit;
    border: none;
    svg{
        font-size: 15px;
        color: ${(props) => props.theme.fontColor};
    }
`;

const PostCommentInput = styled.input`
  width: 100%;
  &::placeholder {
    font-size: 12px;
  }
`;