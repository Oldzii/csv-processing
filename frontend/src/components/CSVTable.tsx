import React from 'react';
import Box from '@mui/material/Box';
import { useGetCSVFileByIdQuery } from '../store/FileManagementApi';
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface CSVTableProps {
  fileId: number; }

const CSVTable: React.FC<CSVTableProps> = ({ fileId }) => {
  const { data, error, isLoading } = useGetCSVFileByIdQuery(fileId);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error loading data...</div>;
  }

  if (!data || !Array.isArray(data)) {
    return <div>No data available</div>;
  }

  const headers = Object.keys(data[0]);

  return (
       <Box 
        sx={{ 
          width: '100%', 
          maxHeight: 460, 
          bgcolor: 'background.paper', 
          overflowY: 'auto',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
    >
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header}>{header}</TableCell> 
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((row: any, index: number) => (
            <TableRow key={index}>
              {headers.map((header) => (
                <TableCell key={header}>
                  {row[header] !== null && typeof row[header] === 'object'
                    ? JSON.stringify(row[header])
                    : row[header]}  
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Box>
  );
};

export default CSVTable;
