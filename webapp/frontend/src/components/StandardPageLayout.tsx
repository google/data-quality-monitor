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
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

interface StandardPageProps {
  children?: React.ReactNode;
}

export default function StandardPageLayout(props: StandardPageProps) {
  return (
    <React.Fragment>
      <Box
        component="main"
        style={{}}
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

        <Container sx={{mt: 2, mb: 2}}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={10} lg={10}>
              <Paper
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  mt: 1,
                  mb: 1,
                }}
              >
                {props.children}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </React.Fragment>
  );
}
