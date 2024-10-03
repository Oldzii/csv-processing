import React, { useState } from 'react';
import { useUploadCSVFileMutation } from '../store/FileManagementApi';
import { Button, CircularProgress, Box, TextField } from '@mui/material';

const CSVUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [uploadCSVFile, { isLoading, isSuccess, error }] = useUploadCSVFileMutation();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]); 
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file || !fileName) {
      alert('Please select a file and provide a file name.');
      return;
    }

    try {
      await uploadCSVFile({ file, fileName });
      alert('File uploaded successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto' }}>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            label="File Name"
            variant="outlined"
            fullWidth
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            required
          />
        </Box>

        <Box mb={2}>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            required
          />
        </Box>

        <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : 'Upload CSV'}
        </Button>

        {isSuccess && <p>File uploaded successfully!</p>}
        {error && <p>Error uploading file</p>}
      </form>
    </Box>
  );
};

export default CSVUpload;
