import { useRef, useState } from 'react';
import {
  Box,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Delete } from '@mui/icons-material';

import Lightbox, { ZoomRef } from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

import { IImageData } from '../../../../../types/QualityHubTypes';

interface ImageListViewProps {
  imagesData: IImageData[];
}

const ImageListView = ({ imagesData } :ImageListViewProps) => {
  const [photoIndex, setPhotoIndex] = useState<number>(-1);
  const theme = useTheme();

  const zoomRef = useRef<ZoomRef>(null);
  // 1. Listen for screen size
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Under 600px
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // 2. Determine columns dynamically
  const getCols = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };

  const slides = imagesData.map((img) => ({ src: img.filePath }));

  return (
    <Box sx={{ width: '100%', height: 470, overflowY: 'auto' }}>
      <ImageList variant='standard' cols={getCols()} gap={8}>
        {imagesData.map((item, index) => (
          <ImageListItem key={item.id}>
            <img
              srcSet={`${item.filePath}`}
              src={`${item.filePath}`}
              alt={`NOK Image  ${index}`}
              loading="lazy"
              onClick={() => setPhotoIndex(index)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '4px',
                objectPosition: 'top center',
                transition: 'transform 0.3s ease-in-out',
              }}
            />
            <ImageListItemBar
              //title={item.qualityStatus}
              subtitle={item.qualityStatus}
              sx={{ '& .MuiImageListItemBar-subtitle': { color: item.qualityStatus === 'OK' ? 'green' : 'red' } }}
              actionIcon={
                <IconButton
                  sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                  aria-label={`info about ${item.qualityStatus}`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering PhotoView
                    console.info(`Delete image ${item.id}`);
                  }}
                >
                  <Delete />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
      <Lightbox
        index={photoIndex}
        open={photoIndex >= 0}
        close={() => setPhotoIndex(-1)}
        slides={slides}
        plugins={[Zoom]}
        zoom={{
          ref: zoomRef,
          zoomInMultiplier: 2,
          maxZoomPixelRatio: 5, // Allows very deep zoom for inspections 🔍
          scrollToZoom: true,   // Enables mouse-wheel/touchpad zoom
          pinchZoomV4: true,
        }}
        animation={{ fade: 300 }}
      />
    </Box>
  );
};

export default ImageListView;
