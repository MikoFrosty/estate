import { useEffect, useState } from "react";
import "./App.css";
import { IKContext, IKUpload, IKImage } from "imagekitio-react";

const publicKey = "public_NeO7tusUdOCIjXCAg9bE3g/Wbc8=";
const urlEndpoint = "https://ik.imagekit.io/deqylxaey";
const IP_ADDRESS = "192.168.0.78";
const PORT = "3001";
const AUTH_ENDPOINT = "/auth";
const authenticator = async () => {
  try {
    const response = await fetch(
      `http://${IP_ADDRESS}:${PORT}${AUTH_ENDPOINT}`
    );

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

function App() {
  const [id, setId] = useState<string | number>(1);
  const [title, setTitle] = useState<string>("none");
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [lastImageFilepath, setLastImageFilepath] = useState<any>(null);
  const [loadingLastId, setLoadingLastId] = useState<boolean>(true);

  useEffect(() => {
    const lastUploadedEndpoint = "/last-uploaded";
    // Get the last image uploaded
    const getLastImage = async () => {
      try {
        const response = await fetch(
          `http://${IP_ADDRESS}:${PORT}${lastUploadedEndpoint}`
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Request failed with status ${response.status}: ${errorText}`
          );
        }

        const data = await response.json();
        setLastImageFilepath(data.filePath);
        const [lastImageId, lastImageTitle] = data.name.split("-");
        lastImageId && setId(Number(lastImageId) + 1);
      } catch (error: any) {
        console.error(`Failed to get last image: ${error.message}`);
      }
    };

    getLastImage().finally(() => setLoadingLastId(false));
  }, []);

  const onUploadSuccess = (res: any) => {
    setUploading(false);
    setProgress(0);
    setId((prev) => (Number(prev) + 1).toString());
    setTitle("none");
    setLastImageFilepath(res.filePath);
  };

  const onUploadStart = (evt: any) => {
    setUploading(true);
  };

  const onUploadProgress = (progress: any) => {
    if (progress.lengthComputable) {
      const percentComplete = (progress.loaded / progress.total) * 100;
      setProgress(percentComplete);
    }
  };

  return (
    <IKContext
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      {loadingLastId && (
        <div className="overlay">
          <h2>Loading Last ID</h2>
          <div className="spinner"></div>
        </div>
      )}
      {/* Show loading spinner on overlay */}
      {uploading && (
        <div className="overlay">
          <h2>Upload Progress</h2>
          <div className="progress">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${progress}%` }}
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
        </div>
      )}
      {!uploading && (
        <h1
          style={{
            position: "sticky",
            top: 0,
            left: 0,
            width: "100%",
            textAlign: "center",
          }}
        >
          Estate Items
        </h1>
      )}
      {/* Input for ID */}
      <label className="input-label" htmlFor="id">
        Next ID
      </label>
      <input
        id="id"
        disabled
        type="number"
        pattern="[0-9]*"
        placeholder="Starting ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      {/* Input for Title */}
      <label className="input-label" htmlFor="title">
        Next Title
      </label>
      <input
        id="title"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {/* Filename Preview */}
      {/* <p>
        FILE NAME PREVIEW: {id}-{title}
      </p> */}
      {/* Image Upload */}
      {id && title && (
        <label className="custom-file-upload">
          <IKUpload
            fileName={`${id}-${title}.jpg`}
            useUniqueFileName={true}
            onError={console.error}
            onUploadStart={onUploadStart}
            onSuccess={onUploadSuccess}
            onUploadProgress={onUploadProgress}
            customMetadata={{ id: Number(id), title }}
          />
          Upload Next Image
        </label>
      )}
      {/* Image Preview */}
      {lastImageFilepath && (
        <>
          <h2>Last Image Preview</h2>
          <IKImage
            urlEndpoint={urlEndpoint}
            path={lastImageFilepath || ""}
            width="250"
          />
          {/* <p>
            <strong>META DATA</strong>
            {JSON.stringify(lastImageResponse)}
          </p> */}
        </>
      )}
    </IKContext>
  );
}

export default App;
