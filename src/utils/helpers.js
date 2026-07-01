export function getGreeting() {
  const h = new Date().getHours();
  if (h < 10) return 'Pagi';
  if (h < 15) return 'Siang';
  if (h < 19) return 'Sore';
  return 'Malam';
}

export function getWhatsAppMessage() {
  const greeting = getGreeting();
  return `Halo, Selamat ${greeting} Smartneosoft. Saya mau mendiskusikan tentang projek saya kepada anda`;
}
