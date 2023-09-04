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

import React, {useState} from 'react';
import axios from 'axios';

// MUI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import {
  PlayArrow,
  RemoveRedEyeOutlined,
  RefreshOutlined,
  InfoOutlined,
  CheckCircleOutline,
  CancelOutlined,
  HourglassEmptyOutlined,
} from '@mui/icons-material';

import {DataGrid} from '@mui/x-data-grid';

// Component imports
import DetailsDialogBox from './DetailsDialogBox';
import CustomAlertMessage from './CustomAlertMessage';

// Custom interface imports
import {CustomMessage, DetailsDialogBoxProps} from '../types/GenericTypes';

// helper function imports
import {
  formatSecondsToDateTime,
  getShortName,
  generateRandomIndex,
} from '../utils/helper';

/**
 * Workflow main component. This component is displayed
 * in the Workflow Page of the application
 */
export default function WorkflowMain() {
  // env variables
  const baseUrl: string = process.env.REACT_APP_DQM_API_BASE_URL
    ? process.env.REACT_APP_DQM_API_BASE_URL
    : 'API BASE URL NOT DEFINED';

  const projectId: string = process.env.REACT_APP_DQM_PROJECT_ID
    ? process.env.REACT_APP_DQM_PROJECT_ID
    : 'PROJECT ID NOT DEFINED';

  const workflowLocationId: string = process.env
    .REACT_APP_DQM_WORKFLOW_LOCATION_ID
    ? process.env.REACT_APP_DQM_WORKFLOW_LOCATION_ID
    : 'WORKFLOW LOCATION ID NOT DEFINED';

  const tag: string = process.env.REACT_APP_DQM_RESOURCES_TAG
    ? process.env.REACT_APP_DQM_RESOURCES_TAG
    : '';

  const limit: string = process.env
    .REACT_APP_DQM_WORKFLOW_FETCH_EXECUTIONS_LIMIT
    ? process.env.REACT_APP_DQM_WORKFLOW_FETCH_EXECUTIONS_LIMIT
    : '';

  // useState variables
  const [executions, setExecutions] = useState([]);
  const [workflowCount, setWorkflowCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<CustomMessage | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [workflow, setWorkflow] = useState({
    name: '',
    state: '',
    sourceContents: {}, // to hold the implementation code of workflow
  });

  // to handle closing
  const handleOnCloseDetailsDialogBox = () => {
    const props = {...detailsDialogBoxProps};
    props.open = false;
    setDetailsDialogBoxProps(props);
  };

  /**
   * setting default values for details dialog box
   * which is used to display more information on
   * click of a button
   */
  const [detailsDialogBoxProps, setDetailsDialogBoxProps] =
    useState<DetailsDialogBoxProps>({
      open: false,
      onClose: handleOnCloseDetailsDialogBox,
      title: '',
      message: '',
    });
  const handleWorkflowDetailedInfo = () => {
    const props = {...detailsDialogBoxProps};
    props.open = true;
    props.title = 'Workflow - Implemented Code';
    props.message = String(workflow.sourceContents);
    setDetailsDialogBoxProps(props);
  };

  // execute the workflow
  const handleConfirmButtonClick = async () => {
    setIsLoading(true);
    setMessage({message: 'Wait for a moment...', severity: 'info'});
    try {
      await axios
        .post(
          `${baseUrl}/workflow/${encodeURIComponent(workflow.name)}/execute`
        )
        .then(response => {
          if (response.data.errors) {
            setMessage({
              message: response.data.errors.details,
              severity: 'error',
            });
          } else {
            setMessage({
              message:
                'Workflow is trigerred. \n Now fetching the latest executions... !',
              severity: 'info',
            });
            getExecutions(workflow.name);
          }
        });
    } catch (error) {
      setMessage({
        message: `An Error Occured - ${error}`,
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchRecentExecutions = () => {
    getExecutions(workflow.name);
  };

  // function to fetch top 5 workflow executions
  const getExecutions = (workflowName: string) => {
    setIsLoading(true);
    setExecutions([]);
    setMessage({
      message: 'Wait for a moment... Top 5 executions are being fetched...',
      severity: 'info',
    });
    axios
      .get(
        `${baseUrl}/workflow/${encodeURIComponent(
          workflowName
        )}/executions?limit=${limit}`
      )
      .then(response => {
        if (response.data.errors) {
          setMessage({
            message: response.data.errors.details,
            severity: 'error',
          });
        } else {
          setExecutions(response.data);
          setMessage({
            message: `Recent ${limit} executions are retrieved successfully !`,
            severity: 'success',
          });
        }
      })
      .catch(error => {
        setMessage({
          message: `An Error occured - ${error}`,
          severity: 'error',
        });
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // On landing page, first load the workflow
  // assigned with a specific tag
  React.useEffect(() => {
    const getWorkflow = async () => {
      setIsLoading(true);
      setMessage({message: 'Wait for a moment...', severity: 'info'});

      await axios
        .get(
          `${baseUrl}/projects/${projectId}/workflows/${workflowLocationId}?tag=${tag}`
        )
        .then(response => {
          if (response.data.errors) {
            setIsError(true);
            setMessage({
              message: response.data.errors.details,
              severity: 'error',
            });
          } else {
            setWorkflowCount(response.data[0].length);
            setMessage(null);
            if (response.data[0].length > 0) {
              const [[{name, state, sourceContents}]] = response.data;
              setWorkflow({
                name,
                state,
                sourceContents,
              });
              getExecutions(name);
            } else
              setMessage({
                message: 'No Workflow found for DQM',
                severity: 'error',
              });
          }
        })
        .catch(error => {
          setMessage({
            message: `An error occured: ${error}`,
            severity: 'error',
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    getWorkflow();
  }, []);

  const handleViewExecutionDetailsClick = async (row: any) => {
    setIsLoading(true);
    await axios
      .get(
        `${baseUrl}/workflow/${encodeURIComponent(row.name)}/execution/info/`
      )
      .then(response => {
        const result = response.data;
        if (result !== undefined) {
          const props = {...detailsDialogBoxProps};
          props.message = JSON.stringify(result, null, 2);
          props.open = true;
          props.title = 'Execution - Detailed Info';
          setDetailsDialogBoxProps(props);
        }
      })
      .catch(error => {
        setMessage({
          message: `An Error occured - ${error}`,
          severity: 'error',
        });
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCEEDED':
        return <CheckCircleOutline style={{color: 'green'}} />;
      case 'FAILED':
        return <CancelOutlined style={{color: 'red'}} />;
      case 'ACTIVE':
        return <HourglassEmptyOutlined style={{color: 'orange'}} />;
      default:
        return null;
    }
  };

  // columns to be disaplyed in the recent execution tables
  const columns = [
    {
      field: 'execution_id',
      headerName: 'Execution ID',
      flex: 1,
      valueGetter: (params: any) => getShortName(params.row.name),
    },
    {
      field: 'startDateTime',
      headerName: 'Start Date Time',
      flex: 1.4,
      valueGetter: (params: any) =>
        formatSecondsToDateTime(
          params.row.startTime && params.row.startTime.seconds
        ),
    },
    {
      field: 'endDateTime',
      headerName: 'End Date Time',
      flex: 1.4,
      valueGetter: (params: any) =>
        formatSecondsToDateTime(
          params.row.endTime && params.row.endTime.seconds
        ),
    },
    {
      field: 'state',
      headerName: 'Status',
      flex: 1,
      renderCell: (params: any) => (
        <Tooltip title={params.value}>
          <div>{getStatusIcon(params.value)}</div>
        </Tooltip>
      ),
    },

    {
      field: 'total_time',
      headerName: 'Total Time Taken',
      flex: 1.5,
      valueGetter: (params: any) =>
        `${
          params.row.endTime &&
          params.row.startTime &&
          params.row.endTime.seconds - params.row.startTime.seconds
        } Second(s)`,
    },
    {
      field: 'details',
      headerName: 'View Details',
      flex: 1,
      renderCell: (params: any) => (
        <IconButton
          size="small"
          onClick={() => handleViewExecutionDetailsClick(params.row)}
          disabled={isLoading}
        >
          <RemoveRedEyeOutlined />
        </IconButton>
      ),
    },
  ];

  return (
    <React.Fragment>
      {workflowCount > 0 && (
        <Grid item xs={12} direction="row" container>
          <Grid paddingTop={1} paddingBottom={2} item xs={7}>
            <Stack spacing={1} direction="row">
              <Button
                variant="contained"
                color="secondary"
                startIcon={<PlayArrow />}
                onClick={handleConfirmButtonClick}
                size="small"
                disabled={isLoading}
              >
                Execute
              </Button>

              <Button
                variant="contained"
                color="secondary"
                startIcon={<RefreshOutlined />}
                onClick={handleFetchRecentExecutions}
                size="small"
                disabled={isLoading}
              >
                Refresh
              </Button>
              {isLoading && <CircularProgress color="success" />}
            </Stack>
          </Grid>

          <Grid paddingTop={1} item xs={5}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              {workflow && (
                <Stack spacing={2} direction="row">
                  <Grid textAlign={'center'}>
                    <Typography color="text.secondary">
                      Workflow State
                    </Typography>
                    <Typography color="green" variant="h6" component="div">
                      {workflow.state}
                    </Typography>
                  </Grid>

                  <Grid textAlign={'center'}>
                    <Typography color="text.secondary">
                      Workflow Name
                    </Typography>
                    <Tooltip title={`Full path: ${workflow.name}`}>
                      <Typography color="green" variant="h6" component="div">
                        {getShortName(workflow.name)}
                      </Typography>
                    </Tooltip>
                  </Grid>

                  <Grid>
                    <Tooltip title={'View the Workflow Code'}>
                      <IconButton
                        disabled={isLoading}
                        color="info"
                        onClick={handleWorkflowDetailedInfo}
                      >
                        <InfoOutlined />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Stack>
              )}
            </Box>
          </Grid>
        </Grid>
      )}

      <CustomAlertMessage {...message} />

      {executions.length !== 0 && (
        <DataGrid
          getRowId={() => generateRandomIndex()}
          rows={executions}
          columns={columns}
        />
      )}
      <DetailsDialogBox {...detailsDialogBoxProps} />
    </React.Fragment>
  );
}
