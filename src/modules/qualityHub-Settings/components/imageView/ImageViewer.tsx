import { useState } from 'react';

import { Box, Button, Divider, Grid, Paper, Typography } from '@mui/material';

import 'yet-another-react-lightbox/styles.css';

import ImageListBar from './ImageListBar';
import ImageComparisonView from './ImageComparisonView';
import ImageView from './ImageView';
import { IImage } from '../../../../types/QualityHubTypes';

interface IImageViewerProps {
  images: IImage[];
  closeWindow: () => void;
}


const ImageViewer = ({ images, closeWindow }: IImageViewerProps) => {
  const [selectedNokImage, setSelectedNokImage] = useState<IImage|null>(null);
  const [selectedOkImage, setSelectedOkImage] = useState<IImage|null>(null);

  const nokImagesData = images.filter(image => image.qualityStatus === 'NOK');
  const okImagesData = images.filter(image => image.qualityStatus === 'OK');


  return (
    <Paper
      sx={{ marginTop: 1, border: 'solid', borderRadius: 2, borderColor: '#1976d270', width: '99.7%', height: '88vh' }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" borderRadius={2} bgcolor={'#1976d270'}>
        <Grid container bgcolor={'#1976d2d9'} color={'white'} justifyContent={'space-between'} flexDirection={'row'}>
          <Typography margin={1}>Image Comparisson</Typography>
          <Button onClick={closeWindow} variant="contained" sx={{ height: '39px' }}>
            close
          </Button>
        </Grid>
      </Box>
      <Grid>
        <Box sx={{ width: '100%', height: 'auto', display:'flex', alignItems:'center', overflowX: 'hidden', gap: 1 }}>
          <ImageListBar imagesData={nokImagesData} status={'NOK'} selectImage={setSelectedNokImage} selected={selectedNokImage?.id} />
          <ImageListBar imagesData={okImagesData} status={'OK'} selectImage={setSelectedOkImage} selected={selectedOkImage?.id} />
        </Box>
        <Divider sx={{ marginY: 0.5 }} />
        {(selectedNokImage && selectedOkImage) ? <ImageComparisonView left={selectedNokImage?.filePath || ''} right={selectedOkImage?.filePath || ''} onCloseLeft={() => setSelectedNokImage(null)}  onCloseRight={() => setSelectedOkImage(null)}/> :
          <ImageView image={selectedNokImage?.filePath || selectedOkImage?.filePath || ''} qualityStatus={selectedNokImage ? 'NOK' : 'OK'} />}
      </Grid>
    </Paper>
  );
};

export default ImageViewer;
