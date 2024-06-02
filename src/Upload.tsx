import { useEffect, useState } from "react";
import "./App.css";
import { IKUpload, IKImage } from "imagekitio-react";
import { BACKEND_BASE_URL, URL_ENDPOINT } from "./main";

export default function Upload() {
  const [id, setId] = useState<string | number>(1);
  const [title, setTitle] = useState<string>("none");
  const [description, setDescription] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [lastImageFilepath, setLastImageFilepath] = useState<any>(null);
  const lastImageId = lastImageFilepath?.split("/")?.pop()?.split("-")[0];
  const lastImageTitle = lastImageFilepath
    ?.split("/")
    ?.pop()
    ?.split("-")[1]
    .split("_")
    .slice(0, -1)
    .join(" ");
  const [loadingLastId, setLoadingLastId] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const lastUploadedEndpoint = "/last-uploaded";
    // Get the last image uploaded
    const getLastImage = async () => {
      try {
        const response = await fetch(BACKEND_BASE_URL + lastUploadedEndpoint);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Request failed with status ${response.status}: ${errorText}`
          );
        }

        const data = await response.json();
        setLastImageFilepath(data.filePath);
        const [lastImageId] = data.name.split("-");
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
    setDescription("");
    setLastImageFilepath(res.filePath);
  };

  const onUploadStart = () => {
    setUploading(true);
    setErrorMessage(null);
  };

  const onUploadProgress = (progress: any) => {
    if (progress.lengthComputable) {
      const percentComplete = (progress.loaded / progress.total) * 100;
      setProgress(percentComplete);
    }
  };

  const onUploadError = (err: any) => {
    setUploading(false);
    setProgress(0);
    console.log("error", err.message);
    setErrorMessage(err.message);
  };

  const getMetaData = () => {
    type MetaData = {
      id: number;
      title: string;
      description?: string;
    };
    const metaData: MetaData = {
      id: Number(id),
      title,
    };
    if (description) {
      metaData["description"] = description;
    }
    return metaData;
  };

  return (
    <>
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
        <>
          {" "}
          <h1
            style={{
              fontSize: "2rem",
            }}
          >
            Grandma's Estate
          </h1>
          <p>
            Enter title and additional notes (optional), then select or capture
            a photo to upload.
          </p>
        </>
      )}
      {/* Input for ID */}
      {/* <label className="input-label" htmlFor="id" style={{ marginBottom: 10 }}>
        Next ID: {id}
      </label> */}
      {/* <input
        id="id"
        disabled
        type="number"
        pattern="[0-9]*"
        placeholder="Starting ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      /> */}
      {/* Input for Title */}
      <label className="input-label" htmlFor="title">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingRight: "15px",
          }}
        >
          <span>Next Title</span>
          <span style={{ color: "green" }}>Next ID: {id}</span>
        </div>
      </label>
      <input
        id="title"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {/* Input for Notes */}
      <label className="input-label" htmlFor="description">
        Notes
      </label>
      <textarea
        id="description"
        placeholder="Notes"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
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
            onError={onUploadError}
            onUploadStart={onUploadStart}
            onSuccess={onUploadSuccess}
            onUploadProgress={onUploadProgress}
            customMetadata={getMetaData()}
            folder="/grandma"
          />
          Upload Next Item
        </label>
      )}
      {/* horizontal rule */}
      <hr style={{ margin: "40px 0", width: "100%" }} />
      {/* Image Preview */}
      {lastImageFilepath && (
        <>
          <div
            style={{
              marginTop: 24,
              border: "1px solid black",
              borderRadius: "5px",
              backgroundColor: "#fffe",
              color: "black",
            }}
          >
            <h2 style={{ margin: 6 }}>Last Upload - ID: {lastImageId}</h2>
            <p style={{ margin: 0 }}>{lastImageTitle}</p>
            <IKImage
              urlEndpoint={URL_ENDPOINT}
              path={lastImageFilepath || ""}
              width="290"
              // add border
              style={{ border: "1px solid black", borderRadius: "5px" }}
            />
            {/* <p>
            <strong>META DATA</strong>
            {JSON.stringify(lastImageResponse)}
          </p> */}
          </div>
        </>
      )}
      {errorMessage && <p style={{ color: "red" }}>UPLOAD ERROR</p>}
    </>
  );
}
