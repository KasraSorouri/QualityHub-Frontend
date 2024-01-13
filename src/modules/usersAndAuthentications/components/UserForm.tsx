import { useEffect, useState } from 'react';

import {
  TextField,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  Paper,
  Grid,
  Autocomplete
} from '@mui/material';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { NewUser, Role, UserBase, UserUpdate } from '../../../types/UserAuthTypes';

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />;
const checkedIcon = <CheckBoxIcon fontSize='small' />;

interface FormData extends UserBase {
  password?: string;
  checked: boolean
}

type UserFormProps = {
  userData: UserBase | null;
  formType: 'ADD' | 'EDIT';
  submitHandler: (user: NewUser | UserUpdate) => void;
  displayUserForm: ({ show, formType } : { show: boolean, formType: 'ADD' | 'EDIT' }) => void;
  roleList: Role[];
}



const UserForm = ({ userData, formType, submitHandler, displayUserForm, roleList } : UserFormProps) => {

  const formTitle = formType === 'ADD' ? 'Add New User' : 'Edit User';
  const submitTitle = formType === 'ADD' ? 'Add User' : 'Update User';

  const initialFormData : FormData = {
    id: userData ? userData.id : '',
    firstName: userData ? userData.firstName :'',
    lastName: userData ? userData.lastName : '',
    username: userData ? userData.username : '',
    password: '',
    active: userData ? userData.active : true,
    roles: userData ? userData.roles : [],
    checked: false
  };

  const [ formValues, setFormValues ] = useState<FormData>(initialFormData);
  const [ showPasswordField, setShowPasswordFiled ] = useState<boolean>(formType === 'ADD');

  useEffect(() => {
    //setFormValues(userData);
    setShowPasswordFiled(formType === 'ADD');
  },[formType, userData]);

  const handleChange = (event: { target: { name: string; value: string | number | boolean; checked: boolean; }; }) => {
    const { name, value, checked } = event.target;
    const newValue = name === 'active' ? checked : value;

    setFormValues((prevValues: FormData) => ({
      ...prevValues,
      [name]: newValue,
    }));
  };

  const handleRoleChange = (_event: unknown, value: Role[]) => {
    setFormValues((preValues: FormData) => ({
      ...preValues,
      roles: value,
    }));
  };

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    const newUser: UserUpdate | NewUser  = { ...formValues, roles: formValues.roles!.map(role => role.id) };
    submitHandler(newUser);
  };

  return(
    <Paper elevation={5} sx={{ borderRadius: 3 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center'
        border={'solid'} borderColor={'#1976d270'} borderRadius={3} bgcolor={'#1976d270'}
      >
        <Typography variant='h6' marginLeft={2}  >{formTitle}</Typography>
        <Button variant='contained' onClick={() => displayUserForm({ show: false, formType: 'ADD' })}>
          close
        </Button>
      </Box>
      <form onSubmit={handleSubmit} >
        <Box display='flex' border={'solid'} borderColor={'#1976d2'} borderRadius={3}  margin={0} >
          <Grid container flexDirection={'column'}>
            <Grid container flexDirection={'row'} >
              <TextField
                label='First Name'
                name='firstName'
                sx={{ marginLeft: 2 }}
                value={formValues.firstName}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                margin='dense'
                variant='outlined'
                size='small'
                required
              />
              <TextField
                label='Last Name'
                name='lastName'
                sx={{ marginLeft: 2 }}
                value={formValues.lastName}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                margin='dense'
                variant='outlined'
                size='small'
                required
              />
            </Grid>
            <Grid container flexDirection={'row'} >
              <TextField
                label='Username'
                name='username'
                sx={{ marginLeft: 2 }}
                value={formValues.username}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                margin='dense'
                variant='outlined'
                size='small'
                required
              />
              { showPasswordField ?
                <Box>
                  <TextField
                    label='Password'
                    name='password'
                    type='password'
                    sx={{ marginLeft: 2 }}
                    value={formValues.password}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event)}
                    autoComplete='off'
                    margin='dense'
                    variant='outlined'
                    size='small'
                    required
                  />
                  { formType === 'EDIT' ?
                    <Button onClick={() => setShowPasswordFiled(false)} sx={{ margin: 1 }} >Keep Password</Button>
                    : null
                  }
                </Box>
                :
                <Button onClick={() => setShowPasswordFiled(true)} >Change password</Button>
              }
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{ marginLeft: 2 }}
                    checked={formValues.checked}
                    defaultChecked={true}
                    onChange={handleChange}
                    name='active'
                    color='primary'
                  />
                }
                label='Active'
              />
            </Grid>
            <Grid container margin={2}>
              <Autocomplete
                multiple
                id='roles'
                options={roleList}
                disableCloseOnSelect
                value={formValues.roles}
                onChange={handleRoleChange}
                getOptionLabel={(option) => option.roleName}
                renderOption={(props, option, { selected }) => {
                  return (
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option.roleName}
                    </li>
                  );
                }}
                style={{ width: 500 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label='Roles'
                    placeholder='Add Role'
                    size='small'
                    sx={{ maxWidth: '350px', margin: '2' }}
                  />
                )}
              />
            </Grid>
            <Grid>
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

export default UserForm;