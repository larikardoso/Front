import React, { useContext } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '@mui/material'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { AppContext } from './context';
import { BACKEND_URL } from './constants';

export const TelaConsulta = () => {
    const { busData, setBusData } = useContext(AppContext);
    const { ponto, setPonto } = useContext(AppContext);
    const { latPonto, setLatPonto } = useContext(AppContext);
    const { longPonto, setLongPonto } = useContext(AppContext);
    const { linha, setLinha } = useContext(AppContext);

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: '#9515FF',
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    const getStop = async (e) => {
        e.preventDefault();
        const userData = {
            ponto: ponto,
            linha: linha,
        };

        try {
            const response = await axios.post(BACKEND_URL + 'stops', userData);
            const infoPonto = response.data[0]
            console.log(infoPonto)
            setLatPonto(infoPonto.stop_lat)
            setLongPonto(infoPonto.stop_lon)
            getBusData(infoPonto);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    };

    const getBusData = async (infoPonto) => {
        try {
            const response = await axios.get(BACKEND_URL + 'bus_data');
            let dadosFiltrados = response.data.filter((linhas) =>
                linhas.linha == linha
            );
            let origins = "";

            let onibusUnico = Object.values(
                dadosFiltrados.reduce((acc, item) => {
                    if (!acc[item.ordem] || acc[item.ordem].datahora < item.datahora) {
                        acc[item.ordem] = item;
                    }
                    return acc;
                }, {})
            );
            // limita em 25 onibus 
            onibusUnico = onibusUnico.slice(0, 25)
            console.log(onibusUnico);

            onibusUnico.forEach((element, index) => {
                const lat = element.latitude.replace(',', '.')
                const long = element.longitude.replace(',', '.')
                if (index > 0) origins = origins + "|"
                origins = origins + `${lat},${long}`
            });

            let destinations = `${infoPonto.stop_lat},${infoPonto.stop_lon}`
            getDistances(destinations, origins, onibusUnico)
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    };

    const getDistances = async (destinations, origins, dadosFiltrados) => {
        try {
            const response = await axios.post(BACKEND_URL + 'distance', {
                "destinations": destinations,
                "origins": origins
            });
            console.log(response)

            const lista = [];

            response.data.rows.forEach((element, index) => {
                lista.push({ key: index, linha: dadosFiltrados[index].linha, carro: dadosFiltrados[index].ordem, velocidade: dadosFiltrados[index].velocidade, tempo: element.elements[0].duration.text, lat: dadosFiltrados[index].latitude.replace(',', '.'), long: dadosFiltrados[index].longitude.replace(',', '.') })
            })

            console.log(lista)
            setBusData(lista)
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    };

    return (
        <div>
            <form onSubmit={getStop} className='center'>
                <h2>Todos os onibus da linha</h2>
                <Box
                    component="form"
                    sx={{ '& .MuiTextField-root': { m: 1, width: '50ch' } }}
                    noValidate
                    autoComplete="off"
                    className='center'
                >
                    <TextField
                        color="secondary"
                        type="ponto"
                        id="ponto"
                        label="Ponto"
                        placeholder="Digite o ponto"
                        value={ponto}
                        onChange={(e) => setPonto(e.target.value)}
                        multiline
                    />
                    <TextField
                        color="secondary"
                        type="text"
                        id="linha"
                        label="Linha"
                        placeholder="Digite a linha do ônibus"
                        value={linha}
                        onChange={(e) => setLinha(e.target.value)}
                        multiline
                    />
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button variant="contained" type="submit" style={{ padding: '10px', width: '15ch', backgroundColor: '#9515FF', color: 'white', border: 'none' }}>Enviar</Button>
                </Stack>
            </form>

            {/* Tabela com dados dos ônibus */}
            {busData.length > 0 ? <div >
                <div className='table'>
                    <TableContainer component={Paper} >
                        <Table sx={{ minWidth: 700, width: '100%' }} aria-label="customized table" >
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Linha</StyledTableCell>
                                    <StyledTableCell>Carro</StyledTableCell>
                                    <StyledTableCell >Velocidade (km/h)</StyledTableCell>
                                    <StyledTableCell >Tempo até o ponto</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {busData.map((bus) => (
                                    <StyledTableRow key={bus.key}>
                                        <StyledTableCell component="th" scope="row">
                                            {bus.linha}
                                        </StyledTableCell>
                                        <StyledTableCell component="th" scope="row">
                                            {bus.carro}
                                        </StyledTableCell>
                                        <StyledTableCell >{bus.velocidade}</StyledTableCell>
                                        <StyledTableCell >{bus.tempo}</StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer><TableContainer component={Paper}>
                    </TableContainer>
                </div>

                {/* Mapa com a posição dos ônibus */}
                <MapContainer center={[latPonto, longPonto]} zoom={12} style={{ height: '400px', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                    />

                    {busData.map((bus) => (
                        <Marker key={bus.index} position={[bus.lat, bus.long]}>
                            <Popup>
                                Ônibus {bus.linha} - Velocidade: {bus.velocidade} km/h
                            </Popup>
                        </Marker>
                    ))}

                    <CircleMarker center={[latPonto, longPonto]} pathOptions={{ color: '#9515FF' }} radius={20}>
                        <Popup>Popup in CircleMarker</Popup>
                    </CircleMarker>

                    <Marker key={100} position={[latPonto, longPonto]} >
                        <Popup>
                            Ponto informado
                        </Popup>
                    </Marker>
                </MapContainer>
            </div> : null}
        </div>
    );
};