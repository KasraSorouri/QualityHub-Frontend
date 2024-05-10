import {
  Divider,
  Grid,
} from '@mui/material';

import { NokCode, Station, WorkShift, NokAnalyseData, NewNokAnalyseData, NokData, DismantledMaterial, Rework } from '../../../../types/QualityHubTypes';
import { useEffect, useState } from 'react';
import nokDetectServices from '../../services/nokDetectServices';
import NOK_Info from './NOK_Info';
import ReworkChooseList from './ReworkChooseList';
import NokDismantledMaterial from './NOK_DismantleMaterial';

type NokFromProps = {
  nokId: number,
  formType: 'ADD' | 'EDIT' | 'VIEW';
  nokAnalyseData?: NokAnalyseData | NewNokAnalyseData  | null;
  removeNok: (nok: null) => void;
}

type FormData = {
  nokCode: NokCode | null;
  causeStation: Station | null;
  causeShift: WorkShift | null;
  description: string;
  timeWaste?: number;
  materialCost?: number;
  closed: boolean;
  NokRework?: number[];
  DismantledMaterials?: DismantledMaterial[];
}

const NokReworkForm = ({ nokId, nokAnalyseData, formType }: NokFromProps) => {
  console.log('NOK Rework * nok ID ->', nokId);

  //const submitTitle = formType === 'ADD' ? 'Add' : 'Update';

  const initFormValues: FormData = {
    nokCode: nokAnalyseData?.nokCode ? nokAnalyseData.nokCode : null,
    causeStation: nokAnalyseData?.causeStation ? nokAnalyseData.causeStation : null,
    causeShift: nokAnalyseData?.causeShift ? nokAnalyseData.causeShift : null,
    description: nokAnalyseData ? nokAnalyseData.description : '',
    closed: nokAnalyseData ? nokAnalyseData.closed : false,
    NokRework: [],
  };

  const [ formValues, setFormValues ] = useState<FormData>(initFormValues);
  const [ nok, setNok ] = useState<NokData | null>(null);
  const [ dismantledMaterials, setDismantledMaterial ] = useState<DismantledMaterial[] | never[]>([]);

  console.log('NOK Rework * NOK Data ->', nok);
  console.log('NOK Rework * formValues ->', formValues);
  console.log('NOK Rework * dismantledMaterials ->', dismantledMaterials);


  useEffect(() => {
    setFormValues(initFormValues);
    const getNokData = async () => {
      const result = await nokDetectServices.getNokDetectById(nokId);
      setNok(result);
    };
    getNokData();
  },[formType]);

  // Handle Select Rework
  const handleSelectRework = (reworks: Rework[]) => {
    let dismantledMaterials : DismantledMaterial[] = [];
    const newNokReworks = reworks.map(rework => {
      rework.RwDismantledMaterials ? dismantledMaterials = dismantledMaterials.concat(rework.RwDismantledMaterials) : null;
      return (rework.id);
    });
    setFormValues({ ...formValues, NokRework: newNokReworks });
    setDismantledMaterial(dismantledMaterials);
  };


  const handleDismantledMaterial = (dismantledMaterials : DismantledMaterial[]) => {
    // Calculate Material Cost
    const materialCost = dismantledMaterials.reduce((totalCost, item) => {
      const cost = item.recipeBom.material.price ? item.actualDismantledQty * item.recipeBom.material.price : 0;
      return totalCost + cost;
    }, 0);
    console.log(' material cost ->', materialCost);
    setFormValues({ ...formValues, DismantledMaterials: dismantledMaterials, materialCost: materialCost });
  };

  /*
  // handle Changes
  const handleChange = (event: {target: { name: string, value: unknown, checked: boolean}}) => {
    const { name, value, checked } = event.target;
    const newValue = name === 'active' ? checked : value;

    setFormValues((prevValues: FormData) => ({
      ...prevValues,
      [name]: newValue,
    }));
  };

  const handleAutoCompeletChange = (parameter: string, newValue: Product | Station | WorkShift | NokCode) => {

    setFormValues((prevValues: FormData) => ({
      ...prevValues,
      [`${parameter}`]: newValue,
    }));
  };



  const handleSubmit = async (event: {preventDefault: () => void}) => {
    event.preventDefault();
    if (formType === 'ADD') {

      console.log(' *** NOK registeration * Submit form * newNokData -> ',formValues);
      //console.log(' *** NOK registeration * Submit form * result -> ', result);

    } else {
      console.log(' *** NOK registeration * Submit form * Error -> ', 'Missing data');
    }
  };

*/
  if (!nok) {
    return(
      <div>
        loading ....
      </div>
    );
  }
  return (
    <Grid container direction={'column'}>
      <Grid container direction={'row'}>
        <Grid item xs={8}>
          <NOK_Info nokId={nokId} />
        </Grid>
        <Grid item xs={4}>
        test Button
        </Grid>
      </Grid>
      <Divider sx={{ margin:1 }}/>
      <ReworkChooseList productId={nok.product.id} selectedReworks={[]} confirmSelection={handleSelectRework} confirmChange={() => { console.log('confirm change');} } editable={true} />
      <Divider sx={{ margin:1 }}/>
      <NokDismantledMaterial affectedMaterials={dismantledMaterials} confirmSelection={handleDismantledMaterial} confirmChange={() => { console.log('confirm change');} } editable={true} />
    </Grid>
  );
};

export default NokReworkForm;