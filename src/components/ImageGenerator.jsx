import React, { useState, useEffect } from 'react';
import AxiosInstance from './AxiosInstance';  // your configured Axios instance

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Clear image/error when prompt changes
  useEffect(() => {
    setImageSrc('');
    setError('');
  }, [prompt]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }

    setLoading(true);
    setError('');
    setImageSrc('');

    try {
      const response = await AxiosInstance.post(
        'yourmodel/generate-image/',
        { prompt },
        { timeout: 30000 }
      );

      // Use the returned URL to display the saved image
      const fileUrl = response.data.file_url;

      if (fileUrl) {
        setImageSrc(fileUrl);
      } else if (response.data.image) {
        // fallback to base64 if no file_url
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

  return (
    <div style={{ padding: '1rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Generate Fashion Design</h2>
      <textarea
        placeholder="Enter your design prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={4}
        style={{ width: '100%', padding: '10px', marginBottom: '1rem' }}
      />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Image'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {imageSrc && (
        <div style={{ marginTop: '1rem' }}>
          <h4>Generated Image:</h4>
          <img src={imageSrc} alt="Generated" style={{ width: '100%' }} />
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;