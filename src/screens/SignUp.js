import lightLogo from '../images/lightLogo.svg';
import darkLogo from '../images/darkLogo.svg';
import routes from '../routes';
import AuthLayout from '../components/auth/AuthLayout';
import Button from '../components/auth/Button';
import Input from '../components/auth/Input';
import FormBox from '../components/auth/FormBox';
import ButtomBox from '../components/auth/ButtomBox';
import styled from 'styled-components';
import { FatLink } from '../components/shared';
import PageTitle from '../components/PageTitle';
import { useForm } from 'react-hook-form';
import { gql, useMutation, useReactiveVar } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import FormError from '../components/auth/FormError';
import { darkModeVar } from '../apollo';

function SignUp() {
    const darkMode = useReactiveVar(darkModeVar);
    const navigate = useNavigate()
    const { register, handleSubmit, errors, formState, getValues, setError, clearErrors } = useForm({
        mode: "onChange",
    });
    const onCompleted = (data) => {
        const { username, password } = getValues();
        const {
            createAccount: { ok, error },
        } = data;
        if (!ok) {
            return setError("result", {
                message: error,
            });
        }
        navigate(routes.home, { state: { message: "회원가입이 완료되었습니다.", username, password } });
    };
    const [createAccount, { loading }] = useMutation(CREATE_ACCOUNT_MUTATION, { onCompleted })
    const onSubmitValid = (data) => {
        if (loading) {
            return;
        }
        createAccount({
            variables: {
                ...data,
            }
        })
    };
    const clearLoginError = () => {
        clearErrors("result");
    }
    return (
        <AuthLayout>
            <PageTitle title="Sign up" />
            <FormBox>
                <HeaderContainer>
                    {
                        darkMode ?
                            (<img width="150px" height="30px" src={darkLogo} alt="굿즈 로고" />)
                            : (<img width="150px" height="30px" src={lightLogo} alt="굿즈 로고" />)
                    }
                    <Subtitle>
                        Sign up to see photos and information from your friends.
                    </Subtitle>
                </HeaderContainer>
                <form onSubmit={handleSubmit(onSubmitValid)}>
                    <Input
                        ref={register({
                            required: "이름은 필수입니다."
                        })}
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
                        ref={register({
                            required: "이메일은 필수입니다."
                        })}
                        onChange={clearLoginError}
                        name="email"
                        type="text"
                        placeholder="Email"
                    />
                    <FormError message={errors?.email?.message} />
                    <Input
                        ref={register({
                            required: "아이디는 필수입니다.",
                            minLength: {
                                value: 5,
                                message: "아이디는 5글자를 초과해야합니다.",
                            },
                        })}
                        onChange={clearLoginError}
                        name="username"
                        type="username"
                        placeholder="Username"
                    />
                    <FormError message={errors?.username?.message} />
                    <Input
                        ref={register({
                            required: "비밀번호는 필수입니다."
                        })}
                        onChange={clearLoginError}
                        name="password"
                        type="password"
                        placeholder="Password"
                    />
                    <FormError message={errors?.password?.message} />
                    <Button
                        type="submit"
                        value={loading ? "Loading..." : "Sign up"}
                        disabled={!formState.isValid || loading} />
                    <FormError message={errors?.result?.message} />
                </form>
            </FormBox>
            <ButtomBox cta="계정이 있으신가요?" linkText="Log in" link={routes.home} />
        </AuthLayout>
    )
}
export default SignUp;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Subtitle = styled(FatLink)`
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
`;

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $firstName: String!
    $lastName: String
    $username: String!
    $email: String!
    $password: String!
  ) {
    createAccount(
      firstName: $firstName
      lastName: $lastName
      username: $username
      email: $email
      password: $password
    ) {
      ok
      error
    }
  }
`;