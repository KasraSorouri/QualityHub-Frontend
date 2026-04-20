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


  console.log('images ->', images);


  /* MOOC DATA */
  const rightSideImages = [
    { src: 'http://127.0.0.1:9001/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL3EtaW5zaWdodC80MDgwMWI1MC01ODgyLTQwZjQtOGI4MC01NWVjNTZmZDM5YTRfaW1hZ2VzLmpwZWc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD02U0ZTMDYyMkFMUzhUMVU2OVJJSCUyRjIwMjYwNDE5JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDQxOVQwOTI3NTRaJlgtQW16LUV4cGlyZXM9NDMyMDAmWC1BbXotU2VjdXJpdHktVG9rZW49ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmhZMk5sYzNOTFpYa2lPaUkyVTBaVE1EWXlNa0ZNVXpoVU1WVTJPVkpKU0NJc0ltVjRjQ0k2TVRjM05qWXpNalF6TWl3aWNHRnlaVzUwSWpvaVlXUnRhVzRpZlEuTXBFZHRQTjQ5eFI3OVNLSGdxRkhHUS1YSkc3UVdUbV9zNXdXZExOcnNUYXY3N0Zva0hOVnVMRDV2NGVSTjhLNTdkNDg4MVBhREJLOUZhZ3RPVVJjX3cmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnZlcnNpb25JZD1udWxsJlgtQW16LVNpZ25hdHVyZT05YjdmYmJjYmU1MWQ0ODcyMTJmYjJiMTk1YTEzYjFiNTI4YzRhOTY1MWMxZmI5MGViODMxODUzODYyMDM0ZTQw' },
    { src: 'http://127.0.0.1:9001/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL3EtaW5zaWdodC80MDgwMWI1MC01ODgyLTQwZjQtOGI4MC01NWVjNTZmZDM5YTRfaW1hZ2VzLmpwZWc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD02U0ZTMDYyMkFMUzhUMVU2OVJJSCUyRjIwMjYwNDE5JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDQxOVQwOTI3NTRaJlgtQW16LUV4cGlyZXM9NDMyMDAmWC1BbXotU2VjdXJpdHktVG9rZW49ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmhZMk5sYzNOTFpYa2lPaUkyVTBaVE1EWXlNa0ZNVXpoVU1WVTJPVkpKU0NJc0ltVjRjQ0k2TVRjM05qWXpNalF6TWl3aWNHRnlaVzUwSWpvaVlXUnRhVzRpZlEuTXBFZHRQTjQ5eFI3OVNLSGdxRkhHUS1YSkc3UVdUbV9zNXdXZExOcnNUYXY3N0Zva0hOVnVMRDV2NGVSTjhLNTdkNDg4MVBhREJLOUZhZ3RPVVJjX3cmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnZlcnNpb25JZD1udWxsJlgtQW16LVNpZ25hdHVyZT05YjdmYmJjYmU1MWQ0ODcyMTJmYjJiMTk1YTEzYjFiNTI4YzRhOTY1MWMxZmI5MGViODMxODUzODYyMDM0ZTQw' },
    { src: 'http://127.0.0.1:9001/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL3EtaW5zaWdodC80MDgwMWI1MC01ODgyLTQwZjQtOGI4MC01NWVjNTZmZDM5YTRfaW1hZ2VzLmpwZWc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD02U0ZTMDYyMkFMUzhUMVU2OVJJSCUyRjIwMjYwNDE5JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDQxOVQwOTI3NTRaJlgtQW16LUV4cGlyZXM9NDMyMDAmWC1BbXotU2VjdXJpdHktVG9rZW49ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmhZMk5sYzNOTFpYa2lPaUkyVTBaVE1EWXlNa0ZNVXpoVU1WVTJPVkpKU0NJc0ltVjRjQ0k2TVRjM05qWXpNalF6TWl3aWNHRnlaVzUwSWpvaVlXUnRhVzRpZlEuTXBFZHRQTjQ5eFI3OVNLSGdxRkhHUS1YSkc3UVdUbV9zNXdXZExOcnNUYXY3N0Zva0hOVnVMRDV2NGVSTjhLNTdkNDg4MVBhREJLOUZhZ3RPVVJjX3cmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnZlcnNpb25JZD1udWxsJlgtQW16LVNpZ25hdHVyZT05YjdmYmJjYmU1MWQ0ODcyMTJmYjJiMTk1YTEzYjFiNTI4YzRhOTY1MWMxZmI5MGViODMxODUzODYyMDM0ZTQw' },
    { src: 'http://127.0.0.1:9001/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL3EtaW5zaWdodC80MDgwMWI1MC01ODgyLTQwZjQtOGI4MC01NWVjNTZmZDM5YTRfaW1hZ2VzLmpwZWc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD02U0ZTMDYyMkFMUzhUMVU2OVJJSCUyRjIwMjYwNDE5JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDQxOVQwOTI3NTRaJlgtQW16LUV4cGlyZXM9NDMyMDAmWC1BbXotU2VjdXJpdHktVG9rZW49ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmhZMk5sYzNOTFpYa2lPaUkyVTBaVE1EWXlNa0ZNVXpoVU1WVTJPVkpKU0NJc0ltVjRjQ0k2TVRjM05qWXpNalF6TWl3aWNHRnlaVzUwSWpvaVlXUnRhVzRpZlEuTXBFZHRQTjQ5eFI3OVNLSGdxRkhHUS1YSkc3UVdUbV9zNXdXZExOcnNUYXY3N0Zva0hOVnVMRDV2NGVSTjhLNTdkNDg4MVBhREJLOUZhZ3RPVVJjX3cmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnZlcnNpb25JZD1udWxsJlgtQW16LVNpZ25hdHVyZT05YjdmYmJjYmU1MWQ0ODcyMTJmYjJiMTk1YTEzYjFiNTI4YzRhOTY1MWMxZmI5MGViODMxODUzODYyMDM0ZTQw' },
    { src: 'http://127.0.0.1:9001/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL3EtaW5zaWdodC80MDgwMWI1MC01ODgyLTQwZjQtOGI4MC01NWVjNTZmZDM5YTRfaW1hZ2VzLmpwZWc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD02U0ZTMDYyMkFMUzhUMVU2OVJJSCUyRjIwMjYwNDE5JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDQxOVQwOTI3NTRaJlgtQW16LUV4cGlyZXM9NDMyMDAmWC1BbXotU2VjdXJpdHktVG9rZW49ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmhZMk5sYzNOTFpYa2lPaUkyVTBaVE1EWXlNa0ZNVXpoVU1WVTJPVkpKU0NJc0ltVjRjQ0k2TVRjM05qWXpNalF6TWl3aWNHRnlaVzUwSWpvaVlXUnRhVzRpZlEuTXBFZHRQTjQ5eFI3OVNLSGdxRkhHUS1YSkc3UVdUbV9zNXdXZExOcnNUYXY3N0Zva0hOVnVMRDV2NGVSTjhLNTdkNDg4MVBhREJLOUZhZ3RPVVJjX3cmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnZlcnNpb25JZD1udWxsJlgtQW16LVNpZ25hdHVyZT05YjdmYmJjYmU1MWQ0ODcyMTJmYjJiMTk1YTEzYjFiNTI4YzRhOTY1MWMxZmI5MGViODMxODUzODYyMDM0ZTQw' },
    { src: 'http://127.0.0.1:9001/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL3EtaW5zaWdodC80MDgwMWI1MC01ODgyLTQwZjQtOGI4MC01NWVjNTZmZDM5YTRfaW1hZ2VzLmpwZWc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD02U0ZTMDYyMkFMUzhUMVU2OVJJSCUyRjIwMjYwNDE5JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDQxOVQwOTI3NTRaJlgtQW16LUV4cGlyZXM9NDMyMDAmWC1BbXotU2VjdXJpdHktVG9rZW49ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmhZMk5sYzNOTFpYa2lPaUkyVTBaVE1EWXlNa0ZNVXpoVU1WVTJPVkpKU0NJc0ltVjRjQ0k2TVRjM05qWXpNalF6TWl3aWNHRnlaVzUwSWpvaVlXUnRhVzRpZlEuTXBFZHRQTjQ5eFI3OVNLSGdxRkhHUS1YSkc3UVdUbV9zNXdXZExOcnNUYXY3N0Zva0hOVnVMRDV2NGVSTjhLNTdkNDg4MVBhREJLOUZhZ3RPVVJjX3cmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnZlcnNpb25JZD1udWxsJlgtQW16LVNpZ25hdHVyZT05YjdmYmJjYmU1MWQ0ODcyMTJmYjJiMTk1YTEzYjFiNTI4YzRhOTY1MWMxZmI5MGViODMxODUzODYyMDM0ZTQw' },
    { src: 'http://127.0.0.1:9001/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL3EtaW5zaWdodC80MDgwMWI1MC01ODgyLTQwZjQtOGI4MC01NWVjNTZmZDM5YTRfaW1hZ2VzLmpwZWc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD02U0ZTMDYyMkFMUzhUMVU2OVJJSCUyRjIwMjYwNDE5JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDQxOVQwOTI3NTRaJlgtQW16LUV4cGlyZXM9NDMyMDAmWC1BbXotU2VjdXJpdHktVG9rZW49ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmhZMk5sYzNOTFpYa2lPaUkyVTBaVE1EWXlNa0ZNVXpoVU1WVTJPVkpKU0NJc0ltVjRjQ0k2TVRjM05qWXpNalF6TWl3aWNHRnlaVzUwSWpvaVlXUnRhVzRpZlEuTXBFZHRQTjQ5eFI3OVNLSGdxRkhHUS1YSkc3UVdUbV9zNXdXZExOcnNUYXY3N0Zva0hOVnVMRDV2NGVSTjhLNTdkNDg4MVBhREJLOUZhZ3RPVVJjX3cmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnZlcnNpb25JZD1udWxsJlgtQW16LVNpZ25hdHVyZT05YjdmYmJjYmU1MWQ0ODcyMTJmYjJiMTk1YTEzYjFiNTI4YzRhOTY1MWMxZmI5MGViODMxODUzODYyMDM0ZTQw' },
    { src: 'http://127.0.0.1:9001/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL3EtaW5zaWdodC80MDgwMWI1MC01ODgyLTQwZjQtOGI4MC01NWVjNTZmZDM5YTRfaW1hZ2VzLmpwZWc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD02U0ZTMDYyMkFMUzhUMVU2OVJJSCUyRjIwMjYwNDE5JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDQxOVQwOTI3NTRaJlgtQW16LUV4cGlyZXM9NDMyMDAmWC1BbXotU2VjdXJpdHktVG9rZW49ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmhZMk5sYzNOTFpYa2lPaUkyVTBaVE1EWXlNa0ZNVXpoVU1WVTJPVkpKU0NJc0ltVjRjQ0k2TVRjM05qWXpNalF6TWl3aWNHRnlaVzUwSWpvaVlXUnRhVzRpZlEuTXBFZHRQTjQ5eFI3OVNLSGdxRkhHUS1YSkc3UVdUbV9zNXdXZExOcnNUYXY3N0Zva0hOVnVMRDV2NGVSTjhLNTdkNDg4MVBhREJLOUZhZ3RPVVJjX3cmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnZlcnNpb25JZD1udWxsJlgtQW16LVNpZ25hdHVyZT05YjdmYmJjYmU1MWQ0ODcyMTJmYjJiMTk1YTEzYjFiNTI4YzRhOTY1MWMxZmI5MGViODMxODUzODYyMDM0ZTQw' },
    { src: 'http://127.0.0.1:9001/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL3EtaW5zaWdodC80MDgwMWI1MC01ODgyLTQwZjQtOGI4MC01NWVjNTZmZDM5YTRfaW1hZ2VzLmpwZWc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD02U0ZTMDYyMkFMUzhUMVU2OVJJSCUyRjIwMjYwNDE5JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDQxOVQwOTI3NTRaJlgtQW16LUV4cGlyZXM9NDMyMDAmWC1BbXotU2VjdXJpdHktVG9rZW49ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmhZMk5sYzNOTFpYa2lPaUkyVTBaVE1EWXlNa0ZNVXpoVU1WVTJPVkpKU0NJc0ltVjRjQ0k2TVRjM05qWXpNalF6TWl3aWNHRnlaVzUwSWpvaVlXUnRhVzRpZlEuTXBFZHRQTjQ5eFI3OVNLSGdxRkhHUS1YSkc3UVdUbV9zNXdXZExOcnNUYXY3N0Zva0hOVnVMRDV2NGVSTjhLNTdkNDg4MVBhREJLOUZhZ3RPVVJjX3cmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnZlcnNpb25JZD1udWxsJlgtQW16LVNpZ25hdHVyZT05YjdmYmJjYmU1MWQ0ODcyMTJmYjJiMTk1YTEzYjFiNTI4YzRhOTY1MWMxZmI5MGViODMxODUzODYyMDM0ZTQw' }
];
  const nokImagesData = images

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
  ];

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
