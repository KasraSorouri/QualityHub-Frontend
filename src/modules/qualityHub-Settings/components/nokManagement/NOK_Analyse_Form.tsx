import {
	Autocomplete,
	Box,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	FilledTextFieldProps,
	Grid,
	IconButton,
	OutlinedTextFieldProps,
	StandardTextFieldProps,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	TextFieldVariants,
	Typography
} from '@mui/material';

import { NokCode, Station, WorkShift, Product, NokAnalyseData, NewNokAnalyseData, NokData, RCA, NewRca, NokCodeS, ClassCode, ReworkStatus } from '../../../../types/QualityHubTypes';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import stationServices from '../../services/stationServices';
import nokCodeServices from '../../services/nokCodeServices';
import workShiftServices from '../../services/workShiftServices';
import nokDetectServices from '../../services/nokDetectServices';
import NOK_Reg_Form from './NOK_Reg_Form';
import RCAs_Form from './RCAs_Form';
import NokReworkForm from './NOK_Rework_Form';

import CloseIcon from "@mui/icons-material/Close";
import NokCostForm from './NOK_Cost_Form';
import nokrcaServices from '../../services/nokRcaServices';
import nokRcaServices from '../../services/nokRcaServices';
import nokAnalyseServices from '../../services/nokAnalyseServices';
import classCodeServices from '../../services/classCodeServices';
import NokStatus from './NokStatus';

type NokFromProps = {
	nokId: number,
	formType: 'ADD' | 'EDIT' | 'VIEW';
	nokAnalyseData?: NokAnalyseData | null;
	removeNok: (nok: null) => void;
}

type FormData = {
	nokCode: NokCodeS | null;
	causeStation: Station | null;
	causeShift: WorkShift | null;
	classCode: ClassCode | null;
	description: string;
	timeWaste?: number;
	materialWaste?: number;
	closed: boolean;
	costData?: {[key: string]: number }
}

const NokAnalyseForm = ({ nokId, nokAnalyseData, formType, removeNok }: NokFromProps) => {
	console.log('nok ID ->', nokId);
	console.log('** nok anaylzie DATA->', nokAnalyseData);

	//const fakeRCA : RCA[] | undefined = nokAnalyseData?.rcas

	const submitTitle = formType === 'ADD' ? 'Add' : 'Update';

	const initFormValues: FormData = {
		nokCode: nokAnalyseData?.nokCode || null,
		causeStation: nokAnalyseData?.causeStation || null,
		causeShift: nokAnalyseData?.causeShift || null,
		classCode: nokAnalyseData?.classCode || null,
		description: nokAnalyseData ? nokAnalyseData.description : '',
		closed: nokAnalyseData ? nokAnalyseData.closed : false,
		costData: nokAnalyseData?.costResult
	};

	const [ formValues, setFormValues ] = useState<FormData>(initFormValues);
	const [ nok, setNok ] = useState<NokData | null>(null);
	const [ showReworkForm, setShowReworkForm ] = useState<boolean>(false)
	const [ showCostForm, setShowCostForm ] = useState<boolean>(false)


	console.log('NOK Analyse * NOK Data ->', nok);
	console.log('NOK Analyse * showReworkForm Data ->', showReworkForm);
	console.log('NOK Analyse * show Form Value ->', formValues);


	useEffect(() => {
		const getInitData = async () => {
			const nokResult = await nokDetectServices.getNokDetectById(nokId);
			setNok(nokResult);
			const analyseResults = await nokAnalyseServices.getNokAnalyseByNokId(nokId);
			console.log('* Nok Analize Form * Analyse ->', analyseResults);
			const newFormValue: FormData = {
					nokCode: analyseResults.nokCode,
					causeStation: analyseResults.causeStation,
					causeShift: analyseResults.causeShift,
					classCode: analyseResults.classCode,
					description: analyseResults.description,
					closed: analyseResults.closed,
					costData: analyseResults.costResult
				}
				console.log('* Nok Analize Form * newFormValue ->', newFormValue);

				setFormValues(newFormValue);
				console.log('$$$$ Nok Analize Form * form value * effect ->', formValues);

		}
		getInitData();

	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[nokId]);

	// Get Analyse Data for Nok ID


	// Get RCAs for NOK ID
	const rcaResults = useQuery(['rcas', nokId], () => nokrcaServices.getNokRcaByNokId(nokId), { refetchOnWindowFocus: false });
	let rcaList: RCA[] = rcaResults.data || [];

	console.log('* Nok Analize Form * RCA List ->', rcaList);
	
	// get Station List
	const stationResults = useQuery('stations',stationServices.getStation, { refetchOnWindowFocus: false });
	const stationList: Station[] = stationResults.data || [];

	// Get NOK Code List
	const nokCodeResults = useQuery('nokCodes', nokCodeServices.getNokCode, { refetchOnWindowFocus: false });
	const nokCodeList: NokCode[] = nokCodeResults.data || [];

	// Get Work Shift List
	const workShiftResults = useQuery('workShifts', workShiftServices.getShift, { refetchOnWindowFocus: false });
	const workShiftList: WorkShift[] = workShiftResults.data || [];

	// Get Nok Class Code List 
	const nokClassCodeResults = useQuery('nokClassCodes', classCodeServices.getClassCode, { refetchOnWindowFocus: false });
	const nokClassCodeList: ClassCode [] = nokClassCodeResults.data || [];


	// handle Changes
	const handleChange = (event: {target: { name: string, value: unknown, checked: boolean}}) => {
		const { name, value, checked } = event.target;
		const newValue = name === 'active' ? checked : value;

		setFormValues((prevValues: FormData) => ({
			...prevValues,
			[name]: newValue,
		}));
	};

	const handleAutoCompeletChange = (parameter: string, newValue: Product | Station | WorkShift | NokCodeS | ClassCode) => {

		setFormValues((prevValues: FormData) => ({
			...prevValues,
			[`${parameter}`]: newValue,
		}));
	};

	const handleUpdateRCA = async(rca: NewRca) : Promise<boolean> => {
		console.log(' *** NOK registeration * Update RCA * rcas -> ', rca);
		try {
			const result = await nokRcaServices.createNokRca(rca)
			console.log(' * Nok Analyze form * Updated RCA ->', result);
			rcaList = rcaList.concat(result) 
			return true
		} catch (error) {
			console.log(' * Nok Analyze form * Updated RCA ->', error);
			return false
		}
	};

	const handleSubmit = async (event: {preventDefault: () => void}) => {
		event.preventDefault();
		if (formType === 'ADD' &&
			formValues.nokCode &&
			formValues.causeStation &&
			formValues.causeShift &&
			formValues.classCode
		) {
			console.log(' *** Analyse registeration * Submit form * Analyse Data -> ',formValues);
			const newNokAnalyse: NewNokAnalyseData = {
				id: nokAnalyseData?.id,
				nokId: nokId,
				nokCodeId: formValues.nokCode.id,
				causeStationId: formValues.causeStation.id,
				causeShiftId: formValues.causeShift.id,
				classCodeId: formValues.classCode.id,
				description: formValues.description,
				closed: formValues.closed,
				};
			const result = nokAnalyseServices.createNokAnalyse(newNokAnalyse);
			console.log(' *** Analyse registeration * Submit form * Result -> ',result);
		} else {
			console.log(' *** Analyse registeration * Submit form * Error -> ', 'Missing data');
		}
	};

	const nokStatus  = {
		rcaStatus: rcaList.length > 0 ? 'OK' : undefined,
		costStatus: formValues.costData && (formValues.costData.issue == 1 ? 'SomeIssues' : formValues.costData.IQC > 0 ? 'IQC' : 'OK'),
		reworkStatus: 'OK',
		analyseSatus: formValues.nokCode ? 'OK' : undefined,
		claimStatus:  formValues.costData && (formValues.costData.approved > 0 ? 'Accepted' : formValues.costData.pendding > 0 ? 'Pending' : formValues.costData.rejected > 0 ? 'Rejected' : undefined )
	} 
	


	return (
		<Grid container direction={'column'}>
			<Grid container direction={'row'} >
  			<Grid direction={'column'} xs={7}>
					<Grid item>
						<Typography variant='h5' marginLeft={2}>
							Detect Information
						</Typography>
						<NOK_Reg_Form formType={'VIEW'} nokData={nok} />
					</Grid>
					<Divider sx={{ margin:1 }}/>
					<Grid item>
						<Typography variant='h5' marginLeft={2}>
							Origin of NOK
						</Typography>
						<Box>
							<form onSubmit={handleSubmit} >
								<Grid container direction={'column'} sx={{ background: '#FEC0D4' }}>
									<Grid container width={'100%'} flexDirection={'row'} >
										<Autocomplete
											id='causeStation'
											sx={{ marginLeft: 2, marginTop: 1, width: '25%', minWidth: '200px' }}
											size='small'
											aria-required
											options={stationList}
											isOptionEqualToValue={
												(option: Station, value: Station) => option.stationName === value.stationName
											}
											value={formValues.causeStation ? formValues.causeStation : null}
											onChange={(_event, newValue) => newValue && handleAutoCompeletChange('causeStation', newValue)}
											getOptionLabel={(option: { stationName: string; }) => option.stationName}
											renderInput={(params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps, 'variant'>) => (
												<TextField
													{...params}
													label='Station'
													placeholder='Add Station'
													size='small'
													required
												/>
											)}
										/>
										<Autocomplete
											id='nokCode'
											sx={{ marginLeft: 2, marginTop: 1, width: '15%', minWidth: '150px' }}
											size='small'
								aria-required
								options={nokCodeList}
								isOptionEqualToValue={
									(option: NokCodeS, value: NokCodeS) => option.nokCode === value.nokCode
								}
								value={formValues.nokCode ? formValues.nokCode : null}
								onChange={(_event, newValue) => newValue && handleAutoCompeletChange('nokCode', newValue)}
								getOptionLabel={(option: { nokCode: string; }) => option.nokCode}
								renderInput={(params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps, 'variant'>) => (
									<TextField
										{...params}
										label='NOK Code'
										placeholder='NOK Code'
										size='small'
										required
									/>
								)}
							/>
							<Autocomplete
								id='causeShift'
								sx={{ marginLeft: 2, marginTop: 1, width: '15%', minWidth:'140px' }}
								size='small'
								aria-required
								options={workShiftList}
								isOptionEqualToValue={
									(option: WorkShift, value: WorkShift) => option.shiftName === value.shiftName
								}
								value={formValues.causeShift ? formValues.causeShift : null}
								onChange={(_event, newValue) => newValue && handleAutoCompeletChange('causeShift', newValue)}
								getOptionLabel={(option: { shiftName: string; }) => option.shiftName}
								renderInput={(params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps, 'variant'>) => (
									<TextField
										{...params}
										label='Shift'
										placeholder='Shift'
										size='small'
										required
									/>
								)}
							/>
							<Autocomplete
								id='classCode'
								sx={{ marginLeft: 2, marginTop: 1, width: '20%', minWidth:'140px' }}
								size='small'
								aria-required
								options={nokClassCodeList}
								isOptionEqualToValue={
									(option: ClassCode, value: ClassCode) => option.classCode === value.classCode
								}
								value={formValues.classCode ? formValues.classCode : null}
								onChange={(_event, newValue) => newValue && handleAutoCompeletChange('classCode', newValue)}
								getOptionLabel={(option: { className: string; }) => option.className}
								renderInput={(params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps, 'variant'>) => (
									<TextField
										{...params}
										label='Class Code'
										placeholder='Class Code'
										size='small'
										required
									/>
								)}
							/>
						</Grid>
						<Grid display={'flex'}>
							<TextField
								id="description"
								name="description"
								label="Description"
								sx={{ marginLeft: 2, marginTop: 1 , width:'85%' }}
								value={formValues.description}
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
								fullWidth
								size='small'
							/>
							<Button type='submit' variant='contained' color='primary' size='small' sx={{ margin: 1,  marginLeft: 1, width: 'auto', height: '38px' }}>
								{submitTitle}
							</Button>
						</Grid>
					</Grid>
				</form>
						</Box>
			  	</Grid>
				</Grid>
			<Grid  direction={'row'}xs={5} >

			<Grid item marginTop={5}>
						<Button variant='contained' sx={{ marginLeft: 2 }} onClick={() => setShowReworkForm(true)}>
							Rework
						</Button>
						<Button variant='contained' sx={{ marginLeft: 2 }} onClick={() => setShowCostForm(true)}>
							Calculate Cost
						</Button>
						<Button onClick={() => removeNok(null)} variant='contained' color='primary' size='small' sx={{ margin: 1,  marginLeft: 1, width: 'auto', height: '38px' }}>
							Back
						</Button>
						<Box>
							<NokStatus status={nokStatus} />
						</Box>
						<Box marginLeft={2}>
							<Table size='small' sx={{ maxWidth: '250px', marginTop: 3 }}>
								<TableHead sx={{ fontSize: 18,  fontWeight: 'bold'}}>
								Dismantled Material Cost
								</TableHead>
								<TableBody>
									<TableRow>
										<TableCell sx={{ color: 'red'}}>SCRAPPED</TableCell>
										<TableCell sx={{ color: 'red'}}>{formValues.costData?.SCRAPPED}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell sx={{ color: 'orange'}}>IQC</TableCell>
										<TableCell sx={{ color: 'orange'}}>{formValues.costData?.IQC}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell sx={{ color: 'green'}}>OK</TableCell>
										<TableCell sx={{ color: 'green'}}>{formValues.costData?.OK}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell sx={{ color: 'blue'}}>CLAIMED</TableCell>
										<TableCell sx={{ color: 'blue'}}>{formValues.costData?.CLAIMED}</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</Box>
					</Grid>
					</Grid>
					</Grid>
		
			<Divider sx={{ margin:1 }}/>
			<Typography variant='h5' marginLeft={2} >
				Root Cause Analysis
			</Typography>
			<Grid >
			<RCAs_Form nokId={nokId} formType={'ADD'} rcas={rcaList} updateRCA={handleUpdateRCA} />
			</Grid>
			<Dialog open={showReworkForm}
							fullWidth
							maxWidth="xl"
							sx={{
								'& .MuiDialog-paper': {
									minHeight: '400px', 
									maxHeight: '80vh', 
								},
							}}
			>
			<DialogTitle>
					Rework Form
					<IconButton
						aria-label="close"
						onClick={ () => setShowReworkForm(false)}
						style={{
							position: "absolute",
							right: 8,
							top: 8,
						}}
						>
						<CloseIcon />
					</IconButton>
				</DialogTitle>
				<DialogContent>
				<NokReworkForm nokId={nokId} formType={'ADD'} removeNok={() => console.log() } />
			</DialogContent>
			</Dialog>
			<Dialog open={showCostForm}
							fullWidth
							maxWidth="xl"
							sx={{
								'& .MuiDialog-paper': {
									minHeight: '400px', 
									maxHeight: '80vh', 
								},
							}}
			>
			<DialogTitle>
					Cost Form
					<IconButton
						aria-label="close"
						onClick={ () => setShowCostForm(false)}
						style={{
							position: "absolute",
							right: 8,
							top: 8,
						}}
						>
						<CloseIcon />
					</IconButton>
				</DialogTitle>
				<DialogContent>
				<NokCostForm nokId={nokId} formType={'ADD'} readonly={false} />
			</DialogContent>
			</Dialog>
		</Grid>
	);
};

export default NokAnalyseForm;