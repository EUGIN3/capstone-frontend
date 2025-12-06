import './GalleryImageDropdown.css'
import React, { useState, useRef, useEffect } from "react";

export default function GalleryImageDropdown({
  onImageSelect,
  onRemoveImage,   // <-- NEW callback to tell parent to delete from backend
  resetTrigger,
  existingImage
}) {
  const [preview, setPreview] = useState(null);
  const dropAreaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (existingImage && typeof existingImage === "string") {
      setPreview(existingImage);
    }
  }, [existingImage]);

  const handleFile = (file) => {
    if (!file) return;

    const validExtensions = ["image/jpeg", "image/jpg", "image/png"];
    if (!validExtensions.includes(file.type)) {
      alert("This is not an image file!");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      onImageSelect && onImageSelect(file);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (e) => {
    e.stopPropagation(); // prevent triggering file browser
    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Tell parent to delete the saved backend image
    if (onRemoveImage) {
      onRemoveImage();
    }
  };

  // Reset handler
  useEffect(() => {
    if (resetTrigger) {
      setPreview(existingImage || null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [resetTrigger, existingImage]);

  return (
    <div
      className="drag-area-gallery"
      ref={dropAreaRef}
      onDragOver={(e) => { e.preventDefault(); dropAreaRef.current.classList.add("active"); }}
      onDragLeave={() => dropAreaRef.current.classList.remove("active")}
      onDrop={(e) => { e.preventDefault(); dropAreaRef.current.classList.remove("active"); handleFile(e.dataTransfer.files[0]); }}
      onClick={() => fileInputRef.current.click()}
    >
      {preview ? (
        <>
          <img src={preview} alt="preview" />
          <button className="remove-image-btn" onClick={removeImage}>×</button>
        </>
      ) : (
        <>
          <p>+</p>
          <input
            type="file"
            ref={fileInputRef}
            hidden
            accept="image/*"
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </>
      )}
    </div>
  );
}
