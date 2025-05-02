export function parseValueToBrl(value) {
  // Verifica se o valor é numérico ou pode ser convertido
  const parsedValue = Number(value);
  if (isNaN(parsedValue)) {
    console.error('Valor inválido fornecido para formatação monetária');
    return '0,00';
  }

  // Formata o valor para o padrão brasileiro
  return parsedValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
