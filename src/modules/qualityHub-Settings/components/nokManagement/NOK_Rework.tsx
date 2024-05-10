import { useState } from 'react';

import { Paper } from '@mui/material';

import NokList from './NOK_List';

import { NokData } from '../../../../types/QualityHubTypes';
import NokReworkForm from './NOK_Rework_Form';



const Nokreworks = () => {

  const [ selectedNok, setSelectedNok ] = useState<NokData | null>(null);

  return (
    <Paper>
      <h1>Nok Reworks</h1>
      { selectedNok ? <NokReworkForm nokId={selectedNok.id} formType='ADD'  removeNok={setSelectedNok} /> :
        <NokList listType='ANALYSE' selectNok={setSelectedNok} />
      }
    </Paper>
  );

};

export default Nokreworks;