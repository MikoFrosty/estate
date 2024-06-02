import { useEffect, useState } from "react";
import { IKImage } from "imagekitio-react";
import { BACKEND_BASE_URL } from "./main";

export default function Gallery() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<any | null>(null);

  useEffect(() => {
    setLoading(true);
    const listFilesEndpoint = "/list-files";
    // Get the last image uploaded
    const getFilesList = async () => {
      try {
        const response = await fetch(BACKEND_BASE_URL + listFilesEndpoint);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Request failed with status ${response.status}: ${errorText}`
          );
        }

        const data = await response.json();
        setImages(data);
      } catch (error: any) {
        console.error(`Failed to load images from backend: ${error.message}`);
      }
    };

    getFilesList().finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading images...</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="item-container"
              onClick={() => setSelectedImage(image)}
            >
              <div className="item-id">{image.customMetadata.id}</div>
              <div
                className="item-name"
                style={
                  {
                    // if the name is too long, truncate it
                  }
                }
              >
                {image.customMetadata.title}
              </div>
              <IKImage
                className="item-image"
                key={image.id}
                path={image.filePath}
                transformation={[{ height: "300", width: "300" }]}
                height={300}
                width={300}
                loading="lazy"
              />
              <div className="item-description">
                {image.customMetadata.description || "None"}
              </div>
            </div>
          ))}
        </div>
      )}
      <ImageModal
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
}

const ImageModal = ({ image, onClose }: any) => {
  if (!image) {
    return null;
  }

  return (
    <div className="modal" onClick={onClose}>
      {/* <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-close" onClick={onClose}>
          X
        </div>
        <div className="modal-id">{image.customMetadata.id}</div>
        <h2>{image.customMetadata.title}</h2> */}
        <IKImage
          path={image.filePath}
          loading="lazy"
          className="modal-content-image"
        />
        {/* <p>{image.customMetadata.description || "No description"}</p>
      </div> */}
    </div>
  );
};
