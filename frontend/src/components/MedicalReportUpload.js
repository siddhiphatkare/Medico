import React, { useState } from 'react';

const MedicalReportUpload = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }
    setUploading(true);
    setMessage('');
    const formData = new FormData();
    formData.append('reportFile', file);
    formData.append('description', description);

    try {
      const response = await fetch('http://localhost:5000/v1/reports/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Report uploaded successfully.');
        setFile(null);
        setDescription('');
      } else {
        setMessage(data.message || 'Upload failed.');
      }
    } catch (error) {
      setMessage('Error uploading report: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', marginTop: '20px' }}>
      <label>
        Select Report File:
        <input type="file" onChange={handleFileChange} accept=".pdf,.jpg,.png,.doc,.docx" />
      </label>
      <br />
      <label>
        Description:
        <textarea value={description} onChange={handleDescriptionChange} rows={3} style={{ width: '100%', marginTop: '5px' }} />
      </label>
      <br />
      <button type="submit" disabled={uploading} style={{ marginTop: '10px', padding: '10px 20px' }}>
        {uploading ? 'Uploading...' : 'Upload Report'}
      </button>
      {message && <p style={{ marginTop: '10px' }}>{message}</p>}
    </form>
  );
};

export default MedicalReportUpload;
