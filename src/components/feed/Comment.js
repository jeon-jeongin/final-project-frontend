import styled from "styled-components";
import { FatText } from "../shared";
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

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
    return (
        <CommentContainers>
            <CommentContainer>
                <Link to={`/users/${author}`}>
                    <FatText>{author}</FatText>
                </Link>
                <CommentCaption>
                    {payload.split(" ").map((word, index) =>
                        /#[\w]+/.test(word) ? (
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
                    <Button onClick={onDeleteClick}>
                        <FontAwesomeIcon icon={faTrashCan} />
                    </Button>
                )
                    : null}
            </CommentContainer>
        </CommentContainers>
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

const CommentContainers = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 7px;
`;
const CommentContainer = styled.div``;

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