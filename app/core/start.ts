
// command description used in the "/start" command
const commands = {
  'start': 'Da la bienvenida y muestra los comandos',
  'tinkuy': 'Te pedirá tu ubicación (COMPÁRTELA EN VIVO) y te dirá dónde está el grupo de personas usando Tinkuy más cercano a ti. Unidos somos más fuertes 🙌🏼!',
  'poli': 'Si te encuentras con un bloqueo o ataque policial. Repórtalo con este comando 👮',
  'detencion': 'Me detuvieron! Avisaremos al equipo legal para que se dirijan a tu ubicación ⛓️',
  'sos': ' Ayuda! Avisaremos al equipo médico para que se dirija donde te encuentres 🚨',
  'info': ' Información legal ⚖️ y médica 🚑, tips para identificar a un terna 👀'
}

export function handleStart() {
  let text = `Hola! Soy TinkuyBot 🤖. Estoy aquí para ayudarte en la protesta 💪. Para comenzar, comparte tu ubicación en vivo! ESTO ES 100% ANÓNIMO. Escribe /start cuando quieras ver los comandos\n\n`
  for (let c in commands) {
    text += "/" + c + ": "
    text += commands[c] + "\n\n"
  }
  return text
}
