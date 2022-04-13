import lightLogo from '../images/lightLogo.svg';
import darkLogo from '../images/darkLogo.svg';
import routes from '../routes';
import AuthLayout from '../components/auth/AuthLayout';
import Button from '../components/auth/Button';
import Input from '../components/auth/Input';
import FormBox from '../components/auth/FormBox';
import ButtomBox from '../components/auth/ButtomBox';
import PageTitle from '../components/PageTitle';
import { useForm } from 'react-hook-form';
import FormError from '../components/auth/FormError';
import { gql, useMutation, useReactiveVar } from '@apollo/client';
import { darkModeVar, logUserIn } from '../apollo';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

function Login() {
    const darkMode = useReactiveVar(darkModeVar);
    const location = useLocation();
    const { register, handleSubmit, errors, formState, getValues, setError, clearErrors } = useForm({
        mode: "onChange",
        defaultValues: {
            username: location?.state?.username || "",
            password: location?.state?.password || "",
        }
    });
    const onCompleted = (data) => {
        const {
            login: { ok, error, token },
        } = data;
        if (!ok) {
            return setError("result", {
                message: error,
            });
        }
        if (token) {
            logUserIn(token);
        }
        window.location.reload();
    };
    const [login, { loading }] = useMutation(LOGIN_MUTATION, {
        onCompleted,
    });
    const onSubmitValid = (data) => {
        if (loading) {
            return;
        }
        const { username, password } = getValues();
        login({
            variables: { username, password },
        });
    };
    const clearLoginError = () => {
        clearErrors("result");
    }
    return (
        <AuthLayout>
            <PageTitle title="Login" />
            <FormBox>
                <div>
                    {
                        darkMode ?
                            (<img width="150px" height="30px" src={darkLogo} alt="굿즈 로고" />)
                            : (<img width="150px" height="30px" src={lightLogo} alt="굿즈 로고" />)
                    }
                </div>
                <Notification>{location?.state?.message}</Notification>
                <form onSubmit={handleSubmit(onSubmitValid)}>
                    <Input
                        ref={register({
                            required: "사용자 아이디는 필수입니다.",
                            minLength: {
                                value: 5,
                                message: "아이디는 5글자를 초과해야합니다.",
                            },
                        })}
                        onChange={clearLoginError}
                        name="username"
                        type="text"
                        placeholder="Username"
                        hasError={Boolean(errors?.username?.message)}
                    />
                    <FormError message={errors?.username?.message} />
                    <Input
                        ref={register({
                            required: "비밀번호는 필수입니다.",
                        })}
                        onChange={clearLoginError}
                        name="password"
                        type="password"
                        placeholder="Password"
                        hasError={Boolean(errors?.password?.message)}
                    />
                    <FormError message={errors?.password?.message} />
                    <Button
                        type="submit"
                        value={loading ? "Loading..." : "Log in"}
                        disabled={!formState.isValid || loading} />
                    <FormError message={errors?.result?.message} />
                </form>
            </FormBox>
            <ButtomBox cta="계정이 없으신가요?" linkText="Sign up" link={routes.signUp} />
        </AuthLayout>
    )
}
export default Login;

const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
      error
    }
  }
`;

const Notification = styled.div`
  margin-top: 5px;
  color: #4d88d8;
`;