import { gql, useMutation } from "@apollo/client";
import { faComment, faHeart, faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { faEllipsis, faHeart as SolidHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Avatar from "../Avatar";
import { FatText } from "../shared";
import Comments from "./Comments";

function Photo({ id, user, file, isLiked, likes, caption, commentNumber, comments, isMine }) {
    const updateToggleLike = (cache, result) => {
        const {
            data: {
                toggleLike: { ok },
            },
        } = result;
        if (ok) {
            const photoId = `Photo:${id}`;
            cache.modify({
                id: photoId,
                fields: {
                    isLiked(prev) {
                        return !prev;
                    },
                    likes(prev) {
                        if (isLiked) {
                            return prev - 1;
                        }
                        return prev + 1;
                    },
                },
            });
        }
    };
    const [toggleLikeMutation] = useMutation(TOGGLE_LIKE_MUTATION, {
        variables: {
            id,
        },
        update: updateToggleLike
    });

    const [feedmenu, setFeedMenu] = useState(false);

    const onMenuClick = () => {
        if (isMine) {
            setFeedMenu(feedmenu => !feedmenu);
        } else {
            alert("사용자 게시물이 아닙니다.")
        }
    }

    const updateDeletePhoto = (cache, result) => {
        const {
            data: {
                deletePhoto: { ok },
            },
        } = result;
        if (ok) {
            cache.evict({ id: `Photo:${id}` });
        }

    };
    const [deletePhotoMutation] = useMutation(DELETE_PHOTO_MUTATION, {
        variables: {
            id,
        },
        update: updateDeletePhoto,
    });
    const onDeleteClick = () => {
        deletePhotoMutation();
    };

    const [input, setInput] = useState(false);

    const { register, handleSubmit, setValue, getValues } = useForm();

    const editPhotoUpdate = (cache, { data: { editComment } }) => {
        const { caption } = getValues();
        setValue("caption", "");
        cache.writeFragment({
            id: `Photo:${id}`,
            fragment: gql`
                fragment BSName on Photo {
                    caption
                }
                `,
            data: {
                caption: caption
            }
        })
        cache.modify({
            id: cache.identify(Photo),
            fields: {
                payload(prev) {
                    return [...prev, caption]
                }

            }
        })

    };
    const [editPhotoMutation, { loading }] = useMutation(
        EDIT_PHOTO_MUTATION,
        {
            update: editPhotoUpdate,
        }
    );

    const onValid = (data) => {
        const { caption } = data;
        if (loading) {
            return;
        }
        editPhotoMutation({
            variables: {
                id,
                caption,
            }
        })
    };

    const onEditClick = () => {
        setInput(input => !input);
    }

    return (
        <PhotoContainer key={id}>
            <PhotoHeaders>
                <PhotoHeader>
                    <div>
                        <Link to={`/users/${user.username}`}>
                            <Avatar url={user.avatar} />
                        </Link>
                        <Link to={`/users/${user.username}`}>
                            <Username>{user.username}</Username>
                        </Link>
                    </div>
                </PhotoHeader>
                <PhotoHeader>
                    <MenuBar>
                        <div>
                            <Button onClick={onMenuClick}>
                                <FontAwesomeIcon icon={faEllipsis} />
                            </Button>
                        </div>
                        {feedmenu ? (
                            <>
                                <Button onClick={onEditClick}>수정하기</Button>
                                <Button onClick={onDeleteClick}>삭제하기</Button>
                            </>
                        ) : null}
                    </MenuBar>
                </PhotoHeader>
            </PhotoHeaders>
            <PhotoFile src={file} />
            <PhotoData>
                <PhotoActions>
                    <div>
                        <PhotoAction onClick={toggleLikeMutation}>
                            <FontAwesomeIcon
                                style={{ color: isLiked ? "tomato" : "inherit" }}
                                icon={isLiked ? SolidHeart : faHeart} />
                        </PhotoAction>
                        <PhotoAction>
                            <FontAwesomeIcon icon={faComment} />
                        </PhotoAction>
                        <PhotoAction>
                            <Link to={`/rooms`}>
                                <FontAwesomeIcon icon={faPaperPlane} />
                            </Link>
                        </PhotoAction>
                    </div>
                </PhotoActions>
                <Likes>{likes === 1 ? "1 like" : `${likes} likes`}</Likes>
                <CommentEditContainers>
                    {input ? (<form onSubmit={handleSubmit(onValid)}>
                        <PostCommentInput
                            name="caption"
                            ref={register({ required: true })}
                            type="text"
                            placeholder="Edit a caption..."
                        />
                    </form>) : null}
                </CommentEditContainers>
                <Comments
                    photoId={id}
                    author={user.username}
                    caption={caption}
                    commentNumber={commentNumber}
                    comments={comments}
                />

            </PhotoData>
        </PhotoContainer>
    )
}

Photo.propTypes = {
    id: PropTypes.number.isRequired,
    user: PropTypes.shape({
        avatar: PropTypes.string,
        username: PropTypes.string.isRequired,
    }),
    file: PropTypes.string.isRequired,
    isLiked: PropTypes.bool.isRequired,
    likes: PropTypes.number.isRequired,
    caption: PropTypes.string,
}

export default Photo;

const TOGGLE_LIKE_MUTATION = gql`
    mutation toggleLike($id: Int!){
        toggleLike(id: $id){
            ok
            error
        }
    }
`;

const DELETE_PHOTO_MUTATION = gql`
  mutation deletePhoto($id: Int!) {
    deletePhoto(id: $id) {
      ok
    }
  }
`;

const EDIT_PHOTO_MUTATION = gql`
  mutation editPhoto($id: Int!, $caption: String!) {
    editPhoto(id: $id, caption: $caption) {
      ok
      error
    }
  }
`;

const PhotoContainer = styled.div`
    background-color: ${(props) => props.theme.bgColor};
    border-radius: 4px;
    border: 1px solid ${(props) => props.theme.borderColor};
    margin-bottom: 60px;
    max-width: 615px;
    margin-left: 155px;
`;
const PhotoHeaders = styled.div`
    padding: 15px;
    border-bottom: 1px solid rgb(239, 239, 239);
    display: flex;
    align-items: center;
    justify-content: space-between;
    div{
        display: flex;
        align-items: center;
    }
    svg{
        font-size: 20px;
        color: ${(props) => props.theme.fontColor};
    }
`;
const PhotoHeader = styled.div``;

const MenuBar = styled.div`
    display: flex;
    flex-direction: column;
`;

const Button = styled.button`
    background-color: inherit;
    border: none;
    color: ${(props) => props.theme.fontColor};
`;

const Username = styled(FatText)`
    margin-left: 15px;
`;

const PhotoFile = styled.img`
    min-width: 100%;
    max-width: 100%;
`;

const PhotoData = styled.div`
    padding: 12px 15px;
`;

const PhotoActions = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    div{
        display: flex;
        align-items: center;
    }
    svg{
        font-size: 20px;
    }
`;

const PhotoAction = styled.div`
    margin-right: 10px;
    cursor: pointer;
`;

const Likes = styled(FatText)`
    margin-top: 15px;
    display: block;
`;

const CommentEditContainers = styled.div`
    margin: 10px 0px;
`;

const PostCommentInput = styled.input`
  width: 100%;
  &::placeholder {
    font-size: 12px;
  }
`;