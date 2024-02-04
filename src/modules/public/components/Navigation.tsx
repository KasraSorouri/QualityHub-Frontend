import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AppBar,
  Toolbar,
  Divider,
  Menu,
  MenuItem,
  Typography,
  Grid,
  Box,
  ListItemIcon,
  Stack } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import ConfigIcon from '@mui/icons-material/SettingsSuggest';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import Logout from '@mui/icons-material/Logout';

import { useUserSet } from '../../../contexts/userContext';

import { Token } from '../../../types/UserAuthTypes';

const Navigation = ({ signedUser } :{ signedUser: Token | null}) => {

  const navigate = useNavigate();
  const setUser = useUserSet();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    window.localStorage.removeItem('Manufacturing_logedUser');
    setUser(null);
    navigate('/signin');
    handleClose();
  };

  return (
    <AppBar position='sticky'>
      <Toolbar disableGutters>
        <Grid container justifyContent='space-between'>
          <Grid item>
            <Stack direction={'row'} spacing={5} margin={2}>
              <Typography
                variant="h6"
                noWrap
                component="a"
                href= '/'
                sx={{
                  margin: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                <HomeIcon sx={{ margin: 0.5 }} />
                Home
              </Typography>
              <Typography
                variant="h6"
                noWrap
                component="a"
                href= '/quality-setting/manage'
                sx={{
                  margin: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                <ConfigIcon sx={{ margin: 0.5 }} />
                Settings
              </Typography>
              <Typography
                variant="h6"
                noWrap
                component="a"
                href= '/user_management'
                sx={{
                  margin: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                <ManageAccountsIcon sx={{ margin: 0.5 }} />
                User Management
              </Typography>
            </Stack>
          </Grid>
          <Grid item marginLeft={25}>
            <Box sx={{ flexGrow: 0 }}>
              {signedUser ?
                <Fragment>
                  <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}
                    onClick={handleClick}
                  >
                    <Typography
                      variant='h6'
                      noWrap
                      sx={{
                        margin: 2,
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        color: 'inherit',
                        textDecoration: 'none',
                      }}
                    >
                      { `${signedUser.firstName} ${signedUser.lastName}`}
                    </Typography>
                  </Box>
                  <Menu
                    anchorEl={anchorEl}
                    id='account-menu'
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem onClick={handleClose}>
                      Change Password
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <Logout fontSize='small' />
                      </ListItemIcon>
                    Logout
                    </MenuItem>
                  </Menu>
                </Fragment>:
                <Typography
                  variant="h6"
                  noWrap
                  component="a"
                  href= 'signin'
                  sx={{
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                >
                Sign In
                </Typography>
              }
            </Box>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
