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

import React from 'react';
import {Link} from 'react-router-dom';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HouseOutlined from '@mui/icons-material/HouseOutlined';
import DriveFileRenameOutlineOutlined from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import PlaylistPlay from '@mui/icons-material/PlaylistPlay';
import Report from '@mui/icons-material/Report';

export const mainListItems = (
  <React.Fragment>
    <ListItemButton component={Link} to="/">
      <ListItemIcon>
        <HouseOutlined />
      </ListItemIcon>
      <ListItemText primary="Home" />
    </ListItemButton>
    <ListItemButton component={Link} to="/config">
      <ListItemIcon>
        <DriveFileRenameOutlineOutlined />
      </ListItemIcon>
      <ListItemText primary="Config" />
    </ListItemButton>
    <ListItemButton component={Link} to="/execute">
      <ListItemIcon>
        <PlaylistPlay />
      </ListItemIcon>
      <ListItemText primary="Workflows" />
    </ListItemButton>
    <ListItemButton component={Link} to="/schedule">
      <ListItemIcon>
        <CalendarMonth />
      </ListItemIcon>
      <ListItemText primary="Schedule" />
    </ListItemButton>
    <ListItemButton component={Link} to="/rule-violations">
      <ListItemIcon>
        <Report />
      </ListItemIcon>
      <ListItemText primary="Rule Violations" />
    </ListItemButton>
  </React.Fragment>
);
