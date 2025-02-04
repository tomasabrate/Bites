export function generarCodigoDeRetiro(length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Test the function
// console.log("Generated pickup code:", generarCodigoDeRetiro());
// console.log("Generated pickup code (8 characters):", generarCodigoDeRetiro(8));