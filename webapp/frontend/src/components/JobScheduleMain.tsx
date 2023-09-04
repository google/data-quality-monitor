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

import React, {useCallback, useRef, useState} from 'react';
import axios from 'axios';

// import Cron
import cronstrue from 'cronstrue';
import Cron from 'react-js-cron';
import 'react-js-cron/dist/styles.css';

// import MUI
import Delete from '@mui/icons-material/Delete';
import Pause from '@mui/icons-material/Pause';
import PlayArrow from '@mui/icons-material/PlayArrow';
import Edit from '@mui/icons-material/Edit';
import Save from '@mui/icons-material/Save';
import Cancel from '@mui/icons-material/Cancel';
import InfoOutlined from '@mui/icons-material/InfoOutlined';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import {SelectChangeEvent} from '@mui/material';
import Alert from '@mui/material/Alert';
import {TextFieldProps} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

// import custom types
import {
  ConfirmPopupProps,
  DetailsDialogBoxProps,
  CustomMessage,
} from '../types/GenericTypes';
import {Jobs} from '../types/GoogleCloudResponse';

// import components
import DetailsDialogBox from './DetailsDialogBox';
import ConfirmPopup from './ConfirmPopup';
import CustomAlertMessage from './CustomAlertMessage';

// import helper functions
import {timeZones} from '../utils/timeZoneList';
import {formatSecondsToDateTime, getShortName} from '../utils/helper';

export default function JobScheduleMain() {
  // env variables
  const baseUrl: string = process.env.REACT_APP_DQM_API_BASE_URL
    ? process.env.REACT_APP_DQM_API_BASE_URL
    : 'API BASE URL NOT DEFINED';

  const projectId: string = process.env.REACT_APP_DQM_PROJECT_ID
    ? process.env.REACT_APP_DQM_PROJECT_ID
    : 'PROJECT ID NOT DEFINED';

  const jobSchedulerLocationId: string = process.env
    .REACT_APP_DQM_SCHEDULE_JOB_LOCATION_ID
    ? process.env.REACT_APP_DQM_SCHEDULE_JOB_LOCATION_ID
    : 'LOCATION ID NOT DEFINED IN CONFIG';

  // state variables
  const inputRef = useRef<TextFieldProps>(null);
  const [value, setValue] = useState('');
  const [textValue, setTextValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [noJob, setNoJob] = useState<boolean>(false);
  const [isFormEnabled, setIsFormEnabled] = useState(false);
  const [isErrors, setIsErrors] = useState<boolean>(false);
  const [formMessage, setFormMessage] = useState<CustomMessage | null>({
    message: '',
    severity: undefined,
  });
  const [formData, setFormData] = useState<Jobs>({
    name: '',
    description: '',
    timeZone: '',
    schedule: '',
    scheduleTime: undefined,
    state: '',
    nextrun: '',
    httpTarget: '',
  });

  const stateRef = useRef<Jobs>();
  stateRef.current = formData;

  const handleOnCloseDefaultDialogBox = () => {
    const props = {...detailsDialogBoxProps};
    props.open = false;
    setDetailsDialogBoxProps(props);
  };

  const [detailsDialogBoxProps, setDetailsDialogBoxProps] =
    useState<DetailsDialogBoxProps>({
      open: false,
      onClose: handleOnCloseDefaultDialogBox,
      title: 'Job Scheduler Details',
      message: '',
    });

  const getCurrentScheduledJob = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/projects/${projectId}/jobs/${jobSchedulerLocationId}`
      );
      if (response.data.errors) {
        setIsErrors(true);
        setNoJob(true);
        setFormMessage({
          message: response.data.errors.details,
          severity: 'error',
        });
      } else {
        if (response.data.length > 0) {
          const [responseData]: Jobs[] = response.data;
          const nextRun = responseData.scheduleTime?.seconds
            ? formatSecondsToDateTime(responseData.scheduleTime?.seconds)
            : '';
          responseData.nextrun = nextRun;
          setFormData(responseData);
          setFormMessage(null);
        } else {
          setIsErrors(true);
          setFormMessage({
            message: `There is no Job Scheduler found for DQM which is in this location:  ${jobSchedulerLocationId}`,
            severity: 'info',
          });
        }
      }
    } catch (error) {
      setIsErrors(true);
      setFormMessage({
        message: `An error occured: ${error}`,
        severity: 'error',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const pauseJob = async () => {
    setIsLoading(true);
    let jobName = '';
    if (formData.name !== undefined) {
      jobName = formData.name;
    }
    await axios
      .post(`${baseUrl}/jobs/${encodeURIComponent(jobName)}/pause`)
      .then(response => {
        if (response.data.errors) {
          setFormMessage({
            message: response.data.errors.details,
            severity: 'error',
          });
        } else {
          setFormMessage({
            message: 'Scheduled Job is paused successfully !',
            severity: 'success',
          });
          getCurrentScheduledJob();
        }
      })
      .catch(error => {
        setFormMessage({
          message: `An error occured: ${error}`,
          severity: 'error',
        });
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const resumeJob = () => {
    setIsLoading(true);
    axios
      .post(`${baseUrl}/jobs/${encodeURIComponent(formData.name)}/resume`)
      .then(response => {
        if (response.data.errors) {
          setFormMessage({
            message: response.data.errors.details,
            severity: 'error',
          });
        } else {
          getCurrentScheduledJob();
          setFormMessage({
            message: 'Scheduled Job is resumed successfully !',
            severity: 'success',
          });
        }
      })
      .catch(error => {
        setFormMessage({
          message: `An error occured: ${error}`,
          severity: 'error',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const deleteJob = async () => {
    setIsLoading(true);
    await axios
      .delete(
        `${baseUrl}/jobs/${encodeURIComponent(
          stateRef.current?.name as string
        )}/delete`
      )
      .then(response => {
        if (response.data.errors) {
          setFormMessage({
            message: response.data.errors.details,
            severity: 'error',
          });
        } else {
          setFormMessage({
            message: 'Scheduled Job is deleted successfully !',
            severity: 'success',
          });
          getCurrentScheduledJob();
        }
      })
      .catch(error => {
        setFormMessage({
          message: `An error occured: ${error}`,
          severity: 'error',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const saveSchedule = () => {
    setIsLoading(true);
    const reqData = {...formData};
    const req = {description: '', schedule: '', time_zone: ''};
    req.description = reqData.description || '';
    req.schedule = reqData.schedule || '';
    req.time_zone = reqData.timeZone || '';

    axios
      .put(`${baseUrl}/jobs/${encodeURIComponent(reqData.name)}/update`, req)
      .then(response => {
        if (response.data.errors) {
          setIsErrors(true);
          setFormMessage({
            message: response.data.errors.details,
            severity: 'error',
          });
        } else {
          setFormMessage({
            message: 'Scheduled Job is updated successfully !',
            severity: 'success',
          });
          disableScheduleInfo();
        }
      })
      .catch(error => {
        setFormMessage({
          message: `An error occured: ${error}`,
          severity: 'error',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const hnadleDeleteDialogBox = () => {
    const updateDeleteConfirmationPopup = {...deleteConfirmationPopup};
    updateDeleteConfirmationPopup.open = true;
    setDeleteConfirmationPopup(updateDeleteConfirmationPopup);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleTimeZoneChange = (event: SelectChangeEvent<string>) => {
    const {name, value} = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleCloseConfirmationPopup = () => {
    const updateDeleteConfirmationPopup = {...deleteConfirmationPopup};
    updateDeleteConfirmationPopup.open = false;
    setDeleteConfirmationPopup(updateDeleteConfirmationPopup);
  };

  const handleJobSchedulerDetailedInfo = () => {
    const props = {...detailsDialogBoxProps};
    props.open = true;
    props.message = JSON.stringify(formData.httpTarget, null, 2);
    setDetailsDialogBoxProps(props);
  };

  const [deleteConfirmationPopup, setDeleteConfirmationPopup] =
    useState<ConfirmPopupProps>({
      open: false,
      onClose: handleCloseConfirmationPopup,
      onAction: deleteJob,
      expectedConfirmationText: 'Delete',
      actionButtonLabel: 'Delete',
      popupMessage: 'Type "Delete" to confirm the deletion',
      popupHeader: 'Confirm to delete',
      popupInfoCaption:
        'Note: Once deleted, Job Scheduler will deleted permanently and will not be possible to create from webapp',
    });

  const customSetValue = useCallback(
    (newValue: string) => {
      setValue(newValue);
      setTextValue(newValue);
      setFormData(prevFormData => ({
        ...prevFormData,
        schedule: newValue,
      }));
    },
    [setFormData]
  );

  const editScheduleInfo = async () => {
    return setIsFormEnabled(true);
  };

  const disableScheduleInfo = async () => {
    getCurrentScheduledJob();
    return setIsFormEnabled(false);
  };

  React.useEffect(() => {
    getCurrentScheduledJob();
  }, []);

  return (
    <React.Fragment>
      {!isErrors && (
        <>
          <Grid item xs={12} direction="row" container>
            <Grid item xs={6}>
              <Stack spacing={2} direction="row">
                {formData.state === 'PAUSED' && (
                  <Button
                    variant="contained"
                    size="small"
                    disabled={isLoading}
                    startIcon={<PlayArrow />}
                    color="secondary"
                    onClick={resumeJob}
                  >
                    Resume
                  </Button>
                )}

                {formData.state === 'ENABLED' && (
                  <Button
                    variant="contained"
                    size="small"
                    disabled={isLoading}
                    color="secondary"
                    startIcon={<Pause />}
                    onClick={pauseJob}
                  >
                    Pause
                  </Button>
                )}

                <Button
                  variant="contained"
                  size="small"
                  color="secondary"
                  startIcon={<Delete />}
                  onClick={hnadleDeleteDialogBox}
                  disabled={isLoading}
                >
                  Delete
                </Button>
                {isLoading && <CircularProgress />}
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <Stack spacing={4} direction="row">
                  <Grid textAlign={'center'}>
                    <Typography color="text.secondary">Status</Typography>
                    <Typography color="green" variant="h6" component="div">
                      {formData.state}
                    </Typography>
                  </Grid>
                  {formData.nextrun && (
                    <Grid textAlign={'center'}>
                      <Typography color="text.secondary">
                        Next Run on
                      </Typography>
                      <Typography color="green" variant="h6" component="div">
                        {formData.nextrun}
                      </Typography>
                    </Grid>
                  )}
                  <Grid>
                    <Tooltip title={'View the Workflow Code'}>
                      <IconButton
                        color="info"
                        onClick={handleJobSchedulerDetailedInfo}
                      >
                        <InfoOutlined />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Stack>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{mt: 5, display: 'row'}}>
            <Stack spacing={2} direction="row">
              {formData.name && (
                <Tooltip title={`Full Path: ${formData.name}`}>
                  <TextField
                    name="name"
                    label="Job Name"
                    value={getShortName(formData.name)}
                    disabled={true}
                    size="small"
                    onChange={handleInputChange}
                  />
                </Tooltip>
              )}
              <TextField
                // error
                name="description"
                label="Job derscription"
                value={formData.description}
                disabled={!isFormEnabled}
                size="small"
                onChange={handleInputChange}
              />

              <Tooltip
                title={
                  formData.schedule && cronstrue.toString(formData.schedule)
                }
              >
                <TextField
                  name="schedule"
                  label="Job schedule"
                  value={formData.schedule}
                  disabled={true}
                  size="small"
                  inputRef={inputRef}
                  onBlur={event => {
                    setValue(event.target.value);
                  }}
                  onChange={(event: any) => {
                    customSetValue(event.target.value);
                  }}
                />
              </Tooltip>
              <FormControl style={{minWidth: 150}}>
                <InputLabel htmlFor="timeZone">Time Zone</InputLabel>
                <Select
                  name="timeZone"
                  disabled={!isFormEnabled}
                  labelId="timeZone"
                  label="Time Zone"
                  size="small"
                  value={formData.timeZone}
                  onChange={handleTimeZoneChange}
                >
                  {timeZones.map(timeZone => (
                    <MenuItem key={timeZone} value={timeZone}>
                      {timeZone}
                    </MenuItem>
                  ))}
                  ;
                </Select>
              </FormControl>
            </Stack>
          </Box>
          {isFormEnabled && (
            <Box
              sx={{
                display: 'flex',
                p: 1,
                mt: 3,
              }}
            >
              <Stack spacing={2} direction="column" useFlexGap flexWrap="wrap">
                {formData.schedule && (
                  <>
                    <Cron value={formData.schedule} setValue={customSetValue} />
                    <Alert severity="info">
                      <strong>{cronstrue.toString(formData.schedule)}</strong>
                    </Alert>
                  </>
                )}
              </Stack>
            </Box>
          )}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              p: 1,
              mt: 3,
              bgcolor: 'background.paper',
              borderRadius: 1,
            }}
          >
            <Stack spacing={2} direction="row" useFlexGap flexWrap="wrap">
              {!isFormEnabled && (
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  startIcon={<Edit />}
                  onClick={editScheduleInfo}
                  disabled={isLoading}
                >
                  Edit Schedule
                </Button>
              )}
              {isFormEnabled && (
                <React.Fragment>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    startIcon={<Save />}
                    onClick={saveSchedule}
                    disabled={isLoading}
                  >
                    Save Changes
                  </Button>

                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    startIcon={<Cancel />}
                    onClick={disableScheduleInfo}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </React.Fragment>
              )}
            </Stack>
          </Box>
        </>
      )}

      <DetailsDialogBox {...detailsDialogBoxProps} />
      <ConfirmPopup {...deleteConfirmationPopup} />
      <CustomAlertMessage {...formMessage} />
    </React.Fragment>
  );
}
