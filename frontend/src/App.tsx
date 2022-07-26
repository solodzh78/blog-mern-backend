import Container from "@mui/material/Container";
import { useEffect } from "react";
import { Route, Routes } from 'react-router-dom';

import { Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login } from "./pages";
import { fetchAuthMe, selectIsAuth } from "./store/slices/auth";
import { useAppDispatch, useAppSelector } from "./store/store";

function App() {
    const dispatch = useAppDispatch();
    const isAuth = useAppSelector(selectIsAuth);

    useEffect(() => {
        dispatch(fetchAuthMe());
    }, []);

    return (
        <>
            <Header />
            <Container maxWidth="lg">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/posts/:id" element={<FullPost />} />
                    <Route path="/addpost" element={<AddPost />} />
                    <Route path="/posts/:id/edit" element={<AddPost />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Registration />} />
                </Routes>
            </Container>
        </>
    );
}

export default App;
