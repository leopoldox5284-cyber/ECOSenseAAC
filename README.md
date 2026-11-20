# Pixel Vault

Arcade retro personal para cargar y jugar ROMs propias en el navegador. Los archivos y los estados de guardado se almacenan localmente en IndexedDB y localStorage; no se envían a un servidor.

## Uso local

1. Instala las dependencias del proyecto con tu gestor de paquetes habitual.
2. Inicia el servidor de desarrollo con `npm run dev` y abre la URL local que muestra Vite.
3. Pulsa **Añadir juego** o arrastra una ROM compatible a la ventana. Revisa la consola detectada y confirma la importación.
4. Pulsa **Jugar**. EmulatorJS se carga desde su CDN y el emulador necesita conexión a Internet para descargar sus archivos públicos de ejecución. La ROM sigue siendo local.
5. Para guardar una partida, elige una ranura y pulsa **Guardar estado**. Los estados dependen de la compatibilidad del core de EmulatorJS.

## Formatos y consolas

NES (.nes), SNES (.sfc, .smc), Game Boy (.gb), Game Boy Color (.gbc), GBA (.gba), Nintendo 64 (.z64, .n64), Master System (.sms), Mega Drive (.md, .gen), Game Gear (.gg), y PlayStation (.cue, .iso, .pbp, .chd). Para PS1 puede ser necesario un BIOS compatible proporcionado por el usuario. Los archivos ZIP se aceptan como archivo, pero la identificación de consola debe elegirse manualmente y el formato comprimido depende de las capacidades del core.

## Despliegue

Construye el proyecto con `npm run build` y publica la carpeta `dist` en Netlify, Vercel o Cloudflare Pages. Configura el comando de build `npm run build` y `dist` como directorio de salida; para rutas de SPA, conserva el fallback de Vite/React Router.

El MVP no activa SharedArrayBuffer ni cores con hilos, por lo que COOP/COEP no son necesarios para el funcionamiento actual. Si posteriormente se habilitan cores WASM con threads, el hosting debe enviar `Cross-Origin-Opener-Policy: same-origin` y `Cross-Origin-Embedder-Policy: require-corp` (y permitir los recursos cruzados del CDN); esto puede restringir recursos externos y debe probarse en el despliegue elegido.

## Mejoras futuras

- Metadatos y carátulas editables, filtros y favoritos persistidos.
- Controles de teclado configurables, controles táctiles y ajustes gráficos.
- Soporte ampliado de SRAM, BIOS de PS1 configurables y validación detallada de cores.
- Historial de juego, logros y sincronización opcional de partidas con consentimiento.
- Multijugador local y netplay cuando sea compatible.

## Aviso legal

Esta aplicación no incluye ni distribuye ROMs ni BIOS. Debes usar únicamente copias de juegos que poseas legalmente.
