# Deploy paso a paso

---

## PARTE A: Subir el backend a Render

### Paso 1
Abrí en el navegador: **https://render.com**  
Iniciá sesión con tu cuenta de **GitHub** si te lo pide.

### Paso 2
Click en el botón **"New +"** (arriba) y elegí **"Web Service"**.

### Paso 3
Si te pide conectar un repo de GitHub, conectá **JuanMBasile/LaunchFast-AI-SaaS**.  
Elegí ese repositorio de la lista.

### Paso 4
Completá estos campos exactamente:

| Campo | Qué poner |
|-------|-----------|
| **Name** | `launchfast-ai-backend` |
| **Region** | el que venga por defecto (ej. Oregon) |
| **Root Directory** | `backend` |
| **Runtime** | Node |
| **Build Command** | `npm install --include=dev && npm run build` |
| **Start Command** | `npm run start:prod` |
| **Plan** | Free |

### Paso 5 — Las variables de entorno
Más abajo en la misma página hay una sección **"Environment"** o **"Environment Variables"**.

1. Abrí en tu PC el archivo **`env.render.txt`** (está en la carpeta raíz del proyecto **LaunchFast AI**).
2. En Render, click en **"Add Environment Variable"** (o **"Add variable"**).
3. Para **cada línea** de `env.render.txt` que **no** empiece con `#`:
   - **Key** = lo que está **antes** del primer `=`
   - **Value** = todo lo que está **después** del `=`

   **Ejemplo:** si en el archivo ves  
   `GROQ_MODEL=llama-3.3-70b-versatile`  
   entonces en Render ponés:
   - Key: `GROQ_MODEL`
   - Value: `llama-3.3-70b-versatile`

   Repetí eso para todas las líneas (NODE_ENV, PORT, AI_PROVIDER, GROQ_API_KEY, etc.). Las que empiezan con `#` las saltás.

### Paso 6
Click en **"Create Web Service"** (o **"Deploy"**).  
Render va a construir y levantar el backend. Esperá a que termine (puede tardar unos minutos).

### Paso 7
Cuando termine, arriba de todo te va a mostrar una URL, algo como:  
`https://launchfast-ai-backend.onrender.com`  
**Copiá esa URL** y guardala; la vas a usar en la Parte B.

---

## PARTE B: Subir el frontend a Vercel

### Paso 8
Abrí **https://vercel.com** e iniciá sesión con **GitHub**.

### Paso 9
Click en **"Add New..."** → **"Project"**.  
Elegí el repo **JuanMBasile/LaunchFast-AI-SaaS** e importalo.

### Paso 10
Antes de darle a Deploy, configurá:
- **Root Directory:** click en "Edit" y poné `frontend`.
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### Paso 11 — Variables de entorno del frontend
En la misma pantalla, buscá **"Environment Variables"** y agregá estas **4** variables (Key y Value):

| Key | Value |
|-----|--------|
| `VITE_API_URL` | La URL que copiaste en el Paso 7 (ej. `https://launchfast-ai-backend.onrender.com`) |
| `VITE_SUPABASE_URL` | `https://udnxwynvkmkwvofuwgnv.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | La que tenés en tu archivo `.env` (empieza con `eyJ...`) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | La que tenés en tu `.env` (empieza con `pk_test_...`) |

### Paso 12
Click en **"Deploy"**. Esperá a que termine.

### Paso 13
Cuando termine, Vercel te da una URL del frontend, algo como:  
`https://launchfast-ai-saas.vercel.app`  
**Copiá esa URL.**

### Paso 14
Volvé a **Render** → entrá a tu servicio **launchfast-ai-backend** → pestaña **"Environment"**.  
Buscá la variable **`FRONTEND_URL`**, editarla y reemplazá el valor por la URL de Vercel (la del Paso 13). Guardá.

---

Listo. Tu app queda así:
- **Frontend:** la URL de Vercel (donde entran los usuarios).
- **Backend:** la URL de Render (la API).

En el plan gratis de Render, si no hay visitas un rato, el backend “duerme”; la primera visita puede tardar unos segundos en responder.
