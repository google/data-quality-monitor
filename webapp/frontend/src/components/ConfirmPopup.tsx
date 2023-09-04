/**
Copyright 2023 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import {useState} from 'react';
import {ConfirmPopupProps} from '../types/GenericTypes';

const ConfirmPopup = ({...props}: ConfirmPopupProps) => {
  const [confirmText, setConfirmText] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);

  // handle confirmation message typed by user
  const handleConfirmText = (value: string) => {
    setConfirmText(value);
    if (value !== props.expectedConfirmationText) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  };

  // handle action button click
  const handleActionClick = () => {
    if (confirmText !== props.expectedConfirmationText) {
      setIsError(true);
    } else {
      setIsError(false);
      props.onAction();
      props.onClose();
    }
  };

  return (
    <Dialog open={props.open} onClose={props.onClose} scroll="paper">
      <DialogTitle>{props.popupHeader}</DialogTitle>
      <DialogContent sx={{maxWidth: '380px'}}>
        <DialogContentText>{props.popupMessage}</DialogContentText>
        <TextField
          fullWidth
          autoFocus
          margin="dense"
          id="name"
          type="text"
          variant="standard"
          error={isError}
          helperText={isError ? `Type ${props.expectedConfirmationText}` : ''}
          onChange={e => handleConfirmText(e.target.value)}
        />
        <Typography
          fontStyle="oblique"
          fontWeight="regular"
          padding={1}
          variant="caption"
          display="block"
          gutterBottom
        >
          {props.popupInfoCaption}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        {!isError && (
          <Button onClick={handleActionClick}>{props.actionButtonLabel}</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmPopup;
