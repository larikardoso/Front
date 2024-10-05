import React from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '@mui/material'
import { TelaConsulta } from './TelaConsulta';
import { TelaCadastro } from './TelaCadastro';
import { AppProvider } from './context';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { TabContext, TabPanel, TabList } from '@mui/lab';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


function App() {
  const [value, setValue] = React.useState('1');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <AppProvider>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
          <TabList textColor="secondary"
            indicatorColor="secondary" onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Cadastro" value="1" />
            <Tab label="Consulta" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1" index={1}>
          <TelaCadastro />
        </TabPanel>
        <TabPanel value="2" index={2}>
          <TelaConsulta />
        </TabPanel>
      </TabContext>
    </AppProvider>
  );
}

export default App;