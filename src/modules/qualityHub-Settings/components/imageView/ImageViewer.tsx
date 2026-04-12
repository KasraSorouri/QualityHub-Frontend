import { useState } from 'react';

import { Box, Button, Divider, Grid, Paper, Typography } from '@mui/material';

import 'yet-another-react-lightbox/styles.css';


import ImageListBar from './ImageListBar';
import ImageComparisonView from './ImageComparisonView';
import ImageView from './ImageView';


const ImageViewer = () => {
  const [selectedNokImage, setSelectedNokImage] = useState<{ id: number; filePath: string; qualityStatus: string }|null>(null);
  const [selectedOkImage, setSelectedOkImage] = useState<{ id: number; filePath: string; qualityStatus: string }|null>(null);
  console.log('selectedNokImage', selectedNokImage);
  console.log('selectedOkImage', selectedOkImage);

  /* MOOC DATA */
  const leftSideImages = [
    { src: 'http://localhost:9000/q-insight/d9330ee6-abc9-4b6e-b526-2fd735dce052_43d489e5-1ec0-4c5c-a987-a3071379f070_download%20%282%29.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=admin%2F20260328%2Feuro-n-1%2Fs3%2Faws4_request&X-Amz-Date=20260328T231728Z&X-Amz-Expires=86400&X-Amz-Signature=cea787391ca13024afdc9a42cc6748a808d905cb58a6c1c8d2c2e9684b5fa92f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject' },
    { src: 'http://localhost:9000/q-insight/d9330ee6-abc9-4b6e-b526-2fd735dce052_43d489e5-1ec0-4c5c-a987-a3071379f070_download%20%282%29.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=admin%2F20260328%2Feuro-n-1%2Fs3%2Faws4_request&X-Amz-Date=20260328T231728Z&X-Amz-Expires=86400&X-Amz-Signature=cea787391ca13024afdc9a42cc6748a808d905cb58a6c1c8d2c2e9684b5fa92f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject' },
    { src: 'http://localhost:9000/q-insight/d9330ee6-abc9-4b6e-b526-2fd735dce052_43d489e5-1ec0-4c5c-a987-a3071379f070_download%20%282%29.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=admin%2F20260328%2Feuro-n-1%2Fs3%2Faws4_request&X-Amz-Date=20260328T231728Z&X-Amz-Expires=86400&X-Amz-Signature=cea787391ca13024afdc9a42cc6748a808d905cb58a6c1c8d2c2e9684b5fa92f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject' },
    { src: 'http://localhost:9000/q-insight/d9330ee6-abc9-4b6e-b526-2fd735dce052_43d489e5-1ec0-4c5c-a987-a3071379f070_download%20%282%29.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=admin%2F20260328%2Feuro-n-1%2Fs3%2Faws4_request&X-Amz-Date=20260328T231728Z&X-Amz-Expires=86400&X-Amz-Signature=cea787391ca13024afdc9a42cc6748a808d905cb58a6c1c8d2c2e9684b5fa92f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject' },
    { src: 'http://localhost:9000/q-insight/d9330ee6-abc9-4b6e-b526-2fd735dce052_43d489e5-1ec0-4c5c-a987-a3071379f070_download%20%282%29.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=admin%2F20260328%2Feuro-n-1%2Fs3%2Faws4_request&X-Amz-Date=20260328T231728Z&X-Amz-Expires=86400&X-Amz-Signature=cea787391ca13024afdc9a42cc6748a808d905cb58a6c1c8d2c2e9684b5fa92f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject' },
    { src: 'http://localhost:9000/q-insight/d9330ee6-abc9-4b6e-b526-2fd735dce052_43d489e5-1ec0-4c5c-a987-a3071379f070_download%20%282%29.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=admin%2F20260328%2Feuro-n-1%2Fs3%2Faws4_request&X-Amz-Date=20260328T231728Z&X-Amz-Expires=86400&X-Amz-Signature=cea787391ca13024afdc9a42cc6748a808d905cb58a6c1c8d2c2e9684b5fa92f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject' },
    { src: 'http://localhost:9000/q-insight/d9330ee6-abc9-4b6e-b526-2fd735dce052_43d489e5-1ec0-4c5c-a987-a3071379f070_download%20%282%29.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=admin%2F20260328%2Feuro-n-1%2Fs3%2Faws4_request&X-Amz-Date=20260328T231728Z&X-Amz-Expires=86400&X-Amz-Signature=cea787391ca13024afdc9a42cc6748a808d905cb58a6c1c8d2c2e9684b5fa92f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject' },
    { src: 'http://localhost:9000/q-insight/d9330ee6-abc9-4b6e-b526-2fd735dce052_43d489e5-1ec0-4c5c-a987-a3071379f070_download%20%282%29.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=admin%2F20260328%2Feuro-n-1%2Fs3%2Faws4_request&X-Amz-Date=20260328T231728Z&X-Amz-Expires=86400&X-Amz-Signature=cea787391ca13024afdc9a42cc6748a808d905cb58a6c1c8d2c2e9684b5fa92f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject' },
    { src: 'http://localhost:9000/q-insight/d9330ee6-abc9-4b6e-b526-2fd735dce052_43d489e5-1ec0-4c5c-a987-a3071379f070_download%20%282%29.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=admin%2F20260328%2Feuro-n-1%2Fs3%2Faws4_request&X-Amz-Date=20260328T231728Z&X-Amz-Expires=86400&X-Amz-Signature=cea787391ca13024afdc9a42cc6748a808d905cb58a6c1c8d2c2e9684b5fa92f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject' },
    { src: 'http://localhost:9000/q-insight/d9330ee6-abc9-4b6e-b526-2fd735dce052_43d489e5-1ec0-4c5c-a987-a3071379f070_download%20%282%29.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=admin%2F20260328%2Feuro-n-1%2Fs3%2Faws4_request&X-Amz-Date=20260328T231728Z&X-Amz-Expires=86400&X-Amz-Signature=cea787391ca13024afdc9a42cc6748a808d905cb58a6c1c8d2c2e9684b5fa92f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject' },
    { src: 'http://localhost:9000/q-insight/d9330ee6-abc9-4b6e-b526-2fd735dce052_43d489e5-1ec0-4c5c-a987-a3071379f070_download%20%282%29.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=admin%2F20260328%2Feuro-n-1%2Fs3%2Faws4_request&X-Amz-Date=20260328T231728Z&X-Amz-Expires=86400&X-Amz-Signature=cea787391ca13024afdc9a42cc6748a808d905cb58a6c1c8d2c2e9684b5fa92f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject' },
    { src: 'http://localhost:9000/q-insight/d9330ee6-abc9-4b6e-b526-2fd735dce052_43d489e5-1ec0-4c5c-a987-a3071379f070_download%20%282%29.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=admin%2F20260328%2Feuro-n-1%2Fs3%2Faws4_request&X-Amz-Date=20260328T231728Z&X-Amz-Expires=86400&X-Amz-Signature=cea787391ca13024afdc9a42cc6748a808d905cb58a6c1c8d2c2e9684b5fa92f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject' }

  ];


  const rightSideImages = [
    { src: 'http://localhost:9000/q-insight/89aee0ac-5f4d-4f23-9f54-ab2e14ac3636_download.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=admin%2F20260328%2Feuro-n-1%2Fs3%2Faws4_request&X-Amz-Date=20260328T231728Z&X-Amz-Expires=86400&X-Amz-Signature=f4eeecda48a3ce1256efcc3f432bb6465b44bbd62d93e4dd2bcd9291fccc3a06&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject' },
    { src: 'http://localhost:9000/q-insight/89aee0ac-5f4d-4f23-9f54-ab2e14ac3636_download.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=admin%2F20260328%2Feuro-n-1%2Fs3%2Faws4_request&X-Amz-Date=20260328T231728Z&X-Amz-Expires=86400&X-Amz-Signature=f4eeecda48a3ce1256efcc3f432bb6465b44bbd62d93e4dd2bcd9291fccc3a06&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject' },
    { src: 'http://localhost:9000/q-insight/89aee0ac-5f4d-4f23-9f54-ab2e14ac3636_download.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=admin%2F20260328%2Feuro-n-1%2Fs3%2Faws4_request&X-Amz-Date=20260328T231728Z&X-Amz-Expires=86400&X-Amz-Signature=f4eeecda48a3ce1256efcc3f432bb6465b44bbd62d93e4dd2bcd9291fccc3a06&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject' },
    { src: 'http://localhost:9000/q-insight/89aee0ac-5f4d-4f23-9f54-ab2e14ac3636_download.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=admin%2F20260328%2Feuro-n-1%2Fs3%2Faws4_request&X-Amz-Date=20260328T231728Z&X-Amz-Expires=86400&X-Amz-Signature=f4eeecda48a3ce1256efcc3f432bb6465b44bbd62d93e4dd2bcd9291fccc3a06&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject' },
    { src: 'http://localhost:9000/q-insight/d9330ee6-abc9-4b6e-b526-2fd735dce052_43d489e5-1ec0-4c5c-a987-a3071379f070_download%20%282%29.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=admin%2F20260328%2Feuro-n-1%2Fs3%2Faws4_request&X-Amz-Date=20260328T231728Z&X-Amz-Expires=86400&X-Amz-Signature=cea787391ca13024afdc9a42cc6748a808d905cb58a6c1c8d2c2e9684b5fa92f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject' },
    { src: 'http://localhost:9000/q-insight/d9330ee6-abc9-4b6e-b526-2fd735dce052_43d489e5-1ec0-4c5c-a987-a3071379f070_download%20%282%29.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=admin%2F20260328%2Feuro-n-1%2Fs3%2Faws4_request&X-Amz-Date=20260328T231728Z&X-Amz-Expires=86400&X-Amz-Signature=cea787391ca13024afdc9a42cc6748a808d905cb58a6c1c8d2c2e9684b5fa92f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject' },
    { src: 'http://localhost:9000/q-insight/d9330ee6-abc9-4b6e-b526-2fd735dce052_43d489e5-1ec0-4c5c-a987-a3071379f070_download%20%282%29.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=admin%2F20260328%2Feuro-n-1%2Fs3%2Faws4_request&X-Amz-Date=20260328T231728Z&X-Amz-Expires=86400&X-Amz-Signature=cea787391ca13024afdc9a42cc6748a808d905cb58a6c1c8d2c2e9684b5fa92f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject' },
    { src: 'http://localhost:9000/q-insight/d9330ee6-abc9-4b6e-b526-2fd735dce052_43d489e5-1ec0-4c5c-a987-a3071379f070_download%20%282%29.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=admin%2F20260328%2Feuro-n-1%2Fs3%2Faws4_request&X-Amz-Date=20260328T231728Z&X-Amz-Expires=86400&X-Amz-Signature=cea787391ca13024afdc9a42cc6748a808d905cb58a6c1c8d2c2e9684b5fa92f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject' },
    { src: 'http://localhost:9000/q-insight/d9330ee6-abc9-4b6e-b526-2fd735dce052_43d489e5-1ec0-4c5c-a987-a3071379f070_download%20%282%29.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=admin%2F20260328%2Feuro-n-1%2Fs3%2Faws4_request&X-Amz-Date=20260328T231728Z&X-Amz-Expires=86400&X-Amz-Signature=cea787391ca13024afdc9a42cc6748a808d905cb58a6c1c8d2c2e9684b5fa92f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject' },
    { src: 'http://localhost:9000/q-insight/d9330ee6-abc9-4b6e-b526-2fd735dce052_43d489e5-1ec0-4c5c-a987-a3071379f070_download%20%282%29.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=admin%2F20260328%2Feuro-n-1%2Fs3%2Faws4_request&X-Amz-Date=20260328T231728Z&X-Amz-Expires=86400&X-Amz-Signature=cea787391ca13024afdc9a42cc6748a808d905cb58a6c1c8d2c2e9684b5fa92f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject' },
    { src: 'http://localhost:9000/q-insight/d9330ee6-abc9-4b6e-b526-2fd735dce052_43d489e5-1ec0-4c5c-a987-a3071379f070_download%20%282%29.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=admin%2F20260328%2Feuro-n-1%2Fs3%2Faws4_request&X-Amz-Date=20260328T231728Z&X-Amz-Expires=86400&X-Amz-Signature=cea787391ca13024afdc9a42cc6748a808d905cb58a6c1c8d2c2e9684b5fa92f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject' },
    { src: 'http://localhost:9000/q-insight/d9330ee6-abc9-4b6e-b526-2fd735dce052_43d489e5-1ec0-4c5c-a987-a3071379f070_download%20%282%29.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=admin%2F20260328%2Feuro-n-1%2Fs3%2Faws4_request&X-Amz-Date=20260328T231728Z&X-Amz-Expires=86400&X-Amz-Signature=cea787391ca13024afdc9a42cc6748a808d905cb58a6c1c8d2c2e9684b5fa92f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject' },
    { src: 'http://localhost:9000/q-insight/89aee0ac-5f4d-4f23-9f54-ab2e14ac3636_download.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=admin%2F20260328%2Feuro-n-1%2Fs3%2Faws4_request&X-Amz-Date=20260328T231728Z&X-Amz-Expires=86400&X-Amz-Signature=f4eeecda48a3ce1256efcc3f432bb6465b44bbd62d93e4dd2bcd9291fccc3a06&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject' },
    { src: 'http://localhost:9000/q-insight/89aee0ac-5f4d-4f23-9f54-ab2e14ac3636_download.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=admin%2F20260328%2Feuro-n-1%2Fs3%2Faws4_request&X-Amz-Date=20260328T231728Z&X-Amz-Expires=86400&X-Amz-Signature=f4eeecda48a3ce1256efcc3f432bb6465b44bbd62d93e4dd2bcd9291fccc3a06&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject' },
  ];
  const nokImagesData = [
    { id: 1, filePath: leftSideImages[0].src, qualityStatus: 'NOK' },
    { id: 3, filePath: leftSideImages[1].src, qualityStatus: 'NOK' },
    { id: 5, filePath: leftSideImages[2].src, qualityStatus: 'NOK' },
    { id: 7, filePath: leftSideImages[3].src, qualityStatus: 'NOK' },
    { id: 9, filePath: leftSideImages[4].src, qualityStatus: 'NOK' },
    { id: 10, filePath: leftSideImages[5].src, qualityStatus: 'NOK' },
    { id: 11, filePath: leftSideImages[6].src, qualityStatus: 'NOK' },
    { id: 12, filePath: leftSideImages[7].src, qualityStatus: 'NOK' },
    { id: 13, filePath: leftSideImages[8].src, qualityStatus: 'NOK' },
    { id: 14, filePath: leftSideImages[9].src, qualityStatus: 'NOK' },
    { id: 15, filePath: leftSideImages[10].src, qualityStatus: 'NOK' }
  ];

  const okImagesData = [
    { id: 2, filePath: rightSideImages[0].src, qualityStatus: 'OK' },
    { id: 4, filePath: rightSideImages[1].src, qualityStatus: 'OK' },
    { id: 6, filePath: rightSideImages[2].src, qualityStatus: 'OK' },
    { id: 8, filePath: rightSideImages[3].src, qualityStatus: 'OK' },
    { id: 16, filePath: rightSideImages[4].src, qualityStatus: 'OK' },
    { id: 17, filePath: rightSideImages[5].src, qualityStatus: 'OK' },
    { id: 18, filePath: rightSideImages[6].src, qualityStatus: 'OK' },
    { id: 19, filePath: rightSideImages[7].src, qualityStatus: 'OK' },
    { id: 20, filePath: rightSideImages[8].src, qualityStatus: 'OK' },
    { id: 21, filePath: rightSideImages[9].src, qualityStatus: 'OK' }
  ];

  return (
    <Paper
      sx={{ marginTop: 1, border: 'solid', borderRadius: 2, borderColor: '#1976d270', width: '99.7%', height: '85vh' }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" borderRadius={2} bgcolor={'#1976d270'}>
        <Grid container bgcolor={'#1976d2d9'} color={'white'} justifyContent={'space-between'} flexDirection={'row'}>
          <Typography margin={1}>Image Comparisson</Typography>
          <Button onClick={() => navigation.navigate('/')} variant="contained" sx={{ height: '39px' }}>
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
