import AuthLayout from '../components/auth/AuthLayout';
import Button from '../components/auth/Button';
import Input from '../components/auth/Input';
import FormBox from '../components/auth/FormBox';
import styled from 'styled-components';
import { FatLink } from '../components/shared';
import PageTitle from '../components/PageTitle';
import { useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import FormError from '../components/auth/FormError';
import useUser from '../hooks/useUser';
import Avatar from '../components/Avatar';
import routes from '../routes';
import { useState } from 'react';

function EditProfile() {
    const { data: userData } = useUser();
    const navigate = useNavigate()

    const { register, handleSubmit, errors, formState, setError, clearErrors } = useForm({
        mode: "onChange",
        defaultValues: {
            firstName: userData?.me?.firstName,
            lastName: userData?.me?.lastName,
            email: userData?.me?.email,
            username: userData?.me?.username,
            password: userData?.me?.password,
        }
    });

    const onCompleted = (data) => {
        const {
            editProfile: { ok, error },
        } = data;
        if (!ok) {
            return setError("result", {
                message: error,
            });
        }
        navigate(routes.home);
    };

    const [editProfile, { loading }] = useMutation(EDIT_PROFILE_MUTATION, { onCompleted })

    const onSubmitValid = (data) => {
        console.log(data)
        const avatar = data.avatar[0];
        if (loading) {
            return;
        }

        editProfile({
            variables: {
                ...data,
                avatar
            }
        })
    };
    const clearLoginError = () => {
        clearErrors("result");
    }

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
        <AuthLayout>
            <PageTitle title="Edit Profile" />
            <FormBox>
                <HeaderContainer>
                    <Subtitle>
                        회원 정보를 수정해주세요.
                    </Subtitle>
                </HeaderContainer>
                <form onSubmit={handleSubmit(onSubmitValid)}>
                    <AvatarInput>
                        {
                            imageSrc ?
                                <label htmlFor="file_input">
                                    <EditAvatar src={imageSrc} alt="preview-img" />
                                </label>
                                :
                                <label htmlFor="file_input">
                                    <Avatar
                                        lg url={userData?.me?.avatar}
                                    />
                                </label>
                        }
                        <InputPhoto
                            ref={register}
                            type='file'
                            accept='image/jpg,image/png,image/jpeg'
                            name='avatar'
                            id="file_input"
                            onChange={(e) => { encodeFileToBase64(e.target.files[0]); }}
                        />
                    </AvatarInput>
                    <Input
                        ref={register}
                        onChange={clearLoginError}
                        name="firstName"
                        type="text"
                        placeholder="First Name"
                    />
                    <FormError message={errors?.firstName?.message} />
                    <Input
                        ref={register}
                        name="lastName"
                        type="text"
                        placeholder="Last Name"
                    />
                    <Input
                        ref={register}
                        onChange={clearLoginError}
                        name="email"
                        type="text"
                        placeholder="Email"
                    />
                    <FormError message={errors?.email?.message} />
                    <Input
                        ref={register}
                        onChange={clearLoginError}
                        name="username"
                        type="username"
                        placeholder="Username"
                    />
                    <FormError message={errors?.username?.message} />
                    <Input
                        ref={register}
                        onChange={clearLoginError}
                        name="password"
                        type="password"
                        placeholder="Password"
                    />
                    <FormError message={errors?.password?.message} />
                    <Button
                        type="submit"
                        value={loading ? "Loading..." : "Edit"}
                        disabled={!formState.isValid || loading} />
                    <FormError message={errors?.result?.message} />
                    <StyledLink to={`/users/${userData?.me?.username}`}>
                        <Button type="button" value={"Cancel"} />
                    </StyledLink>
                </form>
            </FormBox>
        </AuthLayout>
    )
}
export default EditProfile;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Subtitle = styled(FatLink)`
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
`;

const AvatarInput = styled.div`
    margin-bottom: 10px;
`;

const EditAvatar = styled.img`
  height: 160px;
  width: 160px;
  border-radius: 50%;
`;

const StyledLink = styled(Link)`
    width: 100%;
`;

const InputPhoto = styled.input`
  display: none;
`;

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile(
    $firstName: String
    $lastName: String
    $username: String
    $email: String
    $password: String
    $bio: String
    $avatar: Upload
  ) {
    editProfile(
        firstName: $firstName
        lastName: $lastName
        username: $username
        email: $email
        password: $password
        bio: $bio
        avatar: $avatar
    ) {
      ok
      error
    }
  }
`;
