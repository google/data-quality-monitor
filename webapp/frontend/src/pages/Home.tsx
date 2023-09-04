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
import {
  Grid,
  Container,
  Box,
  Toolbar,
  Card,
  CardContent,
  Divider,
} from '@mui/material';

import Title from '../components/Title';
import RuleViolationsLogs from '../components/RuleViolationsLogs';

import Disclaimer from '../components/Disclaimer';
import AboutDQM from '../components/AboutDQM';
import SidebarHomePage from '../components/SidebarHomePage';

const HomePage = () => {
  return (
    <React.Fragment>
      <Box
        component="main"
        sx={{
          backgroundColor: theme =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />

        <Container sx={{mt: 2, mb: 3}}>
          <Grid container spacing={2} direction="row" alignItems="stretch">
            <Grid item xs={7} md={7} lg={7}>
              <Card>
                <CardContent>
                  <AboutDQM />

                  <Grid padding={2}>
                    <Divider />
                  </Grid>
                  <Grid padding={1}></Grid>
                  <Disclaimer />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={4} md={4} lg={4}>
              <SidebarHomePage />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </React.Fragment>
  );
};

export default HomePage;
