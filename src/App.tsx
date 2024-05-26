import { useState, useRef } from 'react';
import './App.css';
import { IKContext } from 'imagekitio-react';

function App() {
  const [imageSrc, setImageSrc] = useState<any>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [imageID, setImageID] = useState(1);
  const fileInputRef = useRef<any>(null);

  const handleCapture = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const uploadImage = async (file: any, fileName: any) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);

    try {
      const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa('your_public_api_key:your_private_api_key')}` // Use base64 encoded 'public API key:'
        },
        body: formData,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSaveClick = async () => {
    const file = fileInputRef.current.files[0];
    if (file) {
      const uniqueFileName = `image_${imageID.toString().padStart(4, '0')}`;
      const uploadResult = await uploadImage(file, uniqueFileName);
      if (uploadResult && uploadResult.url) {
        setUploadedImageUrl(uploadResult.url);
        setImageID(prevID => prevID + 1);
      }
    }
  };

  return (
    <IKContext
      publicKey="public_1ymwqbS+ZFU+iWlHlVXrNmoW6FA="
      urlEndpoint="https://ik.imagekit.io/deqylxaey"
      transformationPosition="path"
      // @ts-ignore
      authenticationEndpoint="https://estate-inventory.app/.netlify/functions/auth"
    >
      <div style={{ textAlign: 'center', paddingTop: '20px' }}>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleCapture}
        />
        <button
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: '20px'
          }}
          onClick={handleButtonClick}>Take Photo</button>
        {imageSrc && (
          <div style={{ marginTop: '20px' }}>
            <div style={{ fontSize: '20px', marginBottom: '10px' }}>ID: {imageID.toString().padStart(4, '0')}</div>
            <div style={{ fontSize: '20px', marginBottom: '10px' }}>Description: Picture of some dude's face</div>
            <img src={imageSrc} alt="Captured" style={{ width: '100%', maxWidth: '400px' }} />
            <button
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                marginTop: '20px'
              }}
              onClick={handleSaveClick}>Save Photo</button>
          </div>
        )}
        {uploadedImageUrl && (
          <div style={{ marginTop: '20px' }}>
            <h3>Uploaded Image:</h3>
            <img src={uploadedImageUrl} alt="Uploaded" style={{ width: '100%', maxWidth: '400px' }} />
          </div>
        )}
      </div>
    </IKContext>
  );
}

export default App;
