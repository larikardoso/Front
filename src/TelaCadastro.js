import React, { useContext } from 'react';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import '@mui/material'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AppContext } from './context';
import { BACKEND_URL } from './constants';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import LoadingIndicator from './LoadingComponent';

export const TelaCadastro = () => {
    const { email, setEmail } = useContext(AppContext);
    const { linha_BD, setLinhaBD } = useContext(AppContext);
    const { ponto_BD, setPontoBD } = useContext(AppContext);
    const { janela1, setJanela1 } = useContext(AppContext);
    const { janela2, setJanela2 } = useContext(AppContext);
    const { busData, setBusData } = useContext(AppContext);
    const [open, setOpen] = React.useState(false);
    const { setLoading } = useContext(AppContext);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const action = (
        <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}>
                Entendi
            </Button>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // formatando datas para acessar API de mobilidade
        const date1 = janela1;
        const dataFormatada1 = date1.format('YYYY-MM-DD+HH:mm:ss');
        const date2 = janela2;
        const dataFormatada2 = date2.format('YYYY-MM-DD+HH:mm:ss');

        // Aqui você pode fazer o envio do formulário para o backend ou executar alguma lógica
        const userData = {
            email: email,
            linha_BD: linha_BD,
            ponto_BD: ponto_BD,
            janela1: dataFormatada1,
            janela2: dataFormatada2,
        };


        try {
            const response = await axios.post(BACKEND_URL + 'clientes', userData);

            setBusData(response.data);
            setOpen(true);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        } finally {
            setLoading(false); // Finaliza o loading
        }

        // resetar o formulário após um submit
        setEmail('');
        setLinhaBD('');
        setPontoBD('');
    };

    return (
        <div className='center'>
            <h2>Cadastro de Aviso</h2>
            <form onSubmit={handleSubmit} className='center' >

                <Box
                    component="form"
                    sx={{ '& .MuiTextField-root': { m: 1, width: '50ch' } }}
                    noValidate
                    autoComplete="off"
                    className='center'
                >
                    <TextField
                        color="secondary"
                        type="email"
                        id="email"
                        label="E-mail"
                        placeholder="Digite seu e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        multiline
                    />
                    <TextField
                        color="secondary"
                        type="text"
                        id="linha_BD"
                        label="Linha"
                        placeholder="Digite o ID da Linha de onibus"
                        value={linha_BD}
                        onChange={(e) => setLinhaBD(e.target.value)}
                        multiline
                    />
                    <TextField
                        color="secondary"
                        type="text"
                        id="ponto_BD"
                        label="Ponto Selecionado:"
                        placeholder="Digite o ponto para embarque"
                        value={ponto_BD}
                        onChange={(e) => setPontoBD(e.target.value)}
                        multiline
                    />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            slotProps={{
                                textField: {
                                    color: 'secondary',
                                },
                            }}
                            label="Data e Hora de Início"
                            value={janela1}
                            onChange={(newValue) => setJanela1(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <DateTimePicker
                            slotProps={{
                                textField: {
                                    color: 'secondary',
                                },
                            }}
                            label="Data e Hora de Término"
                            value={janela2}
                            onChange={(newValue) => setJanela2(newValue)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </Box>

                <Stack direction="row" spacing={2}>
                    <Button variant="contained" type="submit" style={{ padding: '10px', width: '15ch', backgroundColor: '#9515FF', color: 'white', border: 'none' }}>Enviar</Button>
                </Stack>
            </form>

            <LoadingIndicator />

            <Snackbar
                open={open}
                autoHideDuration={5000}
                onClose={handleClose}
                severity="success"
                message=
                "Cliente inserido com sucesso! Você será notificado por e-mail quando o ônibus estiver a 10 minutos de distância"
                action={action}

                sx={{
                    '& .MuiSnackbarContent-root': {
                        backgroundColor: '#4CAF50',
                        color: '#fff'
                    }
                }}
            />
        </div>

    );
};