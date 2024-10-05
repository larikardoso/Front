import React, { createContext, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import '@mui/material'
import dayjs from 'dayjs';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [email, setEmail] = useState('');
    const [linha_BD, setLinhaBD] = useState('');
    const [ponto_BD, setPontoBD] = useState('');
    const [janela1, setJanela1] = React.useState(dayjs());
    const [janela2, setJanela2] = React.useState(dayjs());
    const [busData, setBusData] = useState([]);
    const [selectedBus, setSelectedBus] = useState(null);
    const [ponto, setPonto] = useState('');
    const [latPonto, setLatPonto] = useState('');
    const [longPonto, setLongPonto] = useState('');
    const [linha, setLinha] = useState('');

    return (
        <AppContext.Provider value={{ email, setEmail, linha_BD, setLinhaBD, ponto_BD, setPontoBD, janela1, setJanela1, janela2, setJanela2, busData, setBusData, selectedBus, setSelectedBus, ponto, setPonto, latPonto, setLatPonto, longPonto, setLongPonto, linha, setLinha, }}>
            {children}
        </AppContext.Provider>
    );
};
