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
import {Component} from 'react';
import {Route, Routes} from 'react-router-dom';

import Navigation from './components/Nav';
import SchedulePage from './pages/JobSchedule';
import RuleViolationsLogsPage from './pages/RuleViolationsLogs';
import WorkflowPage from './pages/Workflow';
import ConfigPage from './pages/Config';
import HomePage from './pages/Home';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/execute" element={<WorkflowPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/config" element={<ConfigPage />} />
          <Route path="/rule-violations" element={<RuleViolationsLogsPage />} />
        </Routes>
      </React.Fragment>
    );
  }
}

export default App;
