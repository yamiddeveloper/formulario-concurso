// Normaliza un telefono a solo digitos para poder comparar "300 111-2222"
// y "3001112222" como el mismo numero, sin importar el formato con el que
// cada quien lo haya escrito.
function normalizarTelefono(valor) {
  return (valor || '').replace(/\D/g, '');
}

module.exports = { normalizarTelefono };
