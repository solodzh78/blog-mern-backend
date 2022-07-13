import React from "react";
import ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter } from 'react-router-dom';

import App from "./App";

import "./index.scss";
import { ThemeProvider } from "@mui/material";
import { store } from './store/store';
import { Provider } from 'react-redux'
import { theme } from "./theme";

const rootElement = document.getElementById('root');

if (rootElement) {

    const root = ReactDOM.createRoot(rootElement);
    root.render(
        // <React.StrictMode>
        <>
            <CssBaseline />
            <ThemeProvider theme={theme}>
                <BrowserRouter>
                    <Provider store={store}>
                        <App />
                    </Provider>
                </BrowserRouter>
            </ThemeProvider>
        </>
        // </React.StrictMode>
    );

}
