import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
} from '@mui/material';
import { CloudUpload, InsertDriveFile } from '@mui/icons-material';

interface IProps {
  closeForm : (x:boolean) => void
}

const ImageFileUploader = ({ closeForm } : IProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file),
      statusbar: 'pending'
    }));
    setFiles((prev: File[]) => [ ...prev, ...newFiles ]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Box sx={{ width: '100%', height: 'auto', margin: 'auto', overflow: 'hidden' }}>
      <Paper
        {...getRootProps()}
        sx={{
          p: 5,
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'gray.400',
          bgcolor: isDragActive ? 'action.hover' : 'background.paper',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 60, color: 'primary.main' }} />
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          or click to select files
        </Typography>
        <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
          Supported formats: JPG, PNG, PDF
        </Typography>
      </Paper>
      {/* File List*/}
      <List>
        {files.map((file, index) => (
          <ListItem key={index} sx={{ py: 1 }}>
            <ListItemIcon>
              <InsertDriveFile color='primary' />
            </ListItemIcon>
            <ListItemText
              primary={file.name}
              secondary={`${(file.size / 1024).toFixed(2)} KB` }
            />
          </ListItem>
        ))}
      </List>
      <Button
        variant="contained"
        color="primary"
        onClick={() => closeForm(false)}
      >
        cancel
      </Button>
    </Box>
  );
};

export default ImageFileUploader;

