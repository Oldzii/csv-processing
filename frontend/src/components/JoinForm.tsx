import React, { useState } from 'react';
import { useJoinCSVWithAPIMutation } from '../store/FileManagementApi'; 
import { Button, CircularProgress, TextField, Box } from '@mui/material';

interface JoinFormProps {
  fileId: number; 
}

const JoinForm: React.FC<JoinFormProps> = ({ fileId }) => {
  const [apiAddress, setApiAddress] = useState<string>('');
  const [newFileName, setNewFileName] = useState<string>('');
  const [column1, setColumn1] = useState<string>('');
  const [column2, setColumn2] = useState<string>('');
  const [joinCSVWithAPI, { isLoading, isSuccess, error }] = useJoinCSVWithAPIMutation();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await joinCSVWithAPI({
        fileId,
        api_address: apiAddress,
        new_file_name: newFileName,
        column1,
        column2,
      });
      alert('Request sent successfully!');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto' }}>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            label="API Address"
            variant="outlined"
            fullWidth
            value={apiAddress}
            onChange={(e) => setApiAddress(e.target.value)}
            required
          />
        </Box>

        <Box mb={2}>
          <TextField
            label="New File Name"
            variant="outlined"
            fullWidth
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            required
          />
        </Box>

        <Box mb={2}>
          <TextField
            label="Original file key"
            variant="outlined"
            fullWidth
            value={column1}
            onChange={(e) => setColumn1(e.target.value)}
            required
          />
        </Box>

        <Box mb={2}>
          <TextField
            label="API data key"
            variant="outlined"
            fullWidth
            value={column2}
            onChange={(e) => setColumn2(e.target.value)}
            required
          />
        </Box>

        <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : 'Submit'}
        </Button>

        {isSuccess && <p>Request successful!</p>}
        {error && <p>Error submitting request...</p>}
      </form>
    </Box>
  );
};

export default JoinForm;
