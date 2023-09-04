/*
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

import React, {useRef, useState} from 'react';
import axios from 'axios';

// import MUI
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import AddCircleOutlined from '@mui/icons-material/AddCircleOutlined';
import DeleteForever from '@mui/icons-material/DeleteForever';

// import types
import {CustomMessage, ConfirmPopupProps} from '../types/GenericTypes';
import {BucketPathProps} from '../types/Config';

// import components
import ConfigForm from './DisplayConfig';
import CustomAlertMessage from './CustomAlertMessage';
import ConfirmPopup from './ConfirmPopup';

function ConfigList() {
  const baseUrl: string = process.env.REACT_APP_DQM_API_BASE_URL
    ? process.env.REACT_APP_DQM_API_BASE_URL
    : 'API BASE URL NOT DEFINED';

  const projectId: string = process.env.REACT_APP_DQM_PROJECT_ID
    ? process.env.REACT_APP_DQM_PROJECT_ID
    : 'CLOUD STORAGE PROJECT ID NOT DEFINED';

  const bucketId: string = process.env.REACT_APP_DQM_CONFIG_BUCKET_NAME
    ? process.env.REACT_APP_DQM_CONFIG_BUCKET_NAME
    : 'CLOUD STORAGE BUCKET ID NOT DEFINED';

  // state variables
  const [isLoading, setIsLoading] = useState(true);
  const [configFileList, setConfigFileList] = useState<string[]>([]);
  const [loadConfig, setLoadConfig] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<CustomMessage | null>(null);
  const [isErrors, setIsErrors] = useState<boolean>(false);
  const [bucketPathProps, setBucketPathProps] = useState<BucketPathProps>({
    projectId: projectId,
    bucketId: bucketId,
    fileName: '',
    newConfig: false,
    configFileList: [],
  });
  const stateRef = useRef<BucketPathProps>(bucketPathProps);
  stateRef.current = bucketPathProps as BucketPathProps;

  // api calls made to fetch the data
  const getConfigList = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/projects/${projectId}/buckets/${bucketId}/configs`
      );

      if (response.data.errors) {
        setIsErrors(true);
        setConfigFileList([]);
        setAlertMessage({
          message: response.data.errors.message,
          severity: 'info',
        });
      } else {
        setConfigFileList(response.data);
      }
    } catch (error: any) {
      setIsErrors(true);
      setAlertMessage({
        message: `${error}`,
        severity: 'error',
      });
      setConfigFileList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await axios.delete(
        `${baseUrl}/projects/${stateRef.current.projectId}/buckets/${stateRef.current.bucketId}/files/${stateRef.current.fileName}`
      );
      if (response.data.errors) {
        setAlertMessage({
          message: response.data.errors.message,
          severity: 'error',
        });
      } else {
        setAlertMessage({
          message: 'Config is Deleted successfully!',
          severity: 'success',
        });
        getConfigList();
      }
    } catch (error) {
      setAlertMessage({
        message: `An Error Occured ${error}`,
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
      const updateDeleteConfirmationPopup = {...deleteConfirmationPopup};
      updateDeleteConfirmationPopup.open = false;
      setDeleteConfirmationPopup(updateDeleteConfirmationPopup);
    }
  };

  const hnadleDeleteDialogBox = () => {
    const updateDeleteConfirmationPopup = {...deleteConfirmationPopup};
    updateDeleteConfirmationPopup.open = true;
    setDeleteConfirmationPopup(updateDeleteConfirmationPopup);
  };

  const handleNewConfigButton = () => {
    const updatedBucketData = {...bucketPathProps};
    updatedBucketData.newConfig = true;
    updatedBucketData.fileName = '';
    setBucketPathProps(updatedBucketData);
    setLoadConfig(true);
    setAlertMessage({message: undefined, severity: undefined});
  };

  const handleCancelConfigButton = () => {
    getConfigList();
    const updatedBucketData = {...bucketPathProps};
    updatedBucketData.newConfig = false;
    updatedBucketData.fileName = '';
    setBucketPathProps(updatedBucketData);
    setLoadConfig(true);
  };

  const handleChangeFileName = (value: string) => {
    const updatedBucketData = {...bucketPathProps};
    updatedBucketData.fileName = value;
    setBucketPathProps(updatedBucketData);
    setLoadConfig(true);
  };

  const handleCloseDialog = () => {
    const updateDeleteConfirmationPopup = {...deleteConfirmationPopup};
    updateDeleteConfirmationPopup.open = false;
    setDeleteConfirmationPopup(updateDeleteConfirmationPopup);
  };

  const [deleteConfirmationPopup, setDeleteConfirmationPopup] =
    useState<ConfirmPopupProps>({
      open: false,
      onClose: handleCloseDialog,
      onAction: handleDelete,
      expectedConfirmationText: 'Delete',
      actionButtonLabel: 'Delete',
      popupMessage: 'Type "Delete" to confirm the deletion',
      popupHeader: 'Confirm to delete',
      popupInfoCaption:
        'Note: Once deleted, file will be deleted permanently from the Google Cloud Storage Bucket.',
    });

  React.useEffect(() => {
    getConfigList();
  }, []);

  return (
    <React.Fragment>
      <Grid paddingBottom={2}>
        <CustomAlertMessage {...alertMessage} />
      </Grid>
      {!isErrors && (
        <Grid item xs={12} direction="row" container>
          <Grid paddingBottom={2} item xs={6} direction="row" container>
            {isLoading && <CircularProgress />}
            {!bucketPathProps.newConfig && (
              <FormControl sx={{minWidth: 250}} size="small">
                <InputLabel id="demo-select-small-label">
                  Select Config Files*
                </InputLabel>
                <Select
                  required
                  id="config-id"
                  labelId="config-id"
                  size="small"
                  label="Select Config File"
                  value={bucketPathProps.fileName}
                  onChange={e => handleChangeFileName(e.target.value)}
                >
                  {configFileList &&
                    configFileList.map(item => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
          </Grid>
          <Grid item xs={6} direction="row-reverse">
            <Stack spacing={2} direction="row-reverse">
              {!bucketPathProps.newConfig && bucketPathProps.fileName && (
                <Grid justifyItems="flex-end">
                  <Tooltip title="Delete This Config File">
                    <Button
                      variant="contained"
                      size="small"
                      color="error"
                      startIcon={<DeleteForever />}
                      onClick={hnadleDeleteDialogBox}
                    >
                      Delete Config
                    </Button>
                  </Tooltip>
                </Grid>
              )}
              {!bucketPathProps.newConfig && (
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  startIcon={<AddCircleOutlined />}
                  onClick={handleNewConfigButton}
                  disabled={isLoading}
                >
                  Create New Config
                </Button>
              )}

              {bucketPathProps.newConfig && (
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  startIcon={<CancelOutlined />}
                  onClick={handleCancelConfigButton}
                >
                  Cancel
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>
      )}

      <ConfirmPopup {...deleteConfirmationPopup} />
      {loadConfig && <ConfigForm {...bucketPathProps} />}
    </React.Fragment>
  );
}

export default ConfigList;
