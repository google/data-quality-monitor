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

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

import {Light as SyntaxHighlighter} from 'react-syntax-highlighter';
import {DetailsDialogBoxProps} from '../types/GenericTypes';

const DetailsDialogBox = ({...props}: DetailsDialogBoxProps) => {
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      scroll="paper"
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText tabIndex={-1}>
          <Box
            component={Paper}
            sx={{
              padding: 0.5,
              border: '0.5px solid #ccc',
              borderRadius: 0.5,
              margin: 1,
              whiteSpace: 'pre-line',
              overflow: 'auto',
            }}
          >
            <SyntaxHighlighter>{props.message}</SyntaxHighlighter>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailsDialogBox;
