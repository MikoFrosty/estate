import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import Upload from "./Upload.tsx";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { IKContext } from "imagekitio-react";

export const PUBLIC_KEY = "public_NeO7tusUdOCIjXCAg9bE3g/Wbc8=";
export const URL_ENDPOINT = "https://ik.imagekit.io/deqylxaey";
export const BACKEND_BASE_URL = "https://obriensearch.herokuapp.com";
const AUTH_ENDPOINT = "/auth";

const authenticator = async () => {
  try {
    const response = await fetch(BACKEND_BASE_URL + AUTH_ENDPOINT);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error: any) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <IKContext
      publicKey={PUBLIC_KEY}
      urlEndpoint={URL_ENDPOINT}
      authenticator={authenticator}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </BrowserRouter>
    </IKContext>
  </React.StrictMode>
);
