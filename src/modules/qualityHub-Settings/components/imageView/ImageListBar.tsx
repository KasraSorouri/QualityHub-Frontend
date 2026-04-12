import React, { useRef } from 'react';
import { Box, IconButton, ImageListItemBar } from '@mui/material';
import { ChevronLeft, ChevronRight, Delete } from '@mui/icons-material';

interface IImageListBarProbs {
  imagesData: { id: number; filePath: string; qualityStatus: string }[];
  status?: 'OK' | 'NOK';
  selectImage: React.Dispatch<React.SetStateAction<{ id: number; filePath: string; qualityStatus: string } | null>>;
  selected: number | undefined
}

const ImageListBar = ({ imagesData, status, selectImage, selected }: IImageListBarProbs) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  console.log('selected :', selected);

  const scroll = (direction: string) => {
    const { current } = scrollRef;
    if (!current) return;
    const scrollAmount = 300;
    current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };
  return (
    <Box
      sx={{
        border: status === 'OK' ? '2px solid #45eb7f' : '2px solid #eb4545' ,
        borderRadius: '8px',
        width: '50%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Left Arrow */}
      <IconButton
        onClick={() => scroll('left')}
        sx={{ position: 'absolute', left: 0, zIndex: 2, bgcolor: 'rgba(220, 220, 220, 0.7)' }}
      >
        <ChevronLeft />
      </IconButton>
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          overflowX: 'hidden', // Hide scrollbar for a clean look
          scrollBehavior: 'smooth',
          gap: 0.5,
          p: 0.5,
          width: '100%',
          height: '100px',
          overflowY: 'hidden'
        }}
      >
        {imagesData.map((item, index) => (
          <Box
            key={item.id}
            sx={{
              minWidth: 'auto', // Force single row by preventing shrinking
              position: 'relative',
              flexShrink: 0,
              height: 'auto',
              borderRadius: '8px'
            }}
          >
            <img
              srcSet={`${item.filePath}`}
              src={`${item.filePath}`}
              alt={`NOK Image  ${index}`}
              loading="lazy"
              style={{
                width: '100%',
                height: '100px',
                objectFit: 'cover',
                border: item.id === selected ? 'solid 2px #020202' : undefined,
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              onClick={() => selectImage({ id: item.id, filePath: item.filePath, qualityStatus: item.qualityStatus })}
            />
            { item.id === selected ?
              <ImageListItemBar
                subtitle={item.qualityStatus}
                sx={{
                  borderBottomLeftRadius: '8px',
                  borderBottomRightRadius: '8px',
                  '& .MuiImageListItemBar-subtitle': { color: item.qualityStatus === 'OK' ? 'green' : 'red' }
                }}
                actionIcon={
                  <IconButton
                    sx={{ color: 'white' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.info(`Delete ${item.id}`);
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                }
              />
              : null}
          </Box>
        ))}
      </Box>
      {/* Right Arrow */}
      <IconButton
        onClick={() => scroll('right')}
        sx={{ position: 'absolute', right: 0, zIndex: 1, bgcolor: 'rgba(220,220,220,0.7)' }}
      >
        <ChevronRight />
      </IconButton>
    </Box>
  );
};

export default ImageListBar;
