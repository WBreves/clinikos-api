function validarCPF(cpf) {
    if (!cpf) return false;
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

const validarPacienteMiddleware = (req, res, next) => {
    const { cpf, telefone_whatsapp } = req.body;

    if (cpf && !validarCPF(cpf)) {
        return res.status(400).json({ 
            erro: 'CPF Inválido', 
            mensagem: 'O CPF digitado não possui um dígito verificador válido.' 
        });
    }

    const telLimpo = telefone_whatsapp ? telefone_whatsapp.replace(/[^\d]+/g, '') : '';
    if (telefone_whatsapp && (telLimpo.length < 10 || telLimpo.length > 11)) {
        return res.status(400).json({ 
            erro: 'Telefone Inválido', 
            mensagem: 'O número de telefone deve conter o DDD e ter 10 ou 11 dígitos.' 
        });
    }

    next();
};

module.exports = { validarCPF, validarPacienteMiddleware };
