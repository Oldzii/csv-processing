import { useGetCSVFilesQuery } from '../store/FileManagementApi';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { CircularProgress, ListItem, ListItemText } from '@mui/material';
import React from 'react';

interface FileListProps {
  skip: number;
  limit: number;
  onClick: (fileId: number, fileName: string) => void;
}

const FileList: React.FC<FileListProps> = ({ skip, limit, onClick }) => {
  const { data, error, isLoading } = useGetCSVFilesQuery({ skip, limit }, { pollingInterval: 2000 });

  if (isLoading) {
    return (<CircularProgress />);
  }

  if (error) {
    return <div>Error loading files...</div>;
  }

  if (!data || data.length === 0) {
    return <div>No files available</div>;
  }

  return (
  <>

    <Box 
        sx={{ 
          width: '100%', 
          maxWidth: 460, 
          maxHeight: 460,
          bgcolor: 'background.paper', 
          overflowY: 'auto',
          border: '1px solid #ccc', 
          borderRadius: '4px'
        }}
    >
    <List>
      {data.map((file: { file_name: string; id: number }) => (
          <>
        <ListItem key={file.id}>
            <ListItemButton  onClick={() => onClick(file.id, file.file_name)}>
          <ListItemText
            primary={file.file_name}
          />
          </ListItemButton>
        </ListItem>
        <Divider />
        </>
      ))}
    </List>
        </Box>
    </>
  );
};

export default FileList;
