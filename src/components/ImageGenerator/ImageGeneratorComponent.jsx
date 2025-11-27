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

import ImageGenerationDropdown from './ImageGenerationDropdown';
import ButtonElement from '../forms/button/ButtonElement';

import './ImageGeneratorComponent.css';

// Dropdown options (same as your original)
// Dropdown options
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

const designStyleOptions = [
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'romantic', label: 'Romantic' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'bohemian', label: 'Bohemian' },
  { value: 'modern glam', label: 'Modern Glam' },
  { value: 'classic', label: 'Classic' },
  { value: 'couture', label: 'Couture' },
  { value: 'ethereal', label: 'Ethereal' },
];

const occasionOptions = [
  { value: 'wedding', label: 'Wedding' },
  { value: 'prom', label: 'Prom' },
  { value: 'gala', label: 'Gala' },
  { value: 'red carpet', label: 'Red Carpet' },
  { value: 'black tie', label: 'Black Tie Event' },
  { value: 'engagement party', label: 'Engagement Party' },
  { value: 'awards night', label: 'Awards Night' },
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

  const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

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
      } else if (response.data.image) {
        setImageSrc(`data:image/png;base64,${response.data.image}`);
      } else {
        setError('No image returned from server.');
      }
    } catch (err) {
      setError('Error generating image. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data) => {
    const prompt = `Create a high-resolution, full-body image of an attire for a ${data.gender} ${data.attire_type} displayed on a mannequin. The attire should reflect a ${data.design_style} aesthetic that is intended for ${data.occasion} with a primary color of ${data.color}. The image must feature a clean and plain background. Follow a structured four-panel layout that clearly showcases the attire from multiple angles. The first panel should present a full front view of the attire displayed on a mannequin, capturing the complete silhouette including the neckline, sleeves, waistline. The mannequin should be posed in a straightforward, symmetrical stance to emphasize the design's structure, fit, and proportional details. The second panel, must display the back view on the mannequin, with attention to closures, back neckline, embellishments, and hemline, all illustrated with precision and symmetry. The third panel, should show the left side view of the mannequin. The fourth panel, should show the right side view on the mannequin and mirror the left side. The image must be realistic, with close attention paid to the texture of the fabric, the way it moves and rests on the mannequin form, and the intricacy of construction details, ensuring a lifelike and professionally finished presentation that fully conveys the craftsmanship and style of the garment.`;

    generateImage(prompt);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='imageGeneratorMain'>
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
                      <FormControlLabel value="male" control={<Radio />} label="Male" />
                      <FormControlLabel value="female" control={<Radio />} label="Female" />
                    </RadioGroup>
                    {errors.gender && <FormHelperText>{errors.gender.message}</FormHelperText>}
                  </FormControl>
                )}
              />
              <p className='imageGenerator-explanation'>*Gender to know who will be the one wearing the dress</p>
            </div>

            {/* Dropdowns */}
            {[
              { name: 'attire_type', options: attireTypeOptions, label: 'Attire Type', explanation: 'silhouette or structure' },
              { name: 'design_style', options: designStyleOptions, label: 'Design Type', explanation: 'look and feel' },
              { name: 'occasion', options: occasionOptions, label: 'Occasion', explanation: 'appropriate for the event' },
              { name: 'color', options: colorOptions, label: 'Primary color', explanation: 'color scheme of the gown' },
            ].map(({ name, options, label, explanation }) => (
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
                    />
                  )}
                />
                <p className='imageGenerator-explanation'>*Choose the {label.toLowerCase()} to guide the gown’s {explanation}.</p>
              </div>
            ))}
          </div>

          <div className="imageGeneratorImageContainer">
            <div className="imageGeneratorGeneratedImage">
              {loading && <p>Generating image...</p>}
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {imageSrc && <img src={imageSrc} alt="Generated Design" style={{ width: '80%' }} />}
            </div>

            <ButtonElement 
              label='Generate'
              variant='filled-black'
              type='submit'
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default ImageGeneratorComponent;
