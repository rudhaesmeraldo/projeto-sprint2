# Projeto 2 — API Node.js com AWS

## Sumário

1. [Introdução](#introdução)  
2. [Link da aplicação](#link-da-aplicação)  
3. [Desenvolvimento do projeto](#desenvolvimento-do-projeto)  
4. [Dificuldades Conhecidas](#dificuldades-conhecidas)  
5. [Como Utilizar o Sistema](#como-utilizar-o-sistema)  
6. [Autores](#autores)  
7. [Estrutura de Pastas](#estrutura-de-pastas)  

---

## Introdução

Este projeto é uma API Node.js que integra serviços da AWS para leitura, tradução e armazenamento de feeds RSS. A aplicação extrai informações de três feeds RSS oficiais do site da NASA, traduz o conteúdo para o português utilizando o Amazon Translate e salva os dados em arquivos JSON, que podem ser enviados ao Amazon S3.

Os feeds utilizados foram:
- [https://www.nasa.gov/aeronautics/feed/](https://www.nasa.gov/aeronautics/feed/)
- [https://www.nasa.gov/feeds/iotd-feed/](https://www.nasa.gov/feeds/iotd-feed/)
- [https://www.nasa.gov/missions/station/feed/](https://www.nasa.gov/missions/station/feed/)

O objetivo da avaliação foi desenvolver uma aplicação funcional que demonstra conhecimentos em AWS, Node.js, Docker e manipulação de APIs externas, com foco em integração, deploy e automação de processos.

---

## Link da aplicação

---

## Desenvolvimento do projeto

A aplicação foi construída utilizando:  
- **Node.js**
- **Express**
- **Docker**
- **AWS S3**
- **AWS EC2**
- **AWS Translate**
- **HTML**
- **CSS**
- **JavaScript**
- **RSS Parser** (npm)
- **AWS SDK** (npm)
- **dotenv** (npm)
- **Git**

Durante o desenvolvimento, seguimos uma abordagem modular para manter o código organizado e reutilizável.

---

## Dificuldades Conhecidas

Neste projeto, nossa equipe enfrentou desafios importantes na configuração das credenciais temporárias da AWS para o upload no S3, assegurando a atribuição correta das permissões para manter a segurança e o funcionamento adequado do sistema. Também foi necessário solucionar questões relacionadas às permissões dos arquivos SSH, essenciais para o acesso à instância EC2 via SSH, exigindo ajustes precisos nas configurações. A implementação e o uso do Docker na instância EC2 demandaram um entendimento aprofundado das particularidades do ambiente AWS para garantir o correto funcionamento dos containers. Além disso, estruturamos o controle de versões e organizamos o projeto para viabilizar um fluxo eficiente de deploy contínuo. A assimilação e integração dessas tecnologias em um curto espaço de tempo representaram desafios técnicos relevantes, superados através de trabalho colaborativo e dedicação.

---

## Como Utilizar o Sistema

---

## Autores

-   [Agnes Ludmilla](https://github.com/agnesludmila)
-   [Rafaela Bezerra](https://github.com/Rafa01B)
-   [Rudhá Esmeraldo](https://github.com/rudhaesmeraldo)
-   [Yuri Kiev](https://github.com/YuriKievBarreto)
 ---

## Estrutura de pastas

squad-6/
│
├── app.js                 # Arquivo principal da API
├── package.json           # Dependências e scripts npm
├── Dockerfile             # Configuração para criação da imagem Docker
├── docker-compose.yml     # Orquestração dos containers 
├── .env                   # Variáveis de ambiente (não versionado)
├── README.md              # Documentação do projeto
├── uploadS3.js            # Script para upload ao S3
├── controllers/           # Controladores da API
│   └── rssController.js
├── routes/                # Definição das rotas Express
│   └── rssRoute.js
├── services/              # Serviços auxiliares (AWS, tradução)
│   ├── s3Service.js
│   └── awsTranslate.js
├── public/                # Arquivos públicos (front-end estático)
│   ├── index.html
│   ├── script.js
│   └── style.css
└── data/                  # Dados estáticos (JSON de feeds RSS)
    ├── nasa.gov_aeronautics_feed_.json
    ├── nasa.gov_feeds_iotd-feed_.json
    └── nasa.gov_missions_station_feed_.json

---
