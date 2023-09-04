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

import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `⚡️[server]: Server is running at ${process.env.REACT_APP_SERVER_URI}:${process.env.REACT_APP_SERVER_PORT}\n📖[Documentation]: Backend Documentation at ${process.env.REACT_APP_SERVER_URI}:${process.env.REACT_APP_SERVER_PORT}/docs `
    );
  } else {
    console.log(`⚡️[server]: DQM Backend server has started`);
  }
});
