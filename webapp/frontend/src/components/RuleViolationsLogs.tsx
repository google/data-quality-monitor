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
import {generateRandomIndex} from '../utils/helper';
import {DetailsDialogBoxProps, CustomMessage} from '../types/GenericTypes';

import {DataGrid} from '@mui/x-data-grid';
import {GridEventListener} from '@mui/x-data-grid';
import {GridToolbarContainer} from '@mui/x-data-grid';
import {GridToolbarExport} from '@mui/x-data-grid';

import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import CustomAlertMessage from './CustomAlertMessage';
import DetailsDialogBox from './DetailsDialogBox';
import InfoOutlined from '@mui/icons-material/InfoOutlined';

export default function RuleViolationsLogs() {
  const baseUrl: string = process.env.REACT_APP_DQM_API_BASE_URL
    ? process.env.REACT_APP_DQM_API_BASE_URL
    : 'API BASE URL NOT DEFINED';

  const defaultProjectId: string = process.env.REACT_APP_DQM_PROJECT_ID
    ? process.env.REACT_APP_DQM_PROJECT_ID
    : 'RULE_VIOLATIONS LOGS PROJECT ID MISSING';

  const tag: string = process.env.REACT_APP_DQM_RESOURCES_TAG
    ? process.env.REACT_APP_DQM_RESOURCES_TAG
    : '';

  const [data, setData] = useState([]);
  const [datasetIds, setDatasetIds] = useState<string[]>([]);
  const [tableNames, setTableNames] = useState<string[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [message, setMessage] = useState<CustomMessage | undefined>({
    message: '',
    severity: undefined,
  });

  const handleOnCloseDefaultDialogBox = () => {
    const props = {...detailsDialogBoxProps};
    props.open = false;
    setDetailsDialogBoxProps(props);
  };

  const [detailsDialogBoxProps, setDetailsDialogBoxProps] =
    useState<DetailsDialogBoxProps>({
      open: false,
      onClose: handleOnCloseDefaultDialogBox,
      title: 'Rule Violation Details',
      message: '',
    });

  const handleRowClick: GridEventListener<'rowClick'> = params => {
    const props = {...detailsDialogBoxProps};
    props.open = true;
    props.message = JSON.stringify(params.row, null, 2);
    setDetailsDialogBoxProps(props);
  };

  interface formData {
    projectId: string;
    datasetId: string;
    tableName: string;
  }

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<formData>({
    projectId: '',
    datasetId: '',
    tableName: '',
  });

  const handleProjectIdChange = (value: string) => {
    const updatedFormData = {...formData};
    updatedFormData.projectId = value;
    setFormData(updatedFormData);
    fetchDatasets(value);
  };

  const handleDatasetIdChange = (value: string) => {
    const updatedFormData = {...formData};
    updatedFormData.datasetId = value;
    setFormData(updatedFormData);
    fetchTables(updatedFormData.projectId, value);
  };

  const handleTableNameChange = (value: string) => {
    const updatedFormData = {...formData};
    updatedFormData.tableName = value;
    setFormData(updatedFormData);
    fetchData(updatedFormData.projectId, updatedFormData.datasetId, value);
  };

  const fetchDatasets = async (projectId: string) => {
    try {
      const response = await axios.get(
        `${baseUrl}/projects/${projectId}/datasets`
      );
      if (response.data.errors) {
        setIsError(true);
        setDatasetIds(['']);
        setMessage({
          message: `An Error Occured: ${response.data.errors.message}`,
          severity: 'error',
        });
      } else {
        setDatasetIds(response.data);
        setIsError(false);
        setMessage(undefined);
      }
    } catch (error) {
      setDatasetIds(['']);
      setIsError(true);
    }
  };

  const fetchTables = async (projectId: string, dataset_id: string) => {
    try {
      const response = await axios.get(
        `${baseUrl}/projects/${projectId}/datasets/${dataset_id}/tables?tag=${tag}`
      );
      if (response.data.errors) {
        setTableNames(['']);
        setMessage({message: response.data.errors.message, severity: 'error'});
      } else {
        if (response.data.length > 0) {
          setTableNames(response.data);
          setMessage(undefined);
        } else {
          setTableNames(['']);
          setMessage({
            message: `There are no log table found which is tagged as : ${tag} `,
            severity: 'error',
          });
        }
      }
    } catch (error) {
      setTableNames(['']);
      setIsError(true);
      setMessage({message: 'An error occured', severity: 'error'});
    }
  };

  const fetchData = async (
    project_Id: string,
    dataset_id: string,
    table_name: string
  ) => {
    setIsLoading(true);
    setMessage({message: 'Wait... it may take a while', severity: 'info'});
    try {
      const response = await axios.get(
        `${baseUrl}/projects/${project_Id}/datasets/${dataset_id}/tables/${table_name}/logs`
      );
      if (response.data.errors) {
        setIsError(true);
        setData([]);
        setMessage({
          message: response.data.errors.message,
          severity: 'error',
        });
      } else {
        setIsError(false);
        setData(response.data);
        if (response.data.length === 0) {
          setMessage({
            message: 'Good news!! There are no data violations logged!',
            severity: 'info',
          });
        } else {
          setMessage({
            message: `${response.data.length} Rules violations are retrieved successfully !`,
            severity: 'info',
          });
        }
      }
    } catch (error) {
      setMessage({message: `An Error occured - ${error}`, severity: 'error'});
      console.error('Error fetching form data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const updatedFormData = {...formData};
    if (updatedFormData.projectId === '') {
      updatedFormData.projectId = defaultProjectId;
      fetchDatasets(defaultProjectId);
    }
    setFormData(updatedFormData);
  }, []);

  const columns = [
    {field: 'log_type', headerName: 'Log Type', flex: 1},
    {field: 'column', headerName: 'Column Name', flex: 2},
    {field: 'error', headerName: 'Error', flex: 5},
    {field: 'rule', headerName: 'Rule', flex: 2},
  ];

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  return (
    <React.Fragment>
      <Box paddingLeft={2} paddingTop={3}>
        <Stack spacing={2} direction="row">
          <TextField
            required
            id="source_project_id"
            type="text"
            label="Source Project ID"
            placeholder="Source Project ID"
            value={formData.projectId}
            // defaultValue={defaultProjectId}
            onChange={e => handleProjectIdChange(e.target.value)}
            size="small"
          />

          <FormControl sx={{m: 1, minWidth: 200}} size="small">
            <InputLabel id="source-dataset-id">Select Dataset*</InputLabel>
            <Select
              required
              id="source_instance_id"
              labelId="source-dataset-id"
              label="Source Dataset ID"
              placeholder="Source Dataset ID"
              size="small"
              value={formData.datasetId}
              onChange={e => handleDatasetIdChange(e.target.value)}
            >
              {datasetIds &&
                datasetIds?.map(item => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl sx={{m: 1, minWidth: 200}} size="small">
            <InputLabel id="demo-select-small-label">Select Table*</InputLabel>
            <Select
              required
              id="source_table_name"
              labelId="source_table_name"
              size="small"
              label="Source Table Name"
              placeholder="Source Table Name"
              value={formData.tableName}
              onChange={e => handleTableNameChange(e.target.value)}
            >
              {tableNames &&
                tableNames?.map(item => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Stack>
      </Box>

      <Grid padding={2} item xs={12}>
        {isLoading && <CircularProgress />}
        <CustomAlertMessage {...message} />
      </Grid>

      <Grid paddingTop={2} item xs={12}>
        {data.length !== 0 && (
          <>
            <Grid paddingBottom={1} display="flex" justifyContent="flex-end">
              <Typography variant="caption">
                <List>
                  <ListItemIcon>
                    <InfoOutlined color="info" /> Click on row to get more
                    infomation
                  </ListItemIcon>
                </List>
              </Typography>
            </Grid>
            <DataGrid
              getRowId={() => generateRandomIndex()}
              rows={data}
              columns={columns}
              onRowClick={handleRowClick}
              slots={{
                toolbar: CustomToolbar,
              }}
            ></DataGrid>
          </>
        )}
      </Grid>
      <DetailsDialogBox {...detailsDialogBoxProps} />
    </React.Fragment>
  );
}
