
import { Add, Remove, Close } from '@mui/icons-material';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface ImageComparisonViewProps {
  left: string;
  right: string;
  onCloseLeft?: () => void;
  onCloseRight?: () => void;
}


const ComparisonSlide = ({ left, right, onCloseLeft, onCloseRight }: ImageComparisonViewProps ) =>  {

  const renderImageColumn = (src: string, label: string, onRemove?: () => void ) => (
    <Box sx={{
      width: '50%',
      height: '70vh', // Large view height
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid #444',
      bgcolor: label === 'NOK' ? 'red' : 'green',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {/* Label for OK/NOK */}
      <Typography sx={{ position: 'absolute', top: 5, left: 5, zIndex: 10, color: 'white', fontWeight: 'bold', bgcolor: 'rgba(0,0,0,0.5)', px: 1, borderRadius: '4px' }}>
        {label}
      </Typography>
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={8}
        centerOnInit
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Control Toolbar for this specific image */}
            <Stack
              direction="row"
              spacing={1}
              sx={{
                position: 'absolute',
                top: 5,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 5,
                bgcolor: 'rgba(0,0,0,0.7)',
                p: 0.05,
                borderRadius: '20px'
              }}
            >
              <IconButton onClick={() => zoomIn()} size="small" sx={{ color: 'white' }}><Add /></IconButton>
              <IconButton onClick={() => zoomOut()} size="small" sx={{ color: 'white' }}><Remove /></IconButton>
              <IconButton
                onClick={() => {
                  resetTransform();
                  if (onRemove) onRemove();
                }}
                size="small"
                sx={{ color: '#ff4444' }}
              >
                <Close />
              </IconButton>
            </Stack>
            {/* The Image Canvas */}
            <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentStyle={{ width: '100%', height: '100%' }}>
              <img
                src={src}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain' // Ensures the whole image is visible initially
                }}
                alt="Comparison"
              />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </Box>
  );
  return (
    <Box
      sx={{ display: 'flex', width: '100%', height: '70vh', gap: 1, alignItems: 'center', justifyContent: 'center' }}
      onPointerDown={(e) => e.stopPropagation()} // Stop Lightbox swiping
    >
      {renderImageColumn(left, 'NOK', onCloseLeft)}
      {renderImageColumn(right, 'OK', onCloseRight)}
    </Box>
  );
};

export default ComparisonSlide;