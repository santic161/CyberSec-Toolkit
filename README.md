# CyberSec Toolkit Dashboard 🛡️

<div align="center">

![CyberSec Toolkit Demo](/assets/image.png)<br>
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-4.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![CyberSec Toolkit](https://img.shields.io/badge/CyberSec-Toolkit-blue?style=for-the-badge&logo=shield&logoColor=white)

**Dashboard profesional de herramientas de ciberseguridad con organización inteligente por categorías**

[Características](#características-principales) • [Instalación](#instalación) • [Uso](#uso) • [Estructura](#estructura-del-proyecto) • [Contribuir](#contribuir)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características Principales](#-características-principales)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Instalación](#-instalación)
- [Configuración](#️-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Sincronización Automática](#-sincronización-automática)
- [Variables Dinámicas](#-variables-dinámicas)
- [Personalización](#-personalización)
- [Tecnologías](#️-tecnologías)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## 🎯 Descripción

**CyberSec Toolkit Dashboard** es una aplicación web moderna y profesional diseñada para organizar, buscar y gestionar comandos y herramientas de ciberseguridad. Con una interfaz intuitiva y potentes capacidades de búsqueda, permite a los profesionales de seguridad acceder rápidamente a las herramientas que necesitan.

### ¿Por qué usar este dashboard?

- ✅ **Organización inteligente**: Comandos categorizados automáticamente por secciones (Web Apps, Active Directory, Linux/Windows Privesc, etc.)
- ✅ **Búsqueda avanzada**: Sistema de búsqueda inteligente con sugerencias de tags
- ✅ **Variables dinámicas**: Personaliza comandos con variables que se actualizan en tiempo real
- ✅ **Sincronización automática**: Los datos se actualizan automáticamente desde tu repositorio
- ✅ **Interfaz moderna**: Tema oscuro/claro con diseño responsive
- ✅ **Sin configuración compleja**: Funciona directamente desde GitHub Pages

---

## ✨ Características Principales

### 🎨 Interfaz Intuitiva

- **Vista de Secciones**: Organización visual por categorías principales
- **Vista de Grid/Lista**: Alterna entre visualización compacta y detallada
- **Tema Oscuro/Claro**: Cambia según tu preferencia
- **Diseño Responsive**: Funciona perfectamente en desktop, tablet y móvil

### 🔍 Búsqueda Inteligente

- **Búsqueda Global**: Busca en comandos, descripciones y tags
- **Filtrado por Tags**: Filtra rápidamente por categorías específicas
- **Sugerencias Contextuales**: Sugerencias de tags basadas en la sección actual
- **Ordenamiento Multiple**: Por nombre, categoría, popularidad o sección

### 🔧 Variables Dinámicas

```bash
# Ejemplo de comando con variables
impacket-psexec [DOMAIN_USER]:[PASSWORD]@[IP]

# Se convierte en:
impacket-psexec HTB\administrator:Password123!@10.10.10.100
```

- **Sistema de Variables**: Define valores una vez, úsalos en todos los comandos
- **Tipos de Variables**: IP, Dominio, Usuario, Contraseña, Puerto, URL, etc.
- **Importar/Exportar**: Guarda tus configuraciones y compártelas
- **Autocompletado**: Sugerencias basadas en el tipo de variable

### 📊 Estadísticas y Análisis

- **Contadores en Tiempo Real**: Número de herramientas, categorías y variables
- **Análisis por Sección**: Visualiza la distribución de comandos
- **Tags Populares**: Identifica las categorías más utilizadas
- **Herramientas Destacadas**: Acceso rápido a los comandos más relevantes

---

## 📸 Capturas de Pantalla

### Vista Principal - Dashboard de Secciones

<div align="center">

![Dashboard Overview](/assets/image2.png)

_Vista principal mostrando todas las secciones disponibles con estadísticas_

</div>

### Vista de Sección - Web Applications

<div align="center">

![Web Applications Section](/assets/image3.png)

_Sección de Web Applications con comandos filtrados y organizados_

</div>

### Panel de Variables Dinámicas

<div align="center">

![Variables Panel](/assets/image4.png)

_Panel de configuración de variables con agrupación por categoría_

</div>

### Vista de Tarjeta - Modo Grid

<div align="center">

![Grid View](/assets/image5.png)

_Vista en grid mostrando tarjetas compactas con información clave_

</div>

### Vista de Lista - Modo Detallado

<div align="center">

![List View](/assets/image6.png)

_Vista en lista con detalles completos de cada comando_

</div>

### Búsqueda Inteligente con Tags

<div align="center">

![Smart Search](/assets/image7.png)

_Sistema de búsqueda con sugerencias contextuales de tags_

</div>

### Tema Oscuro vs Claro

<div align="center">

| Tema Oscuro                                                                      | Tema Claro                                                                         |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| ![Dark Theme](/assets/dark.png) | ![Light Theme](/assets/light.png) |

_Comparación entre tema oscuro y claro_

</div>

---

## 🚀 Instalación

### Requisitos Previos

- Node.js 16.x o superior
- npm o yarn
- Git

### Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/cybersec-toolkit-dashboard.git

# Navegar al directorio
cd cybersec-toolkit-dashboard

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Build para Producción

```bash
# Crear build de producción
npm run build

# Preview del build
npm run preview
```

---

## ⚙️ Configuración

### Estructura de Archivos

El proyecto utiliza un archivo CSV como fuente de datos. La estructura esperada es:

```csv
Command,Cmd,Tags,Page
"SQL Injection Basic","sqlmap -u [URL] --batch --dbs","SQL Injection,WebApp,Enumeration","https://docs.example.com/sqlmap"
"Kerberoasting","GetUserSPNs.py [DOMAIN]/[USER]:[PASSWORD] -dc-ip [DCIP]","Active Directory,Kerberoasting,Enumeration",""
```

#### Columnas del CSV:

- **Command**: Nombre descriptivo del comando
- **Cmd**: El comando real con variables en formato `[VARIABLE]`
- **Tags**: Tags separados por comas para categorización
- **Page**: URL de documentación (opcional)

### Configuración de Secciones

Las secciones se configuran en `src/constants.ts`:

```typescript
export const DASHBOARD_SECTIONS: Record<string, DashboardSection> = {
  webApp: {
    key: "webApp",
    displayName: "Web Applications",
    description: "Herramientas y técnicas para auditoría de aplicaciones web",
    icon: "🌐",
    tags: ["WebApp", "SQL Injection", "XSS", "SSRF", ...],
    color: {
      primary: "#3B82F6",
      secondary: "#60A5FA",
      // ... más configuración
    },
    priority: 1,
  },
  // ... más secciones
};
```

### Configuración de Variables

Define variables predeterminadas en `src/constants.ts`:

```typescript
export const VARIABLE_CONFIG: Record<string, VariableConfig> = {
  IP: {
    displayName: "IP Objetivo",
    defaultValue: "10.10.10.100",
    placeholder: "192.168.1.100",
    description: "Dirección IP del sistema objetivo",
    type: "ip",
    category: "network",
  },
  // ... más variables
};
```

---

## 📖 Uso

### Navegación Básica

1. **Vista Principal**: Muestra todas las secciones disponibles con estadísticas
2. **Seleccionar Sección**: Click en cualquier tarjeta de sección para ver sus comandos
3. **Buscar Comandos**: Usa la barra de búsqueda para encontrar comandos específicos
4. **Filtrar por Tags**: Click en tags para filtrar comandos relacionados

### Uso de Variables

1. **Abrir Panel de Variables**: Click en el ícono ⚙️ en el header
2. **Configurar Variables**: Edita los valores según tu entorno
3. **Ver Cambios en Tiempo Real**: Los comandos se actualizan automáticamente
4. **Exportar/Importar**: Guarda configuraciones para reutilizarlas

```json
// Ejemplo de exportación de variables
{
  "IP": "10.10.10.100",
  "DOMAIN": "htb.local",
  "USER": "administrator",
  "PASSWORD": "Password123!"
}
```

### Copiar Comandos

1. **Vista Procesada**: Por defecto, verás comandos con variables reemplazadas
2. **Vista Original**: Click en el botón "Original/Procesado" para alternar
3. **Copiar**: Click en el botón de copiar para copiar al portapapeles
4. **Documentación**: Click en "Docs" para abrir documentación externa

### Ordenamiento y Filtros

```
Opciones de ordenamiento:
- Por Nombre: Alfabético por nombre de comando
- Por Categoría: Agrupado por primera categoría
- Por Popularidad: Más tags = más popular
- Por Sección: Agrupado por sección principal
```

---

## 📁 Estructura del Proyecto

```
cybersec-toolkit-dashboard/
├── public/
│   └── Active-Directory-CheatSheet/
│       └── docs/
│           ├── index.json              # Índice de archivos
│           └── *.csv                   # Archivos CSV de datos
├── src/
│   ├── components/
│   │   ├── CommandCard.tsx            # Tarjeta de comando individual
│   │   ├── SectionCard.tsx            # Tarjeta de sección
│   │   ├── SmartSearchBar.tsx         # Barra de búsqueda inteligente
│   │   └── VariablesPanel.tsx         # Panel de variables
│   ├── constants.ts                   # Configuración centralizada
│   ├── dashboard.tsx                  # Componente principal
│   ├── main.jsx                       # Entry point
│   └── index.css                      # Estilos globales
├── .github/
│   └── workflows/
│       └── sync.yml                   # GitHub Action para sync
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### Componentes Principales

#### `Dashboard.tsx`

Componente principal que maneja:

- Estado global de la aplicación
- Carga y procesamiento de datos CSV
- Filtrado y búsqueda
- Navegación entre secciones

#### `CommandCard.tsx`

Tarjeta de comando con:

- Vista grid/lista
- Procesamiento de variables
- Copiar al portapapeles
- Toggle original/procesado

#### `SectionCard.tsx`

Tarjeta de sección con:

- Estadísticas de la sección
- Categorías principales
- Herramientas destacadas
- Navegación a detalle

#### `VariablesPanel.tsx`

Panel lateral para:

- Configuración de variables
- Agrupación por categoría
- Importar/exportar configuraciones
- Resetear valores

#### `SmartSearchBar.tsx`

Barra de búsqueda con:

- Sugerencias de tags contextuales
- Filtrado en tiempo real
- Historial de búsquedas
- Accesos rápidos

---

## 🔄 Sincronización Automática

### Sync Service

El proyecto incluye un servicio de sincronización automática que mantiene los datos actualizados desde Notion. La carpeta [docs](/docs/) es actualizada automaticamente mediante un servicio de sincronización. Una vez obtenido los datos, el servicio realiza un push a este repositorio, accionando así los GitHub Actions para que se reflejen los cambios en producción

#### Características del Sync:

- ✅ **Sincronización Automática**: Cada 1 hora obtiene los datos de Notion y los pushea a GitHub
- ✅ **Trigger Automatico**: Mediante los GitHub Actions
- ✅ **Actualización de Index**: Genera automáticamente el `index.json`, el cual se encarga de indexar toda la carpeta Docs.
- ✅ **Commits Automáticos**: Commit y push de cambios
- ✅ **Timestamps**: Registra cuándo fue la última actualización

Para mas información, visita el repositorio en [Sync-Service](https://github.com/santic161/Active-Directory-Sync-Service)

---

## 🔧 Variables Dinámicas

### Tipos de Variables

El sistema soporta diferentes tipos de variables con validación:

| Tipo       | Descripción         | Ejemplo                            |
| ---------- | ------------------- | ---------------------------------- |
| `ip`       | Dirección IP        | `10.10.10.100`                     |
| `domain`   | Nombre de dominio   | `htb.local`                        |
| `url`      | URL completa        | `http://target.htb`                |
| `port`     | Puerto              | `445`                              |
| `text`     | Texto libre         | `administrator`                    |
| `password` | Contraseña (oculta) | `Password123!`                     |
| `file`     | Ruta de archivo     | `/usr/share/wordlists/rockyou.txt` |

### Categorías de Variables

Las variables se organizan en categorías para mejor gestión:

- **🌐 Network**: IP, DOMAIN, TARGET, PORT, DCIP, URL
- **🔐 Auth**: USER, PASSWORD, DOMAIN_USER, HASH, TICKET
- **📁 File**: WORDLIST, SHARE, PAYLOAD
- **⚔️ Exploit**: SPN, COMPUTER, FOREST
- **🌍 Web**: PARAM, COOKIE, USER_AGENT

### Uso en Comandos

```bash
# Variables en formato [NOMBRE_VARIABLE]
impacket-psexec [DOMAIN_USER]:[PASSWORD]@[IP]

# Se procesa a:
impacket-psexec HTB\administrator:Password123!@10.10.10.100
```

### Exportar/Importar Variables

#### Exportar:

```json
{
  "version": "1.0",
  "timestamp": "2025-01-15T10:30:00Z",
  "variables": {
    "IP": "10.10.10.100",
    "DOMAIN": "htb.local",
    "USER": "administrator"
  }
}
```

#### Importar:

1. Click en "Importar Variables"
2. Pega el JSON o selecciona archivo
3. Confirma la importación

---

## 🎨 Personalización

### Colores de Secciones

Personaliza los colores en `src/constants.ts`:

```typescript
color: {
  primary: "#3B82F6",      // Color principal
  secondary: "#60A5FA",    // Color secundario
  accent: "#1D4ED8",       // Color de acento
  background: {
    light: "bg-blue-50",   // Fondo en tema claro
    dark: "bg-blue-950",   // Fondo en tema oscuro
  },
  text: {
    light: "text-blue-900", // Texto en tema claro
    dark: "text-blue-100",  // Texto en tema oscuro
  },
}
```

### Agregar Nueva Sección

```typescript
// En src/constants.ts
nuevoSection: {
  key: "nuevoSection",
  displayName: "Nueva Sección",
  description: "Descripción de la nueva sección",
  icon: "🎯",
  tags: ["Tag1", "Tag2", "Tag3"],
  color: {
    primary: "#FF6B6B",
    // ... configuración de color
  },
  priority: 6, // Orden de aparición
}
```

### Personalizar Textos

Todos los textos están centralizados en `UI_TEXTS`:

```typescript
export const UI_TEXTS = {
  appTitle: "Tu Título Personalizado",
  appSubtitle: "Tu subtítulo personalizado",
  // ... más textos
};
```

---

## 🛠️ Tecnologías

### Frontend

- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de CSS utility-first

### Bibliotecas

- **Lucide React** - Íconos SVG
- **PapaParse** - Parser de CSV
- **React Suspense** - Lazy loading de componentes

### Herramientas de Desarrollo

- **ESLint** - Linter de código
- **Prettier** - Formateador de código
- **TypeScript ESLint** - Reglas de TypeScript

### CI/CD

- **GitHub Actions** - Automatización y sync
- **GitHub Pages** - Hosting estático

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Aquí está cómo puedes ayudar:

### Reportar Bugs

1. Verifica que el bug no esté ya reportado
2. Crea un issue con:
   - Descripción clara del problema
   - Pasos para reproducirlo
   - Comportamiento esperado vs actual
   - Screenshots si es posible
   - Información del sistema

### Sugerir Features

1. Crea un issue con etiqueta "enhancement"
2. Describe el feature detalladamente
3. Explica por qué sería útil
4. Proporciona ejemplos de uso

### Pull Requests

```bash
# 1. Fork el repositorio
# 2. Crea una rama para tu feature
git checkout -b feature/mi-nuevo-feature

# 3. Haz commits descriptivos
git commit -m "feat: agregar búsqueda por regex"

# 4. Push a tu fork
git push origin feature/mi-nuevo-feature

# 5. Crea un Pull Request desde GitHub
```

---

## 📝 Roadmap

### v1.0 (Actual)

- ✅ Dashboard con secciones
- ✅ Búsqueda inteligente
- ✅ Sistema de variables
- ✅ Sincronización automática
- ✅ Tema oscuro/claro

### v1.1 (Próximo)

- 🔄 Favoritos y comandos recientes
- 🔄 Historial de comandos ejecutados
- 🔄 Exportar colección de comandos
- 🔄 Compartir configuraciones de variables
- 🔄 Almacenar configuración del usuario en LocalStorage.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- **Tailwind CSS** - Framework de estilos
- **Lucide** - Íconos hermosos y consistentes
- **Vite** - Build tool increíblemente rápido
- **Comunidad de Ciberseguridad** - Por el feedback y contribuciones

---


### FAQ

<details>
<summary><strong>¿Cómo agrego mis propios comandos?</strong></summary>

Edita el archivo CSV en `/docs/` siguiendo el formato:

```csv
Command,Cmd,Tags,Page
"Nombre","comando [VAR]","Tag1,Tag2",""
```

</details>

<details>
<summary><strong>¿Puedo usar esto sin conexión?</strong></summary>

Sí, después de la primera carga, la aplicación cachea los datos localmente y puede funcionar offline.

</details>

<details>
<summary><strong>¿Cómo sincronizo con mi propio repositorio?</strong></summary>

Configura el workflow de GitHub Actions cambiando la URL en `.github/workflows/sync.yml` para apuntar a tu repositorio. Además, deberás configurar el Sync Service.

</details>

<details>
<summary><strong>¿Puedo personalizar los colores y temas?</strong></summary>

¡Por supuesto! Todos los colores y temas están definidos en `src/constants.ts` y pueden ser personalizados.

</details>

---

## 🌟 Showcase

¿Estás usando CyberSec Toolkit Dashboard? ¡Nos encantaría saberlo!

Comparte tu implementación:

- Tweet con #CyberSecToolkit
- Crea un issue con etiqueta "showcase"

---

<div align="center">

**⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub ⭐**

![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge)
![Open Source](https://img.shields.io/badge/Open-Source-green?style=for-the-badge)
![Security](https://img.shields.io/badge/CyberSec-Toolkit-blue?style=for-the-badge)

</div>

---

<div align="center">
  <sub>Built with ❤️ by S4nt1c</sub>
</div>
