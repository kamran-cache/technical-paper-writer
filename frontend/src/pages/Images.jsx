import React, { useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import app from "../firebase";

const Images = () => {
  const [uploading, setUploading] = useState(false);
  const [imageURL, setImageUrl] = useState("");
  const handleImageChaange = async (e) => {
    console.log(e.target.files[0]);
    const image = e.target.files[0];
    if (image) {
      setUploading(true);
      const storage = getStorage(app);
      const storageRef = ref(storage, "images." + image.name);
      await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(storageRef);
      console.log(downloadURL);
      setImageUrl(downloadURL);
    }
  };
  return (
    <div className=" h-full w-full flex items-center justify-center">
      <h2>Upload image</h2>
      <input type="file" onChange={handleImageChaange} />
      <button disabled={uploading}>
        {uploading ? "Uploading" : "Upload Image"}
      </button>
      {imageURL && (
        <>
          <img src={imageURL} />
        </>
      )}
    </div>
  );
};

export default Images;
