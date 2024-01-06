import { useState, useEffect, forwardRef, Ref, SyntheticEvent  } from 'react';
import {
  Snackbar,
  Stack
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

import { useNotificationValue } from '../../../contexts/NotificationContext';
import { NotificationType } from '../../../types/Notification';

const Alert = forwardRef<HTMLDivElement, AlertProps & {onClose: (event: SyntheticEvent, reason: string) => void }>(
  function Alert(props,ref: Ref<HTMLDivElement>) {
    const { onClose, ...restProps } = props;

    return <MuiAlert elevation={6} ref={ref} variant='filled' {...restProps} onClose={onClose} />;
  });

const Notification = () => {
  const notification : NotificationType | null = useNotificationValue();
  const [open, setOpen] = useState<boolean>(true);

  useEffect(() => {
    setOpen(true);
  },[notification]);

  if (!notification) {
    return null;
  }

  const autoClose = () => {
    setTimeout(() => setOpen(false), notification.time*1000 );
  };

  notification.time && autoClose();


  const handleClose = (reason: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal:'center' }}
        sx={{ marginTop: 7 }}
        open={open}
        onClose={(_, reason) => handleClose(reason)}
      >
        <Alert onClose={() => handleClose} severity={notification.type} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default Notification;