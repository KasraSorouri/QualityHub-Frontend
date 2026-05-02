import { useEffect, useState } from "react";
import { IImage } from "../../../../../types/QualityHubTypes";
import nokImageService from "../../../services/nokImageService";
import ImageViewer from "../../imageView/ImageViewer";



interface IImageAnalyseProps {
  nokId: number;
  closeWindow: () => void;
}


const ImageAnalyse = ({nokId, closeWindow} : IImageAnalyseProps) => {

  const [nokImages, setNokImages] = useState<IImage[]>([]);
  
   // Download NOK Images
  useEffect(() => {
    // Fetch NOK Images 
    const fetchNokImages = async () => {
      try {
        const response = await nokImageService.getNokImages(nokId);
        setNokImages(response);
      } catch (err) {
        console.log(err);
      }
    };
    fetchNokImages();
    
  },[nokId]);


  return (
    <ImageViewer images={nokImages} closeWindow={closeWindow} />
  )
}

export default ImageAnalyse;