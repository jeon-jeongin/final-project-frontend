import { gql, useMutation } from "@apollo/client";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/auth/Button";
import Avatar from "../components/Avatar";
import PageTitle from "../components/PageTitle";
import { FatText } from "../components/shared";
import { FEED_PHOTO } from "../fragments";
import useUser from "../hooks/useUser";
import routes from "../routes";

function UploadFeed() {
    const { data: userData } = useUser();
    const navigate = useNavigate()

    const updateUploadPhoto = (cache, result) => {
        const {
            data: { uploadPhoto },
        } = result;
        if (uploadPhoto.id) {
            cache.modify({
                id: "ROOT_QUERY",
                fields: {
                    seeFeed(prev) {
                        return [uploadPhoto, ...prev];
                    },
                },
            });
            navigate(routes.home);
        }
    };

    const [uploadPhotoMutation, { loading }] = useMutation(
        UPLOAD_PHOTO_MUTATION,
        {
            update: updateUploadPhoto,
        }
    );

    const { register, handleSubmit } = useForm();

    const onSubmitValid = (data) => {

        const file = data.file[0];
        const caption = data.caption;
        if (loading) {
            return;
        }

        uploadPhotoMutation({
            variables: {
                file,
                caption
            }
        })
    };

    const [imageSrc, setImageSrc] = useState('');

    const encodeFileToBase64 = (fileBlob) => {
        const reader = new FileReader();
        reader.readAsDataURL(fileBlob);
        return new Promise((resolve) => {
            reader.onload = () => {
                setImageSrc(reader.result);
                resolve();
            };
        });
    };

    return (
        <Layout>
            <PageTitle title="UploadFeed" />
            <form onSubmit={handleSubmit(onSubmitValid)}>
                <UploadContainers>
                    <UploadContainer>
                        <UploadPhoto>
                            {
                                imageSrc ?
                                    <img src={imageSrc} alt="preview-img" />
                                    :
                                    <label htmlFor="file_input">
                                        <FontAwesomeIcon icon={faCamera} />
                                    </label>
                            }
                            <InputPhoto
                                ref={register}
                                type='file'
                                accept='image/jpg,image/png,image/jpeg'
                                name="file"
                                id="file_input"
                                onChange={(e) => { encodeFileToBase64(e.target.files[0]); }}
                            />
                        </UploadPhoto>
                    </UploadContainer>
                    <UploadContainer>
                        <UploadComment>
                            <CommentHeader>
                                <div>
                                    <Avatar url={userData?.me?.avatar} />
                                    <Username>{userData?.me?.username}</Username>
                                </div>
                                <div>
                                    <label htmlFor="file_input">
                                        <FontAwesomeIcon icon={faCamera} />
                                    </label>
                                </div>
                            </CommentHeader>
                            <CommentData
                                cols="50"
                                rows="10"
                                ref={register}
                                name="caption"
                                placeholder="Write Contents..."
                            />
                            <FeedButton
                                type="submit"
                                value={loading ? "Loading..." : "Submit"}
                            />
                        </UploadComment>
                    </UploadContainer>
                </UploadContainers>
            </form>
        </Layout>
    );
}


export default UploadFeed;

const UPLOAD_PHOTO_MUTATION = gql`
  mutation uploadPhoto($file: Upload!, $caption: String) {
    uploadPhoto(file: $file, caption: $caption) {
      ...FeedPhoto
    }
  }
  ${FEED_PHOTO}
`;

const Layout = styled.div`
    border-radius: 4px;
    border: 1px solid ${(props) => props.theme.borderColor};
    background-color: ${(props) => props.theme.bgColor};
`;

const UploadContainers = styled.div`
    max-width: 930px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const UploadContainer = styled.div`
`;

const UploadPhoto = styled.div`
  padding: 15px;
  width: 605px;
  img{
      width: 100%;
  }
  svg{
        display: flex;
        margin: auto;
        font-size: 85px;
    }
`;
const InputPhoto = styled.input`
  display: none;
`;

const UploadComment = styled.div`
  width: 310px;
  border-left: 1px solid ${(props) => props.theme.borderColor};
`;

const CommentHeader = styled.div`
  padding: 15px;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  display: flex;
  align-items: center;
  justify-content: space-between;
  div{
        display: flex;
        align-items: center;
    }
  svg{
        font-size: 17px;
    }
`;

const Username = styled(FatText)`
  font-size: 15px;
  margin-left: 15px;
`;

const CommentData = styled.textarea`
  width: 306px;
  height: 60vh;
  border: none;
  padding: 15px;
  &:focus{
    outline: 0.5px solid ${(props) => props.theme.fontColor};
  }
`;

const FeedButton = styled(Button)`
    margin-top: 0px;
    cursor: pointer;
`;
