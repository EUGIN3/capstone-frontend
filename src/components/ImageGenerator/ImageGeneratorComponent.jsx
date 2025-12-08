import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AxiosInstance from '../API/AxiosInstance';

import {
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormHelperText,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

import ImageGenerationDropdown from './ImageGenerationDropdown';
import ButtonElement from '../forms/button/ButtonElement';
import Confirmation from '../forms/confirmation-modal/Confirmation';
import { ToastContainer, toast, Slide } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import './ImageGeneratorComponent.css';

// Dropdown options - Separated by Gender
const femaleAttireOptions = [
  { value: 'ball gown', label: 'Ball Gown' },
  { value: 'mermaid', label: 'Mermaid' },
  { value: 'a line', label: 'A-Line' },
  { value: 'trumpet', label: 'Trumpet' },
  { value: 'sheath', label: 'Sheath' },
  { value: 'empire waist', label: 'Empire Waist' },
  { value: 'tea length', label: 'Tea Length' },
  { value: 'high low', label: 'High-Low' },
  { value: 'column', label: 'Column' },
  { value: 'fit and flare', label: 'Fit and Flare' },
  { value: 'princess', label: 'Princess' },
  { value: 'slip dress', label: 'Slip Dress' },
  { value: 'off shoulder', label: 'Off-Shoulder' },
  { value: 'halter', label: 'Halter' },
  { value: 'strapless', label: 'Strapless' },
  { value: 'one shoulder', label: 'One-Shoulder' },
  { value: 'cap sleeve', label: 'Cap Sleeve' },
  { value: 'long sleeve', label: 'Long Sleeve' },
  { value: 'illusion', label: 'Illusion' },
  { value: 'two piece', label: 'Two-Piece' },
  { value: 'jumpsuit', label: 'Jumpsuit' },
  { value: 'pantsuit', label: 'Pantsuit' },
  { value: 'cocktail dress', label: 'Cocktail Dress' },
  { value: 'evening gown', label: 'Evening Gown' },
  { value: 'cape gown', label: 'Cape Gown' },
];

const maleAttireOptions = [
  { value: 'tuxedo', label: 'Tuxedo' },
  { value: 'three piece suit', label: 'Three-Piece Suit' },
  { value: 'two piece suit', label: 'Two-Piece Suit' },
  { value: 'dinner jacket', label: 'Dinner Jacket' },
  { value: 'morning coat', label: 'Morning Coat' },
  { value: 'tailcoat', label: 'Tailcoat' },
  { value: 'white tie', label: 'White Tie' },
  { value: 'black tie', label: 'Black Tie' },
  { value: 'blazer', label: 'Blazer' },
  { value: 'waistcoat', label: 'Waistcoat/Vest' },
  { value: 'nehru jacket', label: 'Nehru Jacket' },
  { value: 'barong tagalog', label: 'Barong Tagalog' },
  { value: 'sherwani', label: 'Sherwani' },
  { value: 'formal suit', label: 'Formal Suit' },
  { value: 'business suit', label: 'Business Suit' },
  { value: 'double breasted suit', label: 'Double-Breasted Suit' },
  { value: 'prince coat', label: 'Prince Coat' },
  { value: 'mandarin collar suit', label: 'Mandarin Collar Suit' },
];

const designStyleOptions = [
  // Classic & Timeless
  { value: 'classic', label: 'Classic' },
  { value: 'timeless', label: 'Timeless' },
  { value: 'elegant', label: 'Elegant' },
  { value: 'sophisticated', label: 'Sophisticated' },
  { value: 'traditional', label: 'Traditional' },
  
  // Modern & Contemporary
  { value: 'modern', label: 'Modern' },
  { value: 'contemporary', label: 'Contemporary' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'sleek', label: 'Sleek' },
  { value: 'architectural', label: 'Architectural' },
  
  // Glamorous & Luxurious
  { value: 'modern glam', label: 'Modern Glam' },
  { value: 'hollywood glamour', label: 'Hollywood Glamour' },
  { value: 'luxurious', label: 'Luxurious' },
  { value: 'opulent', label: 'Opulent' },
  { value: 'regal', label: 'Regal' },
  { value: 'royal', label: 'Royal' },
  
  // Romantic & Soft
  { value: 'romantic', label: 'Romantic' },
  { value: 'ethereal', label: 'Ethereal' },
  { value: 'dreamy', label: 'Dreamy' },
  { value: 'whimsical', label: 'Whimsical' },
  { value: 'delicate', label: 'Delicate' },
  
  // Vintage & Retro
  { value: 'vintage', label: 'Vintage' },
  { value: 'art deco', label: 'Art Deco' },
  { value: 'victorian', label: 'Victorian' },
  { value: 'edwardian', label: 'Edwardian' },
  { value: 'gatsby', label: 'Gatsby' },
  { value: 'retro', label: 'Retro' },
  
  // Artistic & Unique
  { value: 'couture', label: 'Couture' },
  { value: 'avant garde', label: 'Avant-Garde' },
  { value: 'dramatic', label: 'Dramatic' },
  { value: 'artistic', label: 'Artistic' },
  { value: 'bohemian', label: 'Bohemian' },
  
  // Cultural & Traditional
  { value: 'cultural fusion', label: 'Cultural Fusion' },
  { value: 'oriental', label: 'Oriental' },
  { value: 'baroque', label: 'Baroque' },
  { value: 'renaissance', label: 'Renaissance' },
];

const occasionOptions = [
  // Most Common Occasions (Top Priority)
  { value: 'wedding', label: 'Wedding' },
  { value: 'gala', label: 'Gala' },
  { value: 'black tie', label: 'Black Tie Event' },
  { value: 'prom', label: 'Prom' },
  { value: 'formal dinner', label: 'Formal Dinner' },
  
  // Special Events
  { value: 'engagement party', label: 'Engagement Party' },
  { value: 'anniversary', label: 'Anniversary' },
  { value: 'birthday celebration', label: 'Birthday Celebration' },
  { value: 'graduation', label: 'Graduation' },
  { value: 'debutante ball', label: 'Debutante Ball' },
  { value: 'quinceañera', label: 'Quinceañera' },
  
  // Professional & Entertainment
  { value: 'awards night', label: 'Awards Night' },
  { value: 'red carpet', label: 'Red Carpet' },
  { value: 'charity event', label: 'Charity Event' },
  { value: 'corporate gala', label: 'Corporate Gala' },
  { value: 'fundraiser', label: 'Fundraiser' },
  
  // Social & Cultural
  { value: 'cocktail party', label: 'Cocktail Party' },
  { value: 'opera', label: 'Opera' },
  { value: 'theater', label: 'Theater' },
  { value: 'symphony', label: 'Symphony' },
  { value: 'embassy ball', label: 'Embassy Ball' },
  { value: 'state dinner', label: 'State Dinner' },
  
  // Religious & Traditional
  { value: 'baptism', label: 'Baptism' },
  { value: 'communion', label: 'Communion' },
  { value: 'confirmation', label: 'Confirmation' },
  { value: 'religious ceremony', label: 'Religious Ceremony' },
];

const colorOptions = [
  { value: 'navy blue', label: 'Navy Blue' },
  { value: 'emerald green', label: 'Emerald Green' },
  { value: 'royal blue', label: 'Royal Blue' },
  { value: 'burgundy', label: 'Burgundy' },
  { value: 'champagne', label: 'Champagne' },
  { value: 'dusty rose', label: 'Dusty Rose' },
  { value: 'gold', label: 'Gold' },
  { value: 'silver', label: 'Silver' },
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
];

// Yup schema
const schema = yup.object({
  gender: yup.string().required('Please select a gender'),
  attire_type: yup.string().required('Please select an attire type'),
  design_style: yup.string().required('Please select a design style'),
  occasion: yup.string().required('Please select an occasion'),
  color: yup.string().required('Please select a color'),
});

const ImageGeneratorComponent = () => {
  const [imageSrc, setImageSrc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(null);
  const [selectedGender, setSelectedGender] = useState('');
  const [isImageHovered, setIsImageHovered] = useState(false);

  const { handleSubmit, control, formState: { errors }, watch, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  // Watch gender changes
  const watchGender = watch('gender');

  // Update selected gender and reset attire type when gender changes
  React.useEffect(() => {
    if (watchGender && watchGender !== selectedGender) {
      setSelectedGender(watchGender);
      setValue('attire_type', ''); // Reset attire type when gender changes
    }
  }, [watchGender, selectedGender, setValue]);

  // Get attire options based on selected gender
  const getAttireOptions = () => {
    if (selectedGender === 'male') {
      return maleAttireOptions;
    } else if (selectedGender === 'female') {
      return femaleAttireOptions;
    }
    return []; // Return empty array if no gender selected
  };

  const generateImage = async (prompt) => {
    setLoading(true);
    setError('');
    setImageSrc('');

    try {
      const response = await AxiosInstance.post(
        '/generate/generate/generate-image/',
        { prompt },
        { timeout: 30000 }
      );

      const fileUrl = response.data.file_url;

      if (fileUrl) {
        setImageSrc(fileUrl);
        
        // Show success toast
        toast.success(
          <div style={{ padding: '8px' }}>
            Image generated successfully!
          </div>,
          {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            transition: Slide,
            closeButton: false,
          }
        );
      } else if (response.data.image) {
        setImageSrc(`data:image/png;base64,${response.data.image}`);
        
        toast.success(
          <div style={{ padding: '8px' }}>
            Image generated successfully!
          </div>,
          {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            transition: Slide,
            closeButton: false,
          }
        );
      } else {
        setError('No image returned from server.');
        
        toast.error(
          <div style={{ padding: '8px' }}>
            No image returned from server.
          </div>,
          {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            transition: Slide,
            closeButton: false,
          }
        );
      }
    } catch (err) {
      setError('Error generating image. Please try again.');
      console.error(err);

      let errorMessage = 'Error generating image. Please try again.';

      if (err.response?.status === 400) {
        errorMessage = err.response?.data?.detail || 
                      err.response?.data?.error ||
                      'Invalid request. Please check your inputs.';
      } else if (err.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.message === 'Network Error') {
        errorMessage = 'Network connection failed. Please check your internet connection.';
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. The image generation took too long. Please try again.';
      }

      toast.error(
        <div style={{ padding: '8px' }}>
          {errorMessage}
        </div>,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Slide,
          closeButton: false,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Returns config object for confirmation
  const getConfirmationConfig = (data) => {
    const genderLabel = data.gender === 'male' ? 'Male' : 'Female';
    const attireOptions = data.gender === 'male' ? maleAttireOptions : femaleAttireOptions;
    const attireLabel = attireOptions.find(opt => opt.value === data.attire_type)?.label || data.attire_type;
    const styleLabel = designStyleOptions.find(opt => opt.value === data.design_style)?.label || data.design_style;
    const colorLabel = colorOptions.find(opt => opt.value === data.color)?.label || data.color;

    return {
      severity: 'info',
      message: `Generate ${genderLabel} ${attireLabel} design with ${styleLabel} style in ${colorLabel}? This may take up to 30 seconds.`
    };
  };

  // ✅ Handle form submission with confirmation
  const onSubmit = (data) => {
    if (loading) return;

    const config = getConfirmationConfig(data);
    setShowConfirm({ ...config, formData: data });
  };

  // ✅ Actual generation logic
  const doGenerate = (data) => {
    const prompt = `Professional fashion photography: photorealistic ${data.gender} ${data.attire_type} on dress mannequin, ${data.design_style} style for ${data.occasion}, ${data.color} color. Four-panel technical layout (2x2 grid): front view, back view, left side, right side. Studio lighting, pure white seamless background, sharp focus. Show complete silhouette with detailed neckline, sleeves, bodice, waistline, hemline. Capture fabric texture, draping, embellishments, construction details, seams, closures. High-end fashion catalog quality, luxury couture presentation, symmetric composition, professional dress form, museum-quality detail, pattern-making reference precision.`;

    generateImage(prompt);
  };

  // ✅ Handles confirmation response
  const handleConfirm = (confirmed) => {
    setShowConfirm(null);

    if (confirmed && showConfirm?.formData) {
      doGenerate(showConfirm.formData);
    }
  };

  // ✅ Download image handler
  const handleDownloadImage = async () => {
    if (!imageSrc) return;

    try {
      // Create a temporary link element
      const link = document.createElement('a');
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `attire-design-${timestamp}.png`;
      
      // If it's a base64 image
      if (imageSrc.startsWith('data:image')) {
        link.href = imageSrc;
        link.download = filename;
      } else {
        // If it's a URL, fetch and convert to blob
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        link.href = blobUrl;
        link.download = filename;
      }
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up blob URL if created
      if (!imageSrc.startsWith('data:image')) {
        window.URL.revokeObjectURL(link.href);
      }

      // Show success toast
      toast.success(
        <div style={{ padding: '8px' }}>
          Image downloaded successfully!
        </div>,
        {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Slide,
          closeButton: false,
        }
      );
    } catch (error) {
      console.error('Download failed:', error);
      toast.error(
        <div style={{ padding: '8px' }}>
          Failed to download image. Please try again.
        </div>,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Slide,
          closeButton: false,
        }
      );
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='imageGeneratorMain' style={{ position: 'relative' }}>
          
          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p style={{ 
                marginTop: '20px', 
                color: '#0c0c0c', 
                fontWeight: 'bold',
                fontSize: '16px' 
              }}>
                Generating image... This may take up to 30 seconds.
              </p>
            </div>
          )}

          <div className="imageGeneratorTitle">Generate designs</div>
          
          <div className="imageGenerator-bottomPart">
            <div className="imageGeneratorInputContainer">
              {/* Gender */}
              <div className="imageGenerator-genderContainer">
                <Controller
                  name="gender"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <FormControl component="fieldset" error={!!errors.gender}>
                      <FormLabel component="legend">Gender</FormLabel>
                      <RadioGroup row {...field} onChange={(e) => field.onChange(e.target.value)}>
                        <FormControlLabel 
                          value="male" 
                          control={<Radio />} 
                          label="Male"
                          disabled={loading}
                        />
                        <FormControlLabel 
                          value="female" 
                          control={<Radio />} 
                          label="Female"
                          disabled={loading}
                        />
                      </RadioGroup>
                      {errors.gender && <FormHelperText>{errors.gender.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
                <p className='imageGenerator-explanation'>*Gender to know who will be the one wearing the dress</p>
              </div>

              {/* Dropdowns */}
              {[
                { name: 'attire_type', options: getAttireOptions(), label: 'Attire Type', explanation: 'silhouette or structure', disabled: !selectedGender },
                { name: 'design_style', options: designStyleOptions, label: 'Design Type', explanation: 'look and feel', disabled: false },
                { name: 'occasion', options: occasionOptions, label: 'Occasion', explanation: 'appropriate for the event', disabled: false },
                { name: 'color', options: colorOptions, label: 'Primary color', explanation: 'color scheme of the gown', disabled: false },
              ].map(({ name, options, label, explanation, disabled }) => (
                <div key={name} className={`imageGenerator-${name}Container`}>
                  <Controller
                    name={name}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <ImageGenerationDropdown
                        {...field}
                        items={options}
                        dropDownLabel={label}
                        error={!!errors[name]}
                        helperText={errors[name]?.message}
                        disabled={loading || disabled}
                      />
                    )}
                  />
                  <p className='imageGenerator-explanation'>
                    {name === 'attire_type' && !selectedGender 
                      ? '*Please select a gender first to view attire options.'
                      : `*Choose the ${label.toLowerCase()} to guide the gown's ${explanation}.`
                    }
                  </p>
                </div>
              ))}
            </div>

            <div className="imageGeneratorImageContainer">
              <div 
                className="imageGeneratorGeneratedImage"
                onMouseEnter={() => imageSrc && setIsImageHovered(true)}
                onMouseLeave={() => setIsImageHovered(false)}
                onClick={imageSrc ? handleDownloadImage : undefined}
                style={{ cursor: imageSrc ? 'pointer' : 'default' }}
              >
                {!loading && !imageSrc && !error && (
                  <p style={{ color: '#888' }}>Your generated design will appear here</p>
                )}
                {error && !loading && <p style={{ color: 'red' }}>{error}</p>}
                {imageSrc && !loading && (
                  <>
                    <img src={imageSrc} alt="Generated Design" />
                    {isImageHovered && (
                      <div className="download-overlay">
                        <DownloadIcon sx={{ fontSize: 60, color: '#fff' }} />
                        <p style={{ color: '#fff', marginTop: '10px', fontSize: '18px', fontWeight: '600' }}>
                          Click to Download
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              <ButtonElement 
                label={loading ? 'Generating...' : 'Generate'}
                variant='filled-black'
                type='submit'
                disabled={loading}
              />
            </div>
          </div>

          {showConfirm && (
            <Confirmation
              message={showConfirm.message}
              severity={showConfirm.severity}
              onConfirm={handleConfirm}
              isOpen={true}
            />
          )}
        </div>
      </form>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
        style={{ zIndex: 99999 }}
      />
    </>
  );
};

export default ImageGeneratorComponent;