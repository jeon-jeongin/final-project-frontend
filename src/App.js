import { ApolloProvider, useReactiveVar } from "@apollo/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { client, darkModeVar, isLoggedInVar } from "./apollo";
import routes from "./routes";
import EditProfile from "./screens/EditProfile";
import Home from "./screens/Home";
import Login from "./screens/Login";
import Rooms from "./screens/Rooms";
import Profile from "./screens/Profile";
import SignUp from "./screens/SignUp";
import UploadFeed from "./screens/UploadFeed";
import { darkTheme, GlobalStyles, lightTheme } from "./styles";
import Room from "./screens/Room";
import Search from "./screens/Search";
import Layout from "./components/Layout";

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const darkMode = useReactiveVar(darkModeVar);
  return (
    <ApolloProvider client={client}>
      <HelmetProvider>
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
          <GlobalStyles />
          <Router>
            <Routes>
              <Route exact path={routes.home} element={isLoggedIn ? <Layout><Home /></Layout> : <Layout><Login /></Layout>} />
              <Route path={routes.signUp} element={!isLoggedIn ? <Layout><SignUp /></Layout> : null} />
              <Route path={`/users/:username`} element={<Layout><Profile /></Layout>} />
              <Route path={`/users/:username/editProfile`} element={<Layout><EditProfile /></Layout>} />
              <Route path={`/search`} element={<Layout><Search /></Layout>} />
              <Route path={`/uploadFeed`} element={<Layout><UploadFeed /></Layout>} />
              <Route path={`/rooms`} element={<Layout><Rooms /></Layout>} />
              <Route path={`/rooms/:username`} element={<Layout><Room /></Layout>} />
            </Routes>
          </Router>
        </ThemeProvider>
      </HelmetProvider>
    </ApolloProvider>
  );
}

export default App;