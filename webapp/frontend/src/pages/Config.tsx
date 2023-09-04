import ConfigList from '../components/ConfigList';

import Title from '../components/Title';
import StandardPageLayout from '../components/StandardPageLayout';

const ConfigPage = () => {
  return (
    <StandardPageLayout>
      <Title>Manage Rule Configuration for DQM</Title>
      <ConfigList />
    </StandardPageLayout>
  );
};

export default ConfigPage;
