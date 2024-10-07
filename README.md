# WebApp de Mobilidade do Rio de Janeiro - Desafio MARAVI

Baseado nos requisitos solicitados no Desafio Técnico

## Instruções de instalação

Necessário a instalação do Node.js no link abaixo:

https://nodejs.org/pt

## Bibliotecas

`react` 

`react-dom`

`leaflet`

`@mui/material`

`@emotion/react` 

`@emotion/styled`

`@mui/lab`

`axios`

`@mui/x-date-pickers`

`@mui/icons-material`

`dayjs`

# Arquivos importantes

`App.js`: Arquivo inicial do frontend. Nele está setado a interface das tabs no topo da página (Cadastro e Consulta) e os ajustes de marcadores do mapa do Leaflet

`TelaCadastro.js`: Arquivo que formaliza o cadastro de notificação de dados de ônibus.

`TelaConsulta.js`: Arquivo que consulta localização de ônibus em relação à um ponto de ônibus em tempo real e mostra no mapa, com ID de cada carro, velocidade e tempo para chegada ao ponto indicado.

`context.js`: Arquivo de Contexto Global. Fornece um conjunto de estados e funções para serem acessados em diversos componentes da aplicação sem a necessidade de passar propriedades manualmente de um componente para outro.

## Iniciar a aplicação

Para iniciar aplicação, utilize o comando de `npm start`.