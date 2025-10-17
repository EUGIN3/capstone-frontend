import './ImageUpload.css'
import React, { useState, useRef, useEffect } from "react";

export default function UploadBox({ onImageSelect, resetTrigger }) {
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
        if (onImageSelect) onImageSelect(file);
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

  // ✅ Reset preview when parent triggers reset
  useEffect(() => {
    if (resetTrigger) {
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [resetTrigger]);

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
          <button onClick={onBrowse} type='button'>Browse File</button>
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
