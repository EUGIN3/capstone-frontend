import './GalleryImageDropdown.css'
import React, { useState, useRef, useEffect } from "react";

export default function GalleryImageDropdown({
  onImageSelect,
  resetTrigger,
  existingImage   // <-- add this
}) {
  const [preview, setPreview] = useState(null);
  const dropAreaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load existing saved image
  useEffect(() => {
    if (existingImage && typeof existingImage === "string") {
      setPreview(existingImage);   // load saved image from backend
    }
  }, [existingImage]);

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

  const onDragLeave = () => dropAreaRef.current.classList.remove("active");

  const onDrop = (e) => {
    e.preventDefault();
    dropAreaRef.current.classList.remove("active");
    handleFile(e.dataTransfer.files[0]);
  };

  // Reset preview on trigger (after update)
  useEffect(() => {
    if (resetTrigger) {
      setPreview(existingImage || null); // fallback to saved image
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [resetTrigger, existingImage]);

  return (
    <div
      className="drag-area-gallery"
      ref={dropAreaRef}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onBrowse}
    >
      {preview ? (
        <img src={preview} alt="preview" />
      ) : (
        <>
          <p>+</p>
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
