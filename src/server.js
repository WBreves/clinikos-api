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

app.get('/', (req, res) => {
  res.json({ status: 'API ClinikOS Online v2.0' });
});

// Cadastro Completo de Paciente
app.post('/api/patients', (req, res) => {
  const { tenant_id, name, cpf, birth_date, gender, mother_name, phone, email, address, health_insurance } = req.body;

  if (!name || !cpf || !tenant_id || !birth_date || !phone) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes: Nome, CPF, Data de Nascimento e Telefone.' });
  }

  if (!isValidCPF(cpf)) {
    return res.status(400).json({ error: 'CPF inválido! Verifique os dígitos informados.' });
  }

  // Sucesso na recepção e estruturação dos dados
  return res.status(201).json({
    message: 'Paciente cadastrado com sucesso no ClinikOS!',
    patient: {
      tenant_id,
      name,
      cpf,
      birth_date,
      gender,
      mother_name,
      phone,
      email,
      address,
      health_insurance
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ClinikOS v2.0 rodando na porta ${PORT}`);
});
