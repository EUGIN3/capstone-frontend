// import React from 'react'
// import './AddItemModal.css'
// import { Tooltip } from '@mui/material';
// import { useForm } from 'react-hook-form';
// import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
// import DropdownComponentTime from '../../../forms/time-dropdown/DropDownForTime';
// import NormalTextField from '../../../forms/text-fields/NormalTextField';
// import MultilineTextFields from '../../../forms/multilines-textfield/MultilineTextFields';
// import GalleryImageDropdown from '../../../forms/upload-file/GalleryImageDropdown'

// import ButtonElement from '../../../forms/button/ButtonElement';

// function AddItemModal({ onClose }) {
//   const { control, handleSubmit, reset } = useForm({});

//   const attireTypeOptions = [
//     { value: 'ball gown', label: 'Ball Gown' },
//     { value: 'mermaid', label: 'Mermaid' },
//     { value: 'a line', label: 'A-Line' },
//     { value: 'trumpet', label: 'Trumpet' },
//     { value: 'empire waist', label: 'Empire Waist' },
//     { value: 'tea length', label: 'Tea Length' },
//     { value: 'high low', label: 'High-Low' },
//     { value: 'sheath', label: 'Sheath' },
//   ];

//   return (
//     <div className="outerAddItemModal">
//       <Tooltip title='Close' arrow>
//          <button className="close-addItem-modal" onClick={onClose}>
//           <CloseRoundedIcon
//             sx={{
//               color: '#f5f5f5',
//               fontSize: 28,
//               padding: '2px',
//               backgroundColor: '#0c0c0c',
//               borderRadius: '50%',
//               cursor: 'pointer',
//               transition: 'all 0.3s ease',
//             }}
//           />
//         </button>
//       </Tooltip>

//       <div className="AddItemModal">
//         <div className="add-new-item-header">
//           <p>Add New</p>
//         </div>

//         <div className="name-type-container">
//           <div className="name-add-item-container">
//             <NormalTextField control={control} name="attire_name" label="Name" />
//           </div>

//           <div className="type-add-item-container">
//             <DropdownComponentTime
//               items={attireTypeOptions}
//               dropDownLabel="Attire Type"
//               name="attire_type"
//               control={control}
//             />
//           </div>
//         </div>

//         <div className="description-add-item-container">
//           <NormalTextField control={control} name="description" label="Description" />
//         </div>

//         <div className="images-add-item-contianer">
//           <Tooltip title='Add Main Image' arrow>
//             <div className="add-item-main-image">
//               <GalleryImageDropdown/>
//             </div>
//           </Tooltip>

//           <div className="add-item-sub-images">
//             <Tooltip title='Add Image' arrow>
//               <div className="add-images">
//                 <GalleryImageDropdown/>
//               </div>
//             </Tooltip>
//             <Tooltip title='Add Image' arrow>
//               <div className="add-images">
//                 <GalleryImageDropdown/>
//               </div>
//             </Tooltip>
//             <Tooltip title='Add Image' arrow>
//               <div className="add-images">
//                 <GalleryImageDropdown/>
//               </div>
//             </Tooltip>
//             <Tooltip title='Add Image' arrow>
//               <div className="add-images">
//                 <GalleryImageDropdown/>
//               </div>
//             </Tooltip>
//           </div>
//         </div>

//         <div className="save-add-item-container">
//           <ButtonElement 
//             label='Add'
//             variant='filled-black'
//             type='button'
//             onClick={()=>alert('save')}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AddItemModal


import React, { useEffect, useState } from 'react';
import './AddItemModal.css';
import { Tooltip } from '@mui/material';
import { useForm } from 'react-hook-form';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DropdownComponentTime from '../../../forms/time-dropdown/DropDownForTime';
import NormalTextField from '../../../forms/text-fields/NormalTextField';
import GalleryImageDropdown from '../../../forms/upload-file/GalleryImageDropdown';
import ButtonElement from '../../../forms/button/ButtonElement';
import AxiosInstance from '../../../API/AxiosInstance';

function AddItemModal({ onClose }) {
  const { control, handleSubmit, reset } = useForm({});
  const [images, setImages] = useState([null, null, null, null, null]);
  const [resetTrigger, setResetTrigger] = useState(false);

  const attireTypeOptions = [
    { value: 'ball gown', label: 'Ball Gown' },
    { value: 'mermaid', label: 'Mermaid' },
    { value: 'a line', label: 'A-Line' },
    { value: 'trumpet', label: 'Trumpet' },
    { value: 'empire waist', label: 'Empire Waist' },
    { value: 'tea length', label: 'Tea Length' },
    { value: 'high low', label: 'High-Low' },
    { value: 'sheath', label: 'Sheath' },
  ];

  const handleImageChange = (file, index) => {
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('attire_name', data.attire_name);
      formData.append('attire_type', data.attire_type);
      formData.append('attire_description', data.description);

      images.forEach((img, idx) => {
        if (img) formData.append(`image${idx + 1}`, img);
      });

      await AxiosInstance.post('/gallery/admin/attire/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Attire added successfully!');
      reset();
      setImages([null, null, null, null, null]);
      setResetTrigger((prev) => !prev);
      onClose();
    } catch (error) {
      console.error(error);
      alert('Failed to add attire.');
    }
  };

  return (
    <div className="outerAddItemModal">
      <Tooltip title='Close' arrow>
         <button className="close-addItem-modal" onClick={onClose}>
          <CloseRoundedIcon
            sx={{
              color: '#f5f5f5',
              fontSize: 28,
              padding: '2px',
              backgroundColor: '#0c0c0c',
              borderRadius: '50%',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          />
        </button>
      </Tooltip>

      <div className="AddItemModal">
        <div className="add-new-item-header">
          <p>Add New</p>
        </div>

        <div className="name-type-container">
          <div className="name-add-item-container">
            <NormalTextField control={control} name="attire_name" label="Name" />
          </div>

          <div className="type-add-item-container">
            <DropdownComponentTime
              items={attireTypeOptions}
              dropDownLabel="Attire Type"
              name="attire_type"
              control={control}
            />
          </div>
        </div>

        <div className="description-add-item-container">
          <NormalTextField control={control} name="description" label="Description" />
        </div>

        <div className="images-add-item-contianer">
          <Tooltip title='Add Main Image' arrow>
            <div className="add-item-main-image">
              <GalleryImageDropdown 
                resetTrigger={resetTrigger}
                onImageSelect={(file) => handleImageChange(file, 0)} 
              />
            </div>
          </Tooltip>

          <div className="add-item-sub-images">
            {[1, 2, 3, 4].map((idx) => (
              <Tooltip key={idx} title='Add Image' arrow>
                <div className="add-images">
                  <GalleryImageDropdown 
                    resetTrigger={resetTrigger}
                    onImageSelect={(file) => handleImageChange(file, idx)} 
                  />
                </div>
              </Tooltip>
            ))}
          </div>
        </div>

        <div className="save-add-item-container">
          <ButtonElement 
            label='Add'
            variant='filled-black'
            type='button'
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      </div>
    </div>
  );
}

export default AddItemModal;
