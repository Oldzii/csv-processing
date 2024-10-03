import FileList from '../components/FileList';
import CSVUpload from '../components/CSVUpload';
import CSVTable from '../components/CSVTable';
import JoinForm from '../components/JoinForm';
import { Stack, Grid, Typography } from '@mui/material';

import { useState } from 'react';

const CSVManagement = () => {

  const [fileId, setFileId] = useState(0);
  const [fileName, setFileName] = useState('');

  const onFileClick = (fileId: number, fileName: string) => {
    setFileId(fileId);
    setFileName(fileName);
  }

  return (
       <Stack spacing={2} sx={{ padding: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}> 
          <CSVUpload />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FileList skip={0} limit={100} onClick={onFileClick} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <JoinForm fileId={fileId} />
        </Grid>
      </Grid>
      <Typography>Currently selected file: {fileName} </Typography>
      <CSVTable fileId={fileId} />
    </Stack>
  )
}

export default CSVManagement
