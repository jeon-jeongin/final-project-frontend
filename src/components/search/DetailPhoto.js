import { gql, useMutation } from "@apollo/client";
import { faComment, faHeart, faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { faHeart as SolidHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Avatar from "../Avatar";
import Comments from "../feed/Comments";
import { FatText } from "../shared";

function DetailPhoto({ id, user, file, isLiked, likes, caption, commentNumber, comments, isMine, searchId }) {
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
    return (
        <>
            {id === parseInt(searchId) ?
                <PhotoContainers>
                    <PhotoContainer>
                        <PhotoFile src={file} />
                    </PhotoContainer>
                    <PhotoContainer>
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
                        </PhotoHeaders>
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
                            <Comments
                                photoId={id}
                                author={user.username}
                                caption={caption}
                                commentNumber={commentNumber}
                                comments={comments}
                            />
                        </PhotoData>
                    </PhotoContainer>
                </PhotoContainers>
                : null}
        </>
    )
}

export default DetailPhoto;

const TOGGLE_LIKE_MUTATION = gql`
    mutation toggleLike($id: Int!){
        toggleLike(id: $id){
            ok
            error
        }
    }
`;

const PhotoContainers = styled.div`
    display: flex;
    justify-content: space-between;
`

const PhotoContainer = styled.div`

`
const PhotoFile = styled.img`
    max-width: 100%;
    width: 550px;
    height: 570px;
`;

const PhotoHeaders = styled.div`
    width: 380px;
    padding: 15px;
    border-bottom: 1px solid ${(props) => props.theme.borderColor};
    display: flex;
    align-items: center;
    justify-content: space-between;
    div{
        display: flex;
        align-items: center;
    }
`;

const PhotoHeader = styled.div``;


const Username = styled(FatText)`
    margin-left: 15px;
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
    font-size: 13px;
`;