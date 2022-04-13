import { gql, useQuery } from "@apollo/client";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../../fragments";
import DetailPhoto from "./DetailPhoto";

function DetailModal({ closeModal, searchId }) {
    const onCloseClick = () => {
        closeModal()
    }

    const { data: detailPhoto } = useQuery(FEED_QUERY);

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
                        {detailPhoto?.seeFeed?.map((photo) => (
                            <DetailPhoto key={photo.id} {...photo} searchId={searchId} />
                        ))}
                    </ModalContext>
                </ModalContainer>
            </ModalContainers>

        </>
    )
}

export default DetailModal;

const FEED_QUERY = gql`
    query seeFeed{
        seeFeed{
            ...PhotoFragment
            user{
                username
                avatar
            }
            caption
            createAt
            isMine
            comments{
                ...CommentFragment
            }
        }
    }
    ${PHOTO_FRAGMENT}
    ${COMMENT_FRAGMENT}
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
    border-radius: 5px;
    background-color: ${(props) => props.theme.bgColor};
    width: 930px;
    height: 620px;
    margin: 0 auto;
    margin-top: 2%;
    display: flex;
    flex-direction: column;
`

const ModalHeader = styled.header`
    margin-left: 95%;
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
`