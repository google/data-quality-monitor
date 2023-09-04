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

import CalendarTodayOutlined from '@mui/icons-material/CalendarTodayOutlined';
import DriveFileRenameOutlineOutlined from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import PlaylistPlayOutlined from '@mui/icons-material/PlaylistPlayOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import {Link} from 'react-router-dom';

function SidebarHomePage() {
  return (
    <Card>
      <CardContent>
        <ListItemIcon sx={{padding: 1}}>
          <ListItemAvatar>
            <DriveFileRenameOutlineOutlined />
          </ListItemAvatar>
          <ListItemText primary="Configuration Management" />
        </ListItemIcon>
        <Box border={1} sx={{p: 1}} borderColor="lightGreen">
          <List>
            <ListItemText
              secondary={
                ' DQM is configured with simple JSON files, stored on Google Cloud Storage. These JSON files can be managed here in Configuration management page.'
              }
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Button
                component={Link}
                to="/config"
                variant="outlined"
                size="small"
                color="primary"
              >
                Visit
              </Button>
            </Box>
          </List>
        </Box>
      </CardContent>

      <CardContent>
        <ListItemIcon sx={{padding: 1}}>
          <ListItemAvatar>
            <CalendarTodayOutlined />
          </ListItemAvatar>
          <ListItemText primary="Job Scheduler Management" />
        </ListItemIcon>
        <Box border={1} sx={{p: 1}} borderColor="lightGreen">
          <List>
            <ListItemText
              secondary={
                'Workflow to run the DQM, is scheduled via Google Job Scheduler. You can manage the schedule the schedule here.'
              }
            />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Button
                component={Link}
                to="/schedule"
                variant="outlined"
                size="small"
                color="primary"
              >
                Visit
              </Button>
            </Box>
          </List>
        </Box>
      </CardContent>

      <CardContent>
        <ListItemIcon sx={{padding: 1}}>
          <ListItemAvatar>
            <PlaylistPlayOutlined />
          </ListItemAvatar>
          <ListItemText primary="Workflow Management" />
        </ListItemIcon>

        <Box border={1} sx={{p: 1}} borderColor="lightGreen">
          <List>
            <ListItemText
              secondary={
                ' You can view and trigger an existing workflow. You can also view the latest executions'
              }
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Button
                component={Link}
                to="/execute"
                variant="outlined"
                size="small"
                color="primary"
              >
                Visit
              </Button>
            </Box>
          </List>
        </Box>
      </CardContent>
    </Card>
  );
}

export default SidebarHomePage;
