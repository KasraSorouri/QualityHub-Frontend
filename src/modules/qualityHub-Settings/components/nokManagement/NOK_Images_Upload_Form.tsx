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
  Stack,
  IconButton,
} from '@mui/material';
import { CloudUpload, Delete, InsertDriveFile } from '@mui/icons-material';
import nokImageService from '../../services/nokImageService';
import { IImageData } from '../../../../types/QualityHubTypes';

interface IProps {
  nokId : number;
  qualityStatus: 'NOK' | 'OK';
  nokCode : number;
  station : number;
  closeForm : (x:boolean) => void;
  setNokImages : (imagesData: IImageData[]) => void;
}

const ImageFileUploader = ({ nokId, qualityStatus, nokCode, station, closeForm, setNokImages } : IProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file),
      statusbar: 'pending'
    }));
    setFiles((prev: File[]) => [ ...prev, ...newFiles ]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUploadFiles = async() => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });
      formData.append('nokId', nokId.toString() );
      formData.append('qualityStatus', qualityStatus);
      formData.append('nokCode', nokCode.toString());
      formData.append('station', station.toString());
      const response = await nokImageService.uploadImage(formData);
      console.log('uploading images response ...', response);
      setNokImages(response);
      closeForm(false);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  const removeFile = (fileName: string) => {
    setFiles(files.filter(file => file.name !== fileName));
  };

  return (
    <Box sx={{ width: '100%', margin: 'auto', overflow: 'hidden' }}>
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
          <ListItem key={index} sx={{ py: 1 }}
            secondaryAction={
              <IconButton edge="end" onClick={() => removeFile(file.name)}>
                <Delete color="error" />
              </IconButton>
            }
          >
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
      <Stack direction="row" justifyContent={'flex-end'} spacing={2} sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ ml: 2, alignSelf: 'flex-end'  }}
          onClick={() => closeForm(false)}
        >
        cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{ ml: 2, alignSelf: 'flex-end' }}
          onClick={() => handleUploadFiles()}
          disabled={files.length === 0}
        >
        Upload
        </Button>
      </Stack>
    </Box>
  );
};

export default ImageFileUploader;

