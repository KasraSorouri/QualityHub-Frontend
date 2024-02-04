import { useEffect, useState } from 'react';

import {
  TextField,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  Paper,
  Autocomplete,
  Grid
} from '@mui/material';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { NewRole, Right, Role, RoleUpdate } from '../../../types/UserAuthTypes';

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />;
const checkedIcon = <CheckBoxIcon fontSize='small' />;

interface FormData extends Role {
  rightData: (number | string)[]
}

type RoleFormProps = {
  roleData: Role | null;
  formType: 'ADD' | 'EDIT';
  submitHandler: (role: NewRole | RoleUpdate) => void;
  displayRoleForm: ({ show, formType } : { show: boolean, formType: 'ADD' | 'EDIT' }) => void;
  rightList: Right[];
}

const RoleForm = ({ formType, roleData, submitHandler, displayRoleForm, rightList } : RoleFormProps) => {

  const formTitle = formType === 'ADD' ? 'Add New Role' : 'Edit Role';
  const submitTitle = formType === 'ADD' ? 'Add Role' : 'Update Role';

  const initialFormData : FormData = {
    id: roleData ? roleData.id : '',
    roleName: roleData ? roleData.roleName :'',
    active: roleData ? roleData.active : true,
    rights: roleData ? roleData.rights : [],
    rightData: []
  };


  const [ formValues, setFormValues ] = useState<FormData>(initialFormData);

  useEffect(() => {
    const formData : FormData = {
      id: roleData ? roleData.id : '',
      roleName: roleData ? roleData.roleName :'',
      active: roleData ? roleData.active : true,
      rights: roleData ? roleData.rights : [],
      rightData: roleData?.rights ? roleData.rights?.map(right => right.id) : []
    };
    setFormValues(formData);
  },[roleData]);

  const handleChange = (event: { target: { name: string; value: string | number | boolean; checked: boolean; }; }) => {
    const { name, value, checked } = event.target;
    const newValue = name === 'active' ? checked : value;

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: newValue,
    }));
  };

  const handleRightChange = (_event: unknown, value: Right[]) => {
    setFormValues((preValues : FormData) => ({
      ...preValues,
      rights: value,
    }));
  };


  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    const newRole : RoleUpdate | NewRole = { ...formValues, rights: formValues.rights?.map(right => right.id) };
    submitHandler(newRole);
  };

  return(
    <Paper elevation={5} sx={{ borderRadius: 3, marginBottom: 1 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center'
        border={'solid'} borderColor={'#1976d270'} borderRadius={3}  margin={0}
        bgcolor={'#1976d270'}
      >
        <Typography variant='h6' marginLeft={2}  >{formTitle}</Typography>
        <Button variant='contained' onClick={() => displayRoleForm({ show: false, formType: 'ADD' })}>
          close
        </Button>
      </Box>
      <form onSubmit={handleSubmit} >
        <Box display='flex' flexDirection='row' alignItems='center' justifyContent='space-evenly'
          border={'solid'} borderColor={'#1976d2'} borderRadius={3}
        >
          <Grid container flexDirection={'column'}>
            <Grid container flexDirection={'row'} justifyContent={'space-between'} >
              <Grid>
                <TextField
                  label='Role'
                  name='roleName'
                  value={formValues.roleName}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                  margin='dense'
                  variant='outlined'
                  size='small'
                  required
                  sx={{ marginLeft: 2 }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      sx={{ marginLeft: 2 }}
                      checked={formValues.active}
                      onChange={handleChange}
                      name='active'
                      color='primary'
                    />
                  }
                  label='Active'
                />
              </Grid>
              <Grid>
                <Autocomplete
                  sx={{ marginLeft: 2 , marginTop: 1 }}
                  multiple
                  id='rights'
                  options={rightList}
                  disableCloseOnSelect
                  value={formValues.rights}
                  onChange={handleRightChange}
                  getOptionLabel={(option) => option.right}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderOption={(props, option, { selected }) => {
                    return (
                      <li {...props}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.right}
                      </li>
                    );
                  }}
                  style={{ width: 500 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Rights'
                      placeholder='Add right'
                      size='small'
                      sx={{ maxWidth: '250px', marginBottom: 1 }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Button type='submit' variant='contained' color='primary' sx={{ marginLeft: 2, marginBottom: 2 }}>
                {submitTitle}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </form>
    </Paper>
  );
};

export default RoleForm;