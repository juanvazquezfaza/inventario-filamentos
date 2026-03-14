# Inventario de Filamentos - GitHub + Netlify

Este proyecto está preparado para que lo subas a GitHub y lo enlaces a Netlify sin programar.

## Qué archivos tocarás normalmente

- `data/config.json` → nombres de AMS, estanterías, marcas, materiales, colores, estados.
- `data/inventario.json` → inventario base.
- `app.js` → funciones nuevas.
- `styles.css` → apariencia.
- `drawings/*.svg` → dibujos.

## PASO 1 - Crear repo en GitHub

1. Entra en GitHub.
2. Pulsa **New repository**.
3. Pon el nombre: `inventario-filamentos`.
4. Pulsa **Create repository**.
5. Dentro del repo pulsa **Add file** → **Upload files**.
6. Arrastra TODO el contenido de esta carpeta.
7. Pulsa abajo **Commit changes**.

## PASO 2 - Enlazar con Netlify

1. Entra en Netlify.
2. Pulsa **Add new project**.
3. Elige **Import an existing project**.
4. Elige **GitHub**.
5. Autoriza GitHub.
6. Selecciona el repo `inventario-filamentos`.
7. Como esto es una web estática, Netlify normalmente la publicará directamente.
8. Si te pide valores:
   - Build command: dejar vacío
   - Publish directory: `/`
9. Pulsa **Deploy site**.

## PASO 3 - Instalar en iPhone o iPad

1. Abre la URL en Safari.
2. Pulsa **Compartir**.
3. Pulsa **Añadir a pantalla de inicio**.

## Cómo trabajar conmigo después

Cuando quieras una mejora, yo te diré algo como:

- `Cambia data/config.json`
- `Sustituye app.js`
- `Sustituye styles.css`
- `Cambia drawings/ams-2pro.svg`

Tú solo tendrás que:

1. Entrar al repo en GitHub.
2. Abrir el archivo.
3. Reemplazar contenido o subir archivo nuevo.
4. Pulsar **Commit changes**.
5. Esperar unos segundos a que Netlify publique la nueva versión automáticamente.

## Cómo volver al inventario base

En la app hay un botón: **Recargar base**.
Eso vuelve al contenido de `data/inventario.json`.

## Si Netlify no actualiza

1. Mira en Netlify la pestaña **Deploys**.
2. Si no salió nueva publicación, revisa que guardaste en GitHub con **Commit changes**.
3. Si sigue sin salir, en Netlify pulsa **Trigger deploy**.

## Consejo

Para cambios de estructura o nombres, casi siempre bastará con `data/config.json`.
Para tus bobinas iniciales, `data/inventario.json`.


Actualización v3: rediseño visual con AMS y estanterías coloreadas por listado.
