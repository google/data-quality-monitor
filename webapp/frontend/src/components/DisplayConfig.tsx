import React, {useState} from 'react';
import axios from 'axios';

// import MUI
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';

// Button Icons
import {DeleteForever, AddCircle, CloudUpload} from '@mui/icons-material';

// Config and utils import
import {Column, LogTable, SourceTable, BucketPathProps} from '../types/Config';
import {Config, Parser, Rule, Arg} from '../types/Config';
import {CustomMessage} from '../types/GenericTypes';
import CustomAlertMessage from './CustomAlertMessage';
import {FormHelperText} from '@mui/material';

const ConfigForm = (props: BucketPathProps) => {
  // env variables
  const baseUrl: string = process.env.REACT_APP_DQM_API_BASE_URL
    ? process.env.REACT_APP_DQM_API_BASE_URL
    : 'API BASE URL NOT DEFINED';

  const configSchemaBucketName: string = process.env
    .REACT_APP_DQM_RULE_CONFIG_SCHEMA_BUCKET_NAME
    ? process.env.REACT_APP_DQM_RULE_CONFIG_SCHEMA_BUCKET_NAME
    : 'CONFIG BUCKET NAME NOT DEFINED';

  const jsonSchemaFileName: string = process.env
    .REACT_APP_DQM_RULE_CONFIG_SCHEMA_FILE_NAME
    ? process.env.REACT_APP_DQM_RULE_CONFIG_SCHEMA_FILE_NAME
    : 'SCHEMA FILE NAME NOT DEFINED';

  const initialColumnState: Column[] = [
    {
      column_name: '',
      parser: '',
      rules: [],
    },
  ];

  const initialLogTable: LogTable = {
    project_id: '',
    dataset_id: '',
    table_name: '',
  };

  const initialRuleState: Rule = {
    rule: '',
    args: {},
  };

  const initialSourceTable: SourceTable = {
    project_id: '',
    dataset_id: '',
    table_name: '',
    n_tables_to_check: 1,
  };

  const initialFormState: Config = {
    service_account_email: '',
    source_table: initialSourceTable,
    log_table: initialLogTable,
  };

  const [parsersList, setParsersList] = useState<string[]>([]);
  const [columnsList, setColumnsList] = useState<string[]>([]);
  const [ruleOptionJson, setRuleOptionJson] = useState<any>({});
  const [rulesArgs, setRulesArgs] = useState<Record<string, Arg>>();
  const [fixedConfig, setFixedConfig] = useState<Config>(initialFormState);
  const [formData, setFormData] = useState<Column[]>(initialColumnState);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [sourceDatasets, setSourceDatasets] = useState<string[]>([]);
  const [sourceTables, setSourceTables] = useState<string[]>([]);
  const [logDatasets, setLogDatasets] = useState<string[]>([]);
  const [logTables, setLogTables] = useState<string[]>(['']);
  const [draft, setDraft] = useState(false);
  const [finalVersion, setFinalVersion] = useState(false);
  const [displayArgs, setDisplayArgs] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isErrors, setIsErrors] = useState<boolean>(false);
  const [message, setMessage] = useState<CustomMessage | undefined>({
    message: undefined,
    severity: undefined,
  });

  const fetchDatasets = async (projectId: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/projects/${projectId}/datasets`
      );
      if (response.data.errors) {
        setSourceDatasets(['']);
      } else {
        setSourceDatasets(response.data);
        setMessage(undefined);
      }
    } catch (error) {
      setSourceDatasets(['']);
      setMessage({message: 'An error occured', severity: 'error'});
    } finally {
      setIsLoading(false);
    }
  };

  const fetchColumns = async (
    projectId: string,
    datasetId: string,
    tableName: string
  ) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/projects/${projectId}/datasets/${datasetId}/tables/${tableName}/columns`
      );
      if (response.data.errors) {
        setColumnsList(['']);
      } else {
        setColumnsList(response.data.columns);
        setMessage(undefined);
      }
    } catch (error) {
      setColumnsList(['']);
      setMessage({message: 'An error occured', severity: 'error'});
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTables = async (projectId: string, dataset_id: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/projects/${projectId}/datasets/${dataset_id}/tables`
      );
      if (response.data.errors) {
        setSourceTables(['']);
      } else {
        setSourceTables(response.data);
        setMessage(undefined);
      }
    } catch (error) {
      setSourceTables(['']);
      setMessage({message: 'An error occured', severity: 'error'});
    } finally {
      setIsLoading(false);
    }
  };

  const fetchColumnsLog = async (projectId: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/projects/${projectId}/datasets`
      );
      if (response.data.errors) {
        setLogDatasets([]);
      } else {
        setLogDatasets(response.data);
        setMessage(undefined);
      }
    } catch (error) {
      setLogDatasets([]);
      setMessage({message: 'An error occured', severity: 'error'});
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTablesLog = async (projectId: string, dataset_id: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${baseUrl}/projects/${projectId}/datasets/${dataset_id}/tables`
      );
      if (response.data.errors) {
        setLogTables(['']);
      } else {
        if (!response.data.includes('dqm_logs')) {
          response.data.push('dqm_logs');
        }
        setLogTables(response.data);
        setMessage(undefined);
      }
    } catch (error) {
      setLogTables([]);
      setMessage({message: 'An error occured', severity: 'error'});
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGroup = () => {
    setFormData([...formData, {column_name: '', parser: '', rules: []}]);
  };

  const handleRemoveGroup = (index: number) => {
    const updatedFormData = [...formData];
    updatedFormData.splice(index, 1);
    setFormData(updatedFormData);
  };

  const handleColumnNameChange = (index: number, value: string) => {
    const updatedFormData = [...formData];
    updatedFormData[index].column_name = value;
    setFormData(updatedFormData);
  };

  const handleParserChange = (index: number, value: string) => {
    const updatedFormData = [...formData];
    updatedFormData[index].parser = value as Column['parser'];
    setFormData(updatedFormData);
  };

  const handleAddRule = (index: number) => {
    const updatedFormData = [...formData];
    updatedFormData[index].rules.push(initialRuleState);
    setFormData(updatedFormData);
  };

  const handleRemoveRule = (columnIndex: number, ruleIndex: number) => {
    const updatedFormData = [...formData];
    updatedFormData[columnIndex].rules.splice(ruleIndex, 1);
    setFormData(updatedFormData);
  };

  const handleDraftCheckbok = () => {
    setDraft(!draft);
  };

  const handleFinalVersionCheckbok = () => {
    setFinalVersion(!finalVersion);
    setNewFileName(props.fileName.slice(7, props.fileName.length));
  };

  const handleNewFileNameChange = (value: string) => {
    setNewFileName(value);
  };

  const handleServiceAccountChange = (value: string) => {
    const updatedFormData = {...fixedConfig};
    updatedFormData.service_account_email = value;
    setFixedConfig(updatedFormData);
  };

  const handleSourceProjectIdChange = (value: string) => {
    const updatedFormData = {...fixedConfig};
    updatedFormData.source_table.project_id = value;
    setFixedConfig(updatedFormData);
    fetchDatasets(value);
  };

  const handleSourceInstanceIdChange = (value: string | undefined) => {
    if (value !== undefined) {
      const updatedFormData = {...fixedConfig};
      updatedFormData.source_table.dataset_id = value;
      setFixedConfig(updatedFormData);
      fetchTables(fixedConfig.source_table.project_id, value);
    }
  };

  const handleSourceTableNameChange = (value: string) => {
    if (value !== undefined) {
      const updatedFormData = {...fixedConfig};
      updatedFormData.source_table.table_name = value;
      setFixedConfig(updatedFormData);
      const projectId =
        updatedFormData.source_table && updatedFormData.source_table.project_id;
      const datasetId =
        updatedFormData.source_table && updatedFormData.source_table.dataset_id;

      fetchColumns(projectId, datasetId, value);
    }
  };

  const handleLogProjectIdChange = (value: string) => {
    const updatedFormData = {...fixedConfig};
    updatedFormData.log_table.project_id = value;
    setFixedConfig(updatedFormData);
    fetchColumnsLog(value);
  };

  const handleLogInstanceIdChange = (value: string | undefined) => {
    if (value !== undefined) {
      const updatedFormData = {...fixedConfig};
      updatedFormData.log_table.dataset_id = value;
      setFixedConfig(updatedFormData);
      fetchTablesLog(fixedConfig.log_table.project_id, value);
    }
  };

  const handleLogTableNameChange = (value: string) => {
    if (value !== undefined) {
      const updatedFormData = {...fixedConfig};
      updatedFormData.log_table.table_name = value;
      setFixedConfig(updatedFormData);
    }
  };

  const handleFieldChange = (
    value: string,
    columnIndex: number,
    ruleIndex: number,
    key: string
  ) => {
    const updatedFormData = [...formData];
    const isNumeric = /^-?\d+(\.\d+)?$/.test(value);
    const formattedValue = isNumeric ? parseFloat(value) : value;
    updatedFormData[columnIndex].rules[ruleIndex].args[key] = formattedValue;
    setFormData(updatedFormData);
  };

  const createFormField = (
    arg: Arg,
    columnIndex: number,
    ruleIndex: number,
    key: string
  ) => {
    return (
      <>
        <TextField
          required
          id={`${columnIndex}${ruleIndex}${key}`}
          key={`${columnIndex}${ruleIndex}${key}`}
          size="small"
          label={key}
          value={formData[columnIndex]?.rules[ruleIndex]?.args[key] || ''}
          onChange={e =>
            handleFieldChange(e.target.value, columnIndex, ruleIndex, key)
          }
        />
      </>
    );
  };

  const handleRuleChange = (
    columnIndex: number,
    ruleIndex: number,
    value: string
  ) => {
    const updatedFormData = [...formData];
    const empty: Arg = {};
    updatedFormData[columnIndex].rules[ruleIndex].rule = value;
    if (rulesArgs === undefined) {
      updatedFormData[columnIndex].rules[ruleIndex].args = empty;
    } else
      updatedFormData[columnIndex].rules[ruleIndex].args = rulesArgs[value];
    setFormData(updatedFormData);
    setDisplayArgs(true);
  };

  const handleSave = async () => {
    setIsLoading(true);

    if (validateForm()) {
      try {
        const reqData = {...fixedConfig, columns: formData};
        let fileName = '';
        if (props.newConfig) {
          draft
            ? (fileName = `_DRAFT_${newFileName}`)
            : (fileName = newFileName);
        } else {
          fileName = props.fileName;
        }

        await axios.post(
          `${baseUrl}/projects/${props.projectId}/buckets/${props.bucketId}/files/${fileName}`,
          reqData,
          {}
        );

        finalVersion && handleRenameFile(props.fileName, newFileName);

        setFormErrors(['Config is saved successfully']);
      } catch (error) {
        error && setFormErrors([`An Error Occured ${error}`]);
      } finally {
        setIsLoading(false);
      }
    } else setIsLoading(false);
  };

  const handleRenameFile = async (
    sourceFileName: string,
    destinationFileName: string
  ) => {
    try {
      await axios.post(
        `${baseUrl}/projects/${props.projectId}/buckets/${props.bucketId}/files/${sourceFileName}/rename/${destinationFileName}`
      );
    } catch (error) {
      error && setFormErrors([`An Error Occured ${error}`]);
    }
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (props.newConfig) {
      newFileName.trim() === '' ? errors.push('File Name is missing') : '';
      !newFileName.trim().endsWith('.json')
        ? errors.push('File name must contain .json extension')
        : '';
    }

    fixedConfig.service_account_email === ''
      ? errors.push('Service Account email is missing')
      : '';

    fixedConfig.log_table.dataset_id === '' ||
    fixedConfig.log_table.project_id === ''
      ? errors.push('Project and Dataset ID is mandatory for Log Tables')
      : '';

    fixedConfig.source_table.dataset_id === '' ||
    fixedConfig.source_table.project_id === '' ||
    fixedConfig.source_table.table_name === ''
      ? errors.push('Source table related all info are mandatory')
      : '';

    if (formData.length === 0) {
      errors.push('There must be at least one Rule for one Column');
    }

    formData.forEach(column => {
      if (column?.column_name?.trim() === '') {
        errors.push('Column Names are mandatory');
      }
      if (column?.parser?.trim() === '') {
        errors.push('Parser type is mandatory');
      }
      if (column?.rules.length === 0) {
        errors.push('Each Column must have at least 1 rule');
      }
      column?.rules?.forEach(rule => {
        if (rule.rule.trim() === '') {
          errors.push('Rules are mandatory');
        }
        Object.keys(rule.args).forEach(key => {
          if (String(rule.args[key]).trim() === '') {
            errors.push(`${key} are mandatory`);
          }
        });
      });
    });

    setFormErrors(errors);
    return errors.length === 0;
  };

  const dqmConfigFormJson = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/projects/${props.projectId}/buckets/${configSchemaBucketName}/files/${jsonSchemaFileName}`
      );
      if (response.data.errors) {
        setIsErrors(true);
        setMessage({
          message: response.data.errors.message,
          severity: 'error',
        });
      } else {
        const jsonData = response.data;
        const parsers: Parser[] = [];

        Object.keys(jsonData.parser).map(parserName => {
          const rules: Rule[] = [];
          Object.keys(jsonData.parser[parserName].rules).map(ruleName => {
            const args: Arg = {};
            Object.keys(jsonData.parser[parserName].rules[ruleName].args).map(
              key => {
                args[key] =
                  jsonData.parser[parserName].rules[ruleName].args[key].value;
              }
            );
            rules.push({rule: ruleName, args: args});
          });
          const x = {
            name: parserName,
            rules: rules,
          };

          parsers.push(x);
        });
        const parserList: string[] = [];
        parsers.map(item => {
          parserList.push(item.name);
        });

        setParsersList(parserList);
        const rulesArgsRecord: Record<string, Arg> = {};
        const ruleOptionJsonRecord: Record<string, string[]> = {};

        parsers.map(parser => {
          const rules: string[] = [];

          parser.rules.map(rule => {
            rules.push(rule.rule);
            rulesArgsRecord[rule.rule] = rule.args;
          });
          ruleOptionJsonRecord[parser.name] = rules;
        });
        setRuleOptionJson(ruleOptionJsonRecord);
        setRulesArgs(rulesArgsRecord);
      }
    } catch (error) {
      setMessage({message: `An Error occured - ${error}`, severity: 'error'});
      console.error('Error fetching form data:', error);
    }
  };

  const handleNewConfig = () => {
    setFixedConfig(initialFormState);
    setFormData(initialColumnState);
    setDraft(false);
  };

  const fetchData = async () => {
    try {
      props.fileName.startsWith('_DRAFT_') ? setDraft(true) : setDraft(false);
      const response = await axios.get(
        `${baseUrl}/projects/${props.projectId}/buckets/${props.bucketId}/files/${props.fileName}`
      );
      if (response.data.errors) {
        setIsErrors(true);
        setMessage({
          message: response.data.errors.message,
          severity: 'error',
        });
      } else {
        setDisplayArgs(true);
        const {columns, ...rest} = response.data;
        setFormData(columns);
        fetchDatasets(rest.source_table.project_id);
        fetchColumnsLog(rest.log_table.project_id);
        fetchTables(rest.source_table.project_id, rest.source_table.dataset_id);
        fetchTablesLog(rest.log_table.project_id, rest.log_table.dataset_id);
        fetchColumns(
          rest.source_table.project_id,
          rest.source_table.dataset_id,
          rest.source_table.table_name
        );

        columns.map((column: Column, columnIndex: number) => {
          column.rules.map((rule: Rule, ruleIndex: number) => {
            Object.keys(rule.args).map(key => {
              return createFormField(rule.args, columnIndex, ruleIndex, key);
            });
          });
        });
        const logTable = [response.data.log_table.table_name];
        const sourceTable = [response.data.source_table.table_name];
        const logDatasetId = [response.data.log_table.dataset_id];
        const sourceDatasetId = [response.data.source_table.dataset_id];

        setLogTables(logTable);
        setSourceTables(sourceTable);
        setLogDatasets(logDatasetId);
        setSourceDatasets(sourceDatasetId);
        setFixedConfig(rest);
      }
    } catch (error) {
      console.error('Error fetching form data:', error);
    }
  };

  React.useEffect(() => {
    try {
      dqmConfigFormJson();
      if (props.newConfig) {
        handleNewConfig();
      } else {
        fetchData();
      }
    } catch (error) {
      console.error('Error fetching form data:', error);
    }
  }, [props]);

  return (
    <React.Fragment>
      {!isErrors && (
        <Badge
          badgeContent={draft ? 'DRAFT' : ''}
          color={draft ? 'primary' : 'default'}
        >
          <Grid paddingTop={1} item xs={12}>
            {formErrors.length !== 0 && (
              <Alert
                id="alert-message"
                severity="info"
                sx={{whiteSpace: 'pre-line'}}
              >
                {formErrors.join('\n -> ')}
              </Alert>
            )}
            {props.newConfig && (
              <Box margin={2} paddingBottom={2}>
                <Stack spacing={2} direction="row">
                  <FormControl style={{width: 250}}>
                    <TextField
                      required
                      id="new_config_file_name"
                      type="text"
                      label="New Config File Name"
                      placeholder="New Config File Name"
                      value={newFileName}
                      onChange={e => handleNewFileNameChange(e.target.value)}
                      size="small"
                    />
                  </FormControl>

                  <Tooltip title="Config saved as Draft, will not be picked up by Workflow">
                    <FormControlLabel
                      label="Save it as Draft"
                      control={
                        <Checkbox
                          onChange={handleDraftCheckbok}
                          color="success"
                        />
                      }
                    />
                  </Tooltip>
                </Stack>
              </Box>
            )}
            {!props.newConfig && draft && (
              <Tooltip title="Final version will be picked up by Workflow">
                <FormControlLabel
                  label="Save it as final Version"
                  control={
                    <Checkbox
                      onChange={handleFinalVersionCheckbok}
                      color="success"
                    />
                  }
                />
              </Tooltip>
            )}

            {finalVersion && (
              <FormControl style={{width: 250}}>
                <TextField
                  required
                  id="final_name"
                  type="text"
                  label="Type your final version File Name"
                  placeholder="Final Version File Name"
                  value={newFileName}
                  onChange={e => handleNewFileNameChange(e.target.value)}
                  size="small"
                />
              </FormControl>
            )}

            {isLoading && <CircularProgress />}
            {fixedConfig && (
              <Box sx={{border: '1px dashed grey'}}>
                <Box padding={2}>
                  <TextField
                    required
                    type="email"
                    id="service_account-email"
                    label="Service Account email Address"
                    placeholder="Service Account email Address"
                    value={fixedConfig && fixedConfig.service_account_email}
                    onChange={e => handleServiceAccountChange(e.target.value)}
                    size="small"
                  />
                </Box>
                {fixedConfig.source_table && (
                  <Box paddingLeft={2}>
                    <Stack spacing={2} direction="row">
                      <TextField
                        required
                        id="source_project_id"
                        type="text"
                        label="Source Project ID"
                        placeholder="Source Project ID"
                        value={fixedConfig.source_table?.project_id}
                        onChange={e =>
                          handleSourceProjectIdChange(e.target.value)
                        }
                        size="small"
                      />

                      <FormControl sx={{m: 1, minWidth: 200}} size="small">
                        <InputLabel id="source-dataset-id">
                          Select Dataset*
                        </InputLabel>
                        <Select
                          required
                          id="source_instance_id"
                          labelId="source-dataset-id"
                          label="Source Dataset ID"
                          placeholder="Source Dataset ID"
                          size="small"
                          defaultValue={fixedConfig.source_table?.dataset_id}
                          value={
                            sourceDatasets.length > 0
                              ? fixedConfig.source_table?.dataset_id
                              : fixedConfig.source_table?.dataset_id
                          }
                          onChange={e =>
                            handleSourceInstanceIdChange(e.target.value)
                          }
                        >
                          {sourceDatasets &&
                            sourceDatasets?.map(item => (
                              <MenuItem value={item}>{item}</MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                      <FormControl sx={{m: 1, minWidth: 200}} size="small">
                        <InputLabel id="demo-select-small-label">
                          Select Table*
                        </InputLabel>
                        <Select
                          required
                          id="source_table_name"
                          labelId="source_table_name"
                          size="small"
                          label="Source Table Name"
                          placeholder="Source Table Name"
                          value={fixedConfig.source_table?.table_name}
                          onChange={e =>
                            handleSourceTableNameChange(e.target.value)
                          }
                        >
                          {sourceTables &&
                            sourceTables?.map(item => (
                              <MenuItem value={item}>{item}</MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Stack>
                  </Box>
                )}

                {fixedConfig.log_table && (
                  <Box padding={2}>
                    <Stack spacing={2} direction="row">
                      <TextField
                        required
                        id="log_project_id"
                        type="text"
                        label="Log Project ID"
                        placeholder="Log Project ID"
                        value={fixedConfig.log_table.project_id}
                        onChange={e => handleLogProjectIdChange(e.target.value)}
                        size="small"
                      />
                      <FormControl sx={{m: 1, minWidth: 200}} size="small">
                        <InputLabel id="demo-select-small-label">
                          Select Dataset*
                        </InputLabel>
                        <Select
                          required
                          id="log_dataset_id"
                          labelId="log-dataset-id"
                          size="small"
                          label="Select Log Dataset"
                          placeholder="Select Log Dataset"
                          value={fixedConfig.log_table?.dataset_id}
                          onChange={e =>
                            handleLogInstanceIdChange(e.target.value)
                          }
                        >
                          {logDatasets &&
                            logDatasets?.map(item => (
                              <MenuItem value={item}>{item}</MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                      <FormControl sx={{m: 1, minWidth: 200}} size="small">
                        <InputLabel id="log-table-name">
                          Select Table
                        </InputLabel>
                        <Select
                          required
                          id="log_table_name"
                          labelId="log_table_name"
                          size="small"
                          label="Select log table name"
                          placeholder="Select log table name"
                          value={fixedConfig.log_table?.table_name}
                          onChange={e =>
                            handleLogTableNameChange(e.target.value)
                          }
                        >
                          {logTables &&
                            logTables.map(item => (
                              <MenuItem value={item}>{item}</MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>
                          Choose "dqm_logs" to create a new one, if it does not
                          exist
                        </FormHelperText>
                      </FormControl>
                    </Stack>
                  </Box>
                )}
              </Box>
            )}

            {formData &&
              formData.map((column, columnIndex) => (
                <Badge>
                  <Grid key={columnIndex} paddingTop={2} container>
                    <Box sx={{p: 2, border: '1px dashed grey'}}>
                      <Box>
                        <Stack spacing={2} direction="row">
                          <FormControl sx={{m: 1, minWidth: 200}} size="small">
                            <InputLabel id="demo-select-small-label">
                              Select Column*
                            </InputLabel>
                            <Select
                              required
                              id="column_name"
                              labelId="column_name"
                              size="small"
                              label="Column Name"
                              value={column.column_name}
                              onChange={e =>
                                handleColumnNameChange(
                                  columnIndex,
                                  e.target.value
                                )
                              }
                            >
                              {columnsList &&
                                columnsList.map(item => (
                                  <MenuItem value={item}>{item}</MenuItem>
                                ))}
                            </Select>
                          </FormControl>

                          <FormControl sx={{m: 1, minWidth: 200}} size="small">
                            <InputLabel id="select-parser-id">
                              Select Parser*
                            </InputLabel>
                            <Select
                              required
                              labelId="parser-id"
                              label="Parser"
                              value={column.parser}
                              onChange={e =>
                                handleParserChange(columnIndex, e.target.value)
                              }
                            >
                              {parsersList.map(item => (
                                <MenuItem value={item}>{item}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <Tooltip title="Add a New Rule">
                            <IconButton
                              onClick={() => handleAddRule(columnIndex)}
                            >
                              <AddCircle color="success" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Box>
                      {column &&
                        column.rules &&
                        column.rules.map((rule, ruleIndex) => (
                          <Box
                            key={ruleIndex}
                            sx={{
                              backgroundColor: '#fafafa',
                            }}
                            paddingTop={2}
                          >
                            <Stack spacing={2} direction="row">
                              <FormControl
                                sx={{m: 1, minWidth: 200}}
                                size="small"
                              >
                                <InputLabel id="select-rules-id">
                                  Select Rule*
                                </InputLabel>
                                <Select
                                  required
                                  labelId="rules-id"
                                  label="Rules"
                                  size="small"
                                  value={rule.rule}
                                  onChange={e =>
                                    handleRuleChange(
                                      columnIndex,
                                      ruleIndex,
                                      e.target.value
                                    )
                                  }
                                >
                                  {ruleOptionJson &&
                                    ruleOptionJson[column?.parser]?.map(
                                      (item: any) => (
                                        <MenuItem key={item} value={item}>
                                          {item}
                                        </MenuItem>
                                      )
                                    )}
                                </Select>
                              </FormControl>

                              {Object.keys(rule.args).length > 0 &&
                                rulesArgs &&
                                Object.keys(rulesArgs[rule.rule]).map(key => {
                                  return createFormField(
                                    rulesArgs[rule.rule],
                                    columnIndex,
                                    ruleIndex,
                                    key
                                  );
                                })}

                              <Tooltip title="Delete Rule">
                                <IconButton
                                  onClick={() =>
                                    handleRemoveRule(columnIndex, ruleIndex)
                                  }
                                >
                                  <DeleteForever color="error" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </Box>
                        ))}
                    </Box>
                  </Grid>

                  <Grid item xs={1}>
                    <Tooltip title={`Delete Column ${columnIndex}`}>
                      <IconButton
                        onClick={() => handleRemoveGroup(columnIndex)}
                      >
                        <DeleteForever color="error" />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Badge>
              ))}

            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Tooltip title="Add New Column">
                <IconButton color="primary" onClick={handleAddGroup}>
                  <AddCircle />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid
              item
              xs={12}
              direction="row"
              container
              justifyContent="flex-end"
            >
              <Stack spacing={1} direction="row">
                <Tooltip title="Save changes in Config File in Google Bucket">
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    startIcon={<CloudUpload />}
                    onClick={handleSave}
                  >
                    Save Config
                  </Button>
                </Tooltip>
              </Stack>
            </Grid>
          </Grid>
        </Badge>
      )}
      <CustomAlertMessage {...message} />
    </React.Fragment>
  );
};

export default ConfigForm;
