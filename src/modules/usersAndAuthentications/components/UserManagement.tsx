import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Grid, Paper, Stack, LinearProgress, Box, Typography, Button } from '@mui/material';

import { useNotificationSet } from '../../../contexts/NotificationContext';

import userServices from '../services/userServices';
import roleServices from '../services/roleServices';
import rightServices from '../services/rightServices';

import UsersList from './UsersList';
import {
  FilterParamData,
  NewRight,
  NewRole,
  NewUser,
  Right,
  Role,
  RoleUpdate,
  UserBase,
  UserUpdate,
} from '../../../types/UserAuthTypes';
import RoleList from './RoleList';
import RightList from './RightList';
import UserForm from './UserForm';
import RoleForm from './RoleForm';
import RightForm from './RightForm';
import Filter from './Filter';

const UserManagement = () => {
  const setNotification = useNotificationSet();
  const navigate = useNavigate();

  const [showUserForm, setShowUserForm] = useState<{ show: boolean; formType: 'ADD' | 'EDIT' }>({
    show: false,
    formType: 'ADD',
  });
  const [showRoleForm, setShowRoleForm] = useState<{ show: boolean; formType: 'ADD' | 'EDIT' }>({
    show: false,
    formType: 'ADD',
  });
  const [showRightForm, setShowRightForm] = useState<{ show: boolean; formType: 'ADD' | 'EDIT' }>({
    show: false,
    formType: 'ADD',
  });

  const [selectedUser, setSelectedUser] = useState<UserBase | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedRight, setSelectedRight] = useState<Right | null>(null);

  const [filterParameter, setFilterParameter] = useState<FilterParamData | null>(null);

  // Query implementation
  const queryClient = useQueryClient();

  // Add New Opjects
  const newRoleMutation = useMutation(roleServices.createRole, {
    onSuccess: () => {
      queryClient.invalidateQueries('roles');
      setNotification({ message: 'Role added successfully!', type: 'info', time: 3 });
    },
    onError: (err) => {
      setNotification({ message: `${err}`, type: 'error', time: 8 });
    },
  });

  const newRightMutation = useMutation(rightServices.createRight, {
    onSuccess: () => {
      queryClient.invalidateQueries('rights');
      setNotification({ message: 'Right added successfully!', type: 'info', time: 3 });
    },
    onError: (err) => {
      setNotification({ message: `${err}`, type: 'error', time: 8 });
    },
  });

  const newUserMutation = useMutation(userServices.createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      setSelectedUser(null);
      setNotification({ message: 'User added successfully!', type: 'info', time: 3 });
    },
    onError: (err) => {
      setNotification({ message: `${err}`, type: 'error', time: 8 });
    },
  });

  // Edit Objects
  const editUserMutation = useMutation(userServices.editUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      setNotification({ message: 'User updated successfully!', type: 'info', time: 3 });
    },
    onError: (err) => {
      setNotification({ message: `${err}`, type: 'error', time: 8 });
    },
  });

  const editRoleMutation = useMutation(roleServices.editRole, {
    onSuccess: () => {
      queryClient.invalidateQueries('roles');
      setNotification({ message: 'Role updated successfully!', type: 'info', time: 3 });
    },
    onError: (err) => {
      setNotification({ message: `${err}`, type: 'error', time: 8 });
    },
  });

  const editRightMutation = useMutation(rightServices.editRight, {
    onSuccess: () => {
      queryClient.invalidateQueries('rights');
      setNotification({ message: 'rightupdated successfully!', type: 'info', time: 3 });
    },
    onError: (err) => {
      setNotification({ message: `${err}`, type: 'error', time: 8 });
    },
  });

  // Get Objects
  const userResults = useQuery('users', userServices.getUsers, { refetchOnWindowFocus: false });
  const roleResults = useQuery('roles', roleServices.getRoles, { refetchOnWindowFocus: false });
  const rightResults = useQuery('rights', rightServices.getRights, { refetchOnWindowFocus: false });

  // filter Objects
  const handleFilter = (filterParams: FilterParamData) => {
    setFilterParameter(filterParams);
  };

  let filteredRights = rightResults.data;
  let filteredRoles = roleResults.data;
  let filteredUsers = userResults.data;

  switch (filterParameter?.userActive) {
  case 'yes':
    filteredUsers = filteredUsers?.filter((user) => user.active === true);
    break;
  case 'no':
    filteredUsers = filteredUsers?.filter((user) => user.active === false);
    break;
  case 'all':
    filteredUsers;
    break;
  default:
    filteredUsers;
  }

  switch (filterParameter?.roleActive) {
  case 'yes':
    filteredRoles = filteredRoles?.filter((role) => role.active === true);
    break;
  case 'no':
    filteredRoles = filteredRoles?.filter((role) => role.active === false);
    break;
  case 'all':
    filteredRoles;
    break;
  default:
    filteredRoles;
  }

  if (filterParameter && filterParameter.right) {
    filteredRights = filteredRights?.filter((right) =>
      right.right.toLowerCase().includes(filterParameter.right.toLowerCase()),
    );
    filteredRoles = filteredRoles?.filter((role) =>
      filteredRights?.some((right) => role.rights?.some((roleRight) => roleRight.right === right.right)),
    );
    filteredUsers = filteredUsers?.filter((user) =>
      filteredRoles?.some((role) => user.roles?.some((userRole) => userRole.roleName === role.roleName)),
    );
  } else {
    filteredRights = rightResults.data;
  }
  if (filterParameter && (filterParameter.role || filterParameter.roleActive !== 'All')) {
    filteredRoles = filteredRoles?.filter((role) =>
      role.roleName.toLowerCase().includes(filterParameter.role.toLowerCase()),
    );
    filteredUsers = filteredUsers?.filter((user) =>
      filteredRoles?.some((role) => user.roles?.some((userRole) => userRole.roleName === role.roleName)),
    );
  }
  if (filterParameter && filterParameter.name) {
    filteredUsers = filteredUsers?.filter(
      (user) =>
        user.firstName.toLowerCase().includes(filterParameter.name) ||
        user.lastName.toLowerCase().includes(filterParameter.name),
    );
  }
  if (filterParameter && filterParameter.username) {
    filteredUsers = filteredUsers?.filter((user) =>
      user.username.toLowerCase().includes(filterParameter.username.toLowerCase()),
    );
  }

  // Role form Submit
  const handleRoleFormSubmit = (newRoleData: NewRole | RoleUpdate) => {
    if (showRoleForm.formType === 'ADD') {
      newRoleMutation.mutate(newRoleData as NewRole);
    }

    if (showRoleForm.formType === 'EDIT') {
      editRoleMutation.mutate(newRoleData as RoleUpdate);
    }
  };

  // Right Form Submit
  const handleRightFormSubmit = (newRightData: NewRight | Right) => {
    if (showRightForm.formType === 'ADD') {
      newRightMutation.mutate(newRightData as NewRight);
    }

    if (showRightForm.formType === 'EDIT') {
      editRightMutation.mutate(newRightData as Right);
    }
  };

  // User Form Submit
  const handleUserFormSubmit = (newUserData: NewUser | UserUpdate) => {
    if (showUserForm.formType === 'ADD') {
      newUserMutation.mutate(newUserData as NewUser);
    }

    if (showUserForm.formType === 'EDIT') {
      editUserMutation.mutate(newUserData as UserUpdate);
    }
  };

  return (
    <Paper
      sx={{ marginTop: 1, border: 'solid', borderRadius: 2, borderColor: '#1976d270', width: '100%', height: '100%' }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" borderRadius={2} bgcolor={'#1976d270'}>
        <Grid container bgcolor={'#1976d2d9'} color={'white'} justifyContent={'space-between'} flexDirection={'row'}>
          <Typography margin={1}>USER CONFIGURATION</Typography>
          <Button onClick={() => navigate('/config')} size="small">
            close
          </Button>
        </Grid>
      </Box>
      <Grid container spacing={1}>
        <Grid item xs={7}>
          <Paper>
            <Filter HandleFilter={handleFilter} />
            <Grid container spacing={1} height={'600px'}>
              <Grid item xs={7}>
                {userResults.isLoading && <LinearProgress sx={{ margin: 1 }} />}
                {filteredUsers && (
                  <UsersList
                    users={filteredUsers}
                    allUsers={userResults.data ? userResults.data?.length : 0}
                    displayUserForm={setShowUserForm}
                    selectUser={setSelectedUser}
                  />
                )}
              </Grid>
              <Grid item xs={5}>
                <Stack direction={'column'}>
                  <Box height={'50%'} maxHeight={'300px'}>
                    {roleResults.isLoading && <LinearProgress sx={{ margin: 1 }} />}
                    {filteredRoles && (
                      <RoleList
                        roles={filteredRoles}
                        allRoles={roleResults.data ? roleResults.data.length : 0}
                        displayRoleForm={setShowRoleForm}
                        selectRole={setSelectedRole}
                      />
                    )}
                  </Box>
                  <Box height={'50%'} maxHeight={'300px'} marginTop={1}>
                    {rightResults.isLoading && <LinearProgress sx={{ margin: 1 }} />}
                    {filteredRights && (
                      <RightList
                        rights={filteredRights}
                        allRights={rightResults.data ? rightResults.data.length : 0}
                        displayRightForm={setShowRightForm}
                        selectRight={setSelectedRight}
                      />
                    )}
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={5}>
          {showRoleForm.show && (
            <RoleForm
              roleData={selectedRole}
              displayRoleForm={setShowRoleForm}
              submitHandler={handleRoleFormSubmit}
              rightList={rightResults.data ? rightResults.data : []}
              formType={showRoleForm.formType}
            />
          )}
          {showRightForm.show && (
            <RightForm
              rightData={selectedRight}
              displayRightForm={setShowRightForm}
              submitHandler={handleRightFormSubmit}
              formType={showRightForm.formType}
            />
          )}
          {showUserForm.show && (
            <UserForm
              userData={selectedUser}
              formType={showUserForm.formType}
              submitHandler={handleUserFormSubmit}
              displayUserForm={setShowUserForm}
              roleList={roleResults.data ? roleResults.data?.filter((role) => role.active) : []}
            />
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default UserManagement;
