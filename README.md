# 📊 Portal do Produtor | Grupo FedCorp

Um sistema completo de gestão de comissionamento e performance para produtores, oferecendo dashboards dinâmicos, exportação de relatórios (PDF/Excel), perfil individual, e área administrativa para gestão centralizada via usuário master.

---

## 🧩 Visão Geral

O **Portal do Produtor** é uma plataforma web full stack que tem como objetivo otimizar a visualização, acompanhamento e extração de dados financeiros e operacionais por parte dos produtores de seguros. 

A aplicação está dividida em dois ambientes principais:

- **Produtor**: acesso individualizado com visão personalizada de comissões, relatórios, perfil e métricas.
- **Master/Admin**: painel administrativo para importação de planilhas, gestão de usuários, geração de relatórios e supervisão da operação.

---

## 🎯 Funcionalidades Principais

- 🔐 **Login e autenticação por usuário**
- 📁 **Importação de planilhas (XLSX)**
- 🧾 **Geração e exportação de relatórios em PDF e Excel**
- 📊 **Dashboards interativos com KPIs, gráficos e filtros**
- 🧑‍💼 **Página de perfil com dados do produtor e edição de credenciais**
- 🔎 **Sistema de busca e filtro nos relatórios**
- 🗂️ **Painel do usuário master com gerenciamento total**
- ♻️ **Reutilização de componentes e design system único entre áreas**

---

## 🧱 Estrutura de Diretórios


fedcorp-portal/
│
├── frontend/
│ ├── master/ # Painel administrativo
│ ├── produtor/ # Portal do produtor
│ ├── components/ # Componentes reutilizáveis
│ ├── assets/ # Imagens, logos, ícones
│ └── styles/ # CSS modular por página
│
└── backend/
├── controllers/ # Lógica de negócio e serviços
├── routes/ # Rotas da API
├── models/ # Modelagem dos dados
└── config/ # Integrações e middlewares


---

## 🛠️ Tecnologias Utilizadas

### 🖥️ Front-end

- **React.js** com Vite
- **React Router DOM** – Navegação entre páginas
- **Tailwind CSS** – Estilização moderna e responsiva
- **Recharts** – Gráficos e visualizações
- **FileSaver.js / XLSX** – Exportação de arquivos Excel
- **React Icons** – Ícones profissionais
- **html2pdf.js** – Geração de PDFs a partir de templates HTML

### 🔧 Back-end

- **Node.js**
- **Express.js** – Framework para APIs RESTful
- **JavaScript (ES6+)**
- **Firebase** – Banco de dados (Firestore) e autenticação
- **Multer** – Upload e processamento de arquivos
- **XLSX / ExcelJS** – Leitura e manipulação de planilhas
- **Dotenv** – Variáveis de ambiente

---

## 🔐 Autenticação

A autenticação é realizada via **Firebase Authentication**, garantindo segurança e escalabilidade. Há dois níveis de acesso:

- **Produtor** – acesso limitado aos próprios dados
- **Master** – acesso total à administração do sistema

---

## 📦 Instalação

### Pré-requisitos

- Node.js >= 18.x
- Firebase project configurado
- Conta no GitHub

### Clone o projeto
git@github.com:Ingryd-Aylana/comissao-portal-front.git

Instale as dependências
cd backend
npm install

cd ../frontend
npm install

📂 Dados e Modelagem: O Firebase Firestore armazena os seguintes dados:

Usuários:
- Nome
- CPF
- E-mail

Permissão (produtor | master):
- Credenciais de acesso
- Relatórios
- Nome do arquivo
- Data de geração
- Comissões
- Link de exportação
- Dashboard
- KPIs de comissão por mês
- Comparativos

🧪 Testes
- Validação de CPF
- Autenticação de usuários
- Importação de planilhas simuladas
- Exportação de relatórios
- Controle de acesso entre áreas

🚀 Futuras Implementações
- Sistema de notificações push
- Histórico de alterações por produtor
- Logs de auditoria para o master
- Dark/Light Mode global

🧑‍💻 Desenvolvido por:

Ingryd Aylana
Desenvolvedora Front-End | 
Linkedin: www.linkedin.com/in/ingryd-aylana-silva-dos-santos-4a2701158

Michel Policeno 
Desenvolvedor Back-end |
Linkedin: https://www.linkedin.com/in/michel-policeno-85a866212 | 
GitHub: https://github.com/Michel-Policeno
