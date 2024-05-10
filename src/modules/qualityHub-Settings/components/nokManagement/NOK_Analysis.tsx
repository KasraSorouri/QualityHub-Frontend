import { useState } from 'react';

import { Paper } from '@mui/material';

import NokAnalyseForm from './NOK_Analyse_Form';
import NokList from './NOK_List';

import { NokData } from '../../../../types/QualityHubTypes';



const NokAnalysis = () => {

  const [ selectedNok, setSelectedNok ] = useState<NokData | null>(null);

  return (
    <Paper>
      <h1>Nok Analysis</h1>
      { selectedNok ? <NokAnalyseForm nokId={selectedNok.id} formType='ADD'  removeNok={setSelectedNok} /> :
        <NokList listType='ANALYSE' selectNok={setSelectedNok} />
      }
    </Paper>
  );

};

export default NokAnalysis;