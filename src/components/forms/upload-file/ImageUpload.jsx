import './ImageUpload.css'
import React, { useState, useRef } from "react";

export default function UploadBox() {
  const [preview, setPreview] = useState(null);
  const dropAreaRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    const validExtensions = ["image/jpeg", "image/jpg", "image/png"];
    if (validExtensions.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("This is not an image file!");
    }
  };

  const onBrowse = () => fileInputRef.current.click();

  const onFileChange = (e) => handleFile(e.target.files[0]);

  const onDragOver = (e) => {
    e.preventDefault();
    dropAreaRef.current.classList.add("active");
  };

  const onDragLeave = () => {
    dropAreaRef.current.classList.remove("active");
  };

  const onDrop = (e) => {
    e.preventDefault();
    dropAreaRef.current.classList.remove("active");
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      className="drag-area"
      ref={dropAreaRef}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {preview ? (
        <img src={preview} alt="preview" />
      ) : (
        <>
          <div className="icon">📁</div>
          <header>Drag & Drop to Upload File</header>
          <span>OR</span>
          <button onClick={onBrowse}>Browse File</button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileChange}
            hidden
            accept="image/*"
          />
        </>
      )}
    </div>
  );
}
