import {
  Box,
  ImageList,
  ImageListItem,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { IImageData } from '../../../../types/QualityHubTypes';

interface ImageListViewProps {
  imagesData: IImageData[];
}

const ImageListView = ({ imagesData } :ImageListViewProps) => {
  const theme = useTheme();
  // 1. Listen for screen size
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Under 600px
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // 2. Determine columns dynamically
  const getCols = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };


  return (
    <Box sx={{ width: '100%', height: 400, overflowY: 'scroll' }}>
      <ImageList variant="quilted" cols={getCols()} gap={8}>
        {imagesData.map((item, index) => (
          <ImageListItem key={item.id}>
            <img
              srcSet={`${item.filePath}`}
              src={`${item.filePath}`}
              alt={`NOK Image  ${index}`}
              loading="lazy"
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '4px'
              }}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
};

export default ImageListView;

