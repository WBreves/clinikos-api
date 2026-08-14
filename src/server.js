const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Função para validar CPF (Algoritmo Oficial)
function isValidCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;
  return true;
}

// Rota Raiz (Healthcheck)
app.get('/', (req, res) => {
  res.json({ status: 'API ClinikOS Online' });
});

// Rota de Cadastro de Pacientes
app.post('/api/patients', (req, res) => {
  const { name, cpf, phone, tenant_id } = req.body;

  if (!name || !cpf || !tenant_id) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
  }

  // Validação algorítmica do CPF
  if (!isValidCPF(cpf)) {
    return res.status(400).json({ error: 'CPF inválido! Verifique os dígitos informados.' });
  }

  // Sucesso na validação
  return res.status(201).json({
    message: 'Paciente validado e cadastrado com sucesso!',
    patient: { name, cpf, phone, tenant_id }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
