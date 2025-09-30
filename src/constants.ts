// ========================================================================================
// CONSTANTS.TS - CONFIGURACIÓN CENTRALIZADA DEL DASHBOARD DE CIBERSEGURIDAD
// ========================================================================================
// Este archivo contiene toda la configuración del sistema de manera centralizada
// para facilitar el mantenimiento y las actualizaciones futuras.

// ========================================================================================
// CONFIGURACIÓN DE API Y CACHÉ
// ========================================================================================
export const API_CONFIG = {
  method: "GET" as const,
  cache: "no-cache" as RequestCache,
  headers: {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
  },
};

export const CACHE_CONFIG = {
  cacheKeyPrefix: "cybersec_dashboard_",
  refreshInterval: 0, // Deshabilitado para permitir actualizaciones inmediatas
  forceRefreshOnLoad: true, // Siempre refrescar al cargar
};

// ========================================================================================
// RUTAS Y CONFIGURACIÓN DE ARCHIVOS
// ========================================================================================
export const FILE_PATHS = {
  indexJson: "/Active-Directory-CheatSheet/docs/index.json",
  docsPath: "/Active-Directory-CheatSheet/docs",
  baseUrl: "/Active-Directory-CheatSheet",
  csvFallback: "Tools-CMD-Database-000182061997de40.csv",
} as const;

// ========================================================================================
// CONFIGURACIÓN DE SECCIONES PRINCIPALES
// ========================================================================================
export interface DashboardSection {
  key: string;
  displayName: string;
  description: string;
  icon: string;
  tags: string[];
  color: {
    primary: string;
    secondary: string;
    accent: string;
    background: {
      light: string;
      dark: string;
    };
    text: {
      light: string;
      dark: string;
    };
  };
  priority: number;
}

export const DASHBOARD_SECTIONS: Record<string, DashboardSection> = {
  webApp: {
    key: "webApp",
    displayName: "Web Applications",
    description: "Herramientas y técnicas para auditoría de aplicaciones web",
    icon: "🌐",
    tags: [
      "WebApp",
      "Web Application",
      "SQL Injection",
      "XSS",
      "SSRF",
      "JWT",
      "GraphQL",
      "Command Injection",
      "LFI",
      "RFI",
      "XXE",
      "CORS",
      "CRLF",
      "SSTI",
      "File Upload",
      "Template Injection",
      "Prototype Pollution",
      "Nuclei",
      "Fuzzing",
      "Enumeration",
      "SQLMap",
      "NoSQLMap",
      "Burp Suite",
      "Parameter Discovery",
      "Directory Fuzzing",
      "Subdomain Enumeration",
      "Virtual Host Discovery",
    ],
    color: {
      primary: "#3B82F6", // blue-500
      secondary: "#60A5FA", // blue-400
      accent: "#1D4ED8", // blue-700
      background: {
        light: "bg-blue-50",
        dark: "bg-blue-950",
      },
      text: {
        light: "text-blue-900",
        dark: "text-blue-100",
      },
    },
    priority: 1,
  },
  activeDirectory: {
    key: "activeDirectory",
    displayName: "Active Directory",
    description: "Herramientas y técnicas para auditoría de Active Directory",
    icon: "🏢",
    tags: [
      "Active Directory",
      "Enumeration",
      "Kerberoasting",
      "ASREPRoasting",
      "Golden Ticket",
      "Silver Ticket",
      "Pass-the-Hash",
      "Password Spraying",
      "DCSync",
      "NTLM",
      "SMB",
      "Domain",
      "Domain Controller",
      "DC",
      "LDAP",
      "Kerberos",
      "BloodHound",
      "Impacket",
      "Kerbrute",
      "GetNPUsers",
      "GetUserSPNs",
      "Crackmapexec",
      "Rubeus",
      "Mimikatz",
      "SMBClient",
      "SMBMap",
      "Evil-WinRM",
      "Netexec",
      "Enum4Linux",
      "Responder",
    ],
    color: {
      primary: "#10B981", // emerald-500
      secondary: "#34D399", // emerald-400
      accent: "#047857", // emerald-700
      background: {
        light: "bg-emerald-50",
        dark: "bg-emerald-950",
      },
      text: {
        light: "text-emerald-900",
        dark: "text-emerald-100",
      },
    },
    priority: 2,
  },
  linuxPrivesc: {
    key: "linuxPrivesc",
    displayName: "Linux Privilege Escalation",
    description:
      "Técnicas y herramientas para escalada de privilegios en Linux",
    icon: "🐧",
    tags: [
      "Linux",
      "Linux Privesc",
      "Privilege Escalation",
      "LinPEAS",
      "LinEnum",
      "pspy",
      "GTFOBins",
      "SUID",
      "Capabilities",
      "Cron Jobs",
      "Systemd",
      "Docker",
      "Kernel Exploit",
      "Path Hijacking",
      "Library Hijacking",
      "Environment Variables",
      "Sudo",
      "SSH",
      "Processes",
      "Sudo Rights",
      "Cron",
      "SUID Files",
      "Services",
      "Kernel",
      "Containers",
      "Mounted Filesystems",
      "Network Services",
      "Reverse Shell",
      "Bind Shell",
      "Python",
      "Bash",
      "Perl",
    ],
    color: {
      primary: "#65A30D", // lime-600
      secondary: "#84CC16", // lime-500
      accent: "#4D7C0F", // lime-700
      background: {
        light: "bg-lime-50",
        dark: "bg-lime-900",
      },
      text: {
        light: "text-lime-900",
        dark: "text-lime-100",
      },
    },
    priority: 3,
  },
  windowsPrivesc: {
    key: "windowsPrivesc",
    displayName: "Windows Privilege Escalation",
    description:
      "Técnicas y herramientas para escalada de privilegios en Windows",
    icon: "🪟",
    tags: [
      "Windows",
      "Windows Privesc",
      "Privilege Escalation",
      "WinPEAS",
      "PowerUp",
      "PrivescCheck",
      "Service Permissions",
      "Unquoted Service Path",
      "DLL Hijacking",
      "Registry",
      "Scheduled Tasks",
      "AlwaysInstallElevated",
      "UAC Bypass",
      "Token Manipulation",
      "Credential Dumping",
      "LSASS",
      "SAM",
      "PowerShell",
      "WMI",
      "WMIC",
      "PsExec",
      "Services",
      "SeImpersonate",
      "PrintSpoofer",
      "Potato Attacks",
      "AutoRuns",
      "AccessChk",
      "PowerView",
      "SharpUp",
      "Startup Folders",
      "Stored Credentials",
    ],
    color: {
      primary: "#9333EA", // purple-600
      secondary: "#A855F7", // purple-500
      accent: "#7E22CE", // purple-700
      background: {
        light: "bg-purple-50",
        dark: "bg-purple-950",
      },
      text: {
        light: "text-purple-900",
        dark: "text-purple-100",
      },
    },
    priority: 4,
  },
  fileTransfer: {
    key: "fileTransfer",
    displayName: "Transferencia de Archivos",
    description:
      "Métodos y herramientas para transferencia de archivos entre sistemas",
    icon: "📁",
    tags: [
      "File Transfer",
      "Upload",
      "Download",
      "SCP",
      "FTP",
      "SFTP",
      "SMB",
      "HTTP",
      "HTTPS",
      "Netcat",
      "Curl",
      "Wget",
      "PowerShell",
      "Base64",
      "Python Server",
      "Impacket SMBServer",
      "Certutil",
      "BitsAdmin",
      "Linux",
      "Windows",
    ],
    color: {
      primary: "#B45309", // amber-700
      secondary: "#D97706", // amber-600
      accent: "#92400E", // amber-800
      background: {
        light: "bg-amber-50",
        dark: "bg-amber-900",
      },
      text: {
        light: "text-amber-900",
        dark: "text-amber-100",
      },
    },
    priority: 5,
  },
};

// ========================================================================================
// TEMAS DE COLORES PARA CATEGORÍAS
// ========================================================================================
export const CATEGORY_COLOR_THEMES: Record<
  string,
  {
    lightBg: string;
    lightText: string;
    darkBg: string;
    darkText: string;
  }
> = {
  authenticationBased: {
    lightBg: "bg-violet-100",
    lightText: "text-violet-700",
    darkBg: "bg-violet-900",
    darkText: "text-violet-300",
  },
  attackTypes: {
    lightBg: "bg-red-100",
    lightText: "text-red-700",
    darkBg: "bg-red-900",
    darkText: "text-red-300",
  },
  tools: {
    lightBg: "bg-blue-100",
    lightText: "text-blue-700",
    darkBg: "bg-blue-900",
    darkText: "text-blue-300",
  },
  networkProtocols: {
    lightBg: "bg-cyan-100",
    lightText: "text-cyan-700",
    darkBg: "bg-cyan-900",
    darkText: "text-cyan-300",
  },
  adAuthTechniques: {
    lightBg: "bg-emerald-100",
    lightText: "text-emerald-700",
    darkBg: "bg-emerald-900",
    darkText: "text-emerald-300",
  },
  webVulnerabilities: {
    lightBg: "bg-orange-100",
    lightText: "text-orange-700",
    darkBg: "bg-orange-900",
    darkText: "text-orange-300",
  },
  privescTechniques: {
    lightBg: "bg-pink-100",
    lightText: "text-pink-700",
    darkBg: "bg-pink-900",
    darkText: "text-pink-300",
  },
  platforms: {
    lightBg: "bg-gray-100",
    lightText: "text-gray-700",
    darkBg: "bg-gray-800",
    darkText: "text-gray-300",
  },
  // Fallback para categorías no definidas
  uncategorized: {
    lightBg: "bg-slate-100",
    lightText: "text-slate-700",
    darkBg: "bg-slate-800",
    darkText: "text-slate-300",
  },
};

// ========================================================================================
// CONFIGURACIÓN DE VARIABLES DINÁMICAS
// ========================================================================================
export const VARIABLE_CONFIG: Record<
  string,
  {
    displayName: string;
    defaultValue: string;
    placeholder?: string;
    description?: string;
    type?: "text" | "password" | "file" | "ip" | "domain" | "port" | "url";
    category?: "network" | "auth" | "file" | "exploit" | "web";
  }
> = {
  // Variables de Red
  IP: {
    displayName: "IP Objetivo",
    defaultValue: "10.10.10.100",
    placeholder: "192.168.1.100",
    description: "Dirección IP del sistema objetivo",
    type: "ip",
    category: "network",
  },
  DOMAIN: {
    displayName: "Dominio",
    defaultValue: "htb.local",
    placeholder: "company.local",
    description: "Nombre del dominio Active Directory",
    type: "domain",
    category: "network",
  },
  TARGET: {
    displayName: "Host Objetivo",
    defaultValue: "target.htb.local",
    placeholder: "server.domain.com",
    description: "FQDN o IP del host objetivo",
    type: "text",
    category: "network",
  },
  PORT: {
    displayName: "Puerto",
    defaultValue: "445",
    placeholder: "8080",
    description: "Puerto del servicio objetivo",
    type: "port",
    category: "network",
  },
  DCIP: {
    displayName: "IP del DC",
    defaultValue: "10.10.10.101",
    placeholder: "192.168.1.10",
    description: "Dirección IP del Domain Controller",
    type: "ip",
    category: "network",
  },
  URL: {
    displayName: "URL Base",
    defaultValue: "http://target.htb.local",
    placeholder: "https://app.example.com",
    description: "URL base de la aplicación web",
    type: "url",
    category: "web",
  },

  // Variables de Autenticación
  USER: {
    displayName: "Usuario",
    defaultValue: "administrator",
    placeholder: "john.doe",
    description: "Nombre de usuario para autenticación",
    type: "text",
    category: "auth",
  },
  PASSWORD: {
    displayName: "Contraseña",
    defaultValue: "Password123!",
    placeholder: "secretpassword",
    description: "Contraseña para autenticación",
    type: "password",
    category: "auth",
  },
  DOMAIN_USER: {
    displayName: "Usuario de Dominio",
    defaultValue: "HTB\\administrator",
    placeholder: "DOMAIN\\username",
    description: "Usuario con formato de dominio",
    type: "text",
    category: "auth",
  },
  HASH: {
    displayName: "Hash NTLM",
    defaultValue: "aad3b435b51404eeaad3b435b51404ee:hash_aqui",
    placeholder: "LM:NTLM",
    description: "Hash NTLM para Pass-the-Hash",
    type: "text",
    category: "auth",
  },

  // Variables de Archivos
  WORDLIST: {
    displayName: "Lista de Palabras",
    defaultValue: "/usr/share/wordlists/rockyou.txt",
    placeholder: "/path/to/wordlist.txt",
    description: "Ruta del archivo de wordlist",
    type: "file",
    category: "file",
  },
  SHARE: {
    displayName: "Recurso SMB",
    defaultValue: "SYSVOL",
    placeholder: "C$",
    description: "Nombre del recurso compartido SMB",
    type: "text",
    category: "file",
  },
  TICKET: {
    displayName: "Ticket Kerberos",
    defaultValue: "ticket.kirbi",
    placeholder: "admin.ccache",
    description: "Archivo de ticket Kerberos",
    type: "file",
    category: "auth",
  },
  PAYLOAD: {
    displayName: "Payload",
    defaultValue: "reverse_shell.php",
    placeholder: "exploit.exe",
    description: "Archivo de payload o exploit",
    type: "file",
    category: "exploit",
  },

  // Variables Específicas de AD
  DC_NAME: {
    displayName: "Nombre del DC",
    defaultValue: "DC01",
    placeholder: "DOMAIN-DC01",
    description: "Nombre del Domain Controller",
    type: "text",
    category: "network",
  },
  FOREST: {
    displayName: "Forest",
    defaultValue: "htb.local",
    placeholder: "corp.local",
    description: "Nombre del forest de Active Directory",
    type: "domain",
    category: "network",
  },
  COMPUTER: {
    displayName: "Equipo",
    defaultValue: "WORKSTATION01",
    placeholder: "PC-USER$",
    description: "Nombre del equipo o cuenta de máquina",
    type: "text",
    category: "network",
  },
  SPN: {
    displayName: "SPN",
    defaultValue: "MSSQLSvc/sql.htb.local:1433",
    placeholder: "HTTP/web.domain.com",
    description: "Service Principal Name para Kerberoasting",
    type: "text",
    category: "auth",
  },

  // Variables Web
  PARAM: {
    displayName: "Parámetro",
    defaultValue: "id",
    placeholder: "username",
    description: "Parámetro de la aplicación web",
    type: "text",
    category: "web",
  },
  COOKIE: {
    displayName: "Cookie",
    defaultValue: "PHPSESSID=abc123",
    placeholder: "session=token123",
    description: "Cookie de sesión",
    type: "text",
    category: "web",
  },
  USER_AGENT: {
    displayName: "User Agent",
    defaultValue: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    placeholder: "Custom-Agent/1.0",
    description: "User Agent personalizado",
    type: "text",
    category: "web",
  },
};

// Extraer valores por defecto para retrocompatibilidad
export const DEFAULT_VARIABLES: Record<string, string> = Object.fromEntries(
  Object.entries(VARIABLE_CONFIG).map(([key, config]) => [
    key,
    config.defaultValue,
  ])
);

// ========================================================================================
// CONFIGURACIÓN DE UI Y TEXTOS
// ========================================================================================
export const UI_TEXTS = {
  // Títulos principales
  appTitle: "CyberSec Toolkit Dashboard",
  appSubtitle:
    "Herramientas profesionales de ciberseguridad organizadas por categorías",

  // Secciones
  sectionTitles: {
    webApp: "Aplicaciones Web",
    activeDirectory: "Active Directory",
    linuxPrivesc: "Linux Privilege Escalation",
  },

  // Navegación
  navigation: {
    search: "Buscar comandos, herramientas o técnicas...",
    clearSearch: "Limpiar búsqueda",
    toggleTheme: "Cambiar tema",
    toggleVariables: "Mostrar/ocultar variables",
    toggleCategories: "Explorar categorías",
    refreshData: "Actualizar datos",
  },

  // Estados
  loading: "Cargando herramientas de ciberseguridad...",
  error: "Error al cargar los datos",
  noResults: "No se encontraron resultados",
  noData: "No hay datos disponibles",

  // Acciones
  actions: {
    copy: "Copiar comando",
    copied: "¡Copiado!",
    openDocs: "Abrir documentación",
    viewAll: "Ver todas",
    showMore: "Mostrar más",
    showLess: "Mostrar menos",
  },

  // Estadísticas
  stats: {
    tools: "herramientas",
    commands: "comandos",
    categories: "categorías",
    variables: "variables",
    lastUpdated: "Última actualización",
  },

  // Mensajes
  messages: {
    variablesReset: "Variables restablecidas a valores por defecto",
    variablesCopied: "Variables copiadas al portapapeles",
    variablesExported: "Variables exportadas exitosamente",
    variablesImported: "Variables importadas exitosamente",
    variablesImportError: "Error al importar variables - formato inválido",
    commandCopied: "Comando copiado al portapapeles",
    dataRefreshed: "Datos actualizados correctamente",
  },
} as const;

// ========================================================================================
// CONFIGURACIÓN DE RESPONSIVE DESIGN
// ========================================================================================
export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export const LAYOUT_CONFIG = {
  maxWidth: "max-w-7xl",
  padding: {
    mobile: "px-4",
    tablet: "sm:px-6",
    desktop: "lg:px-8",
  },
  gridCols: {
    mobile: "grid-cols-1",
    tablet: "md:grid-cols-2",
    desktop: "xl:grid-cols-3",
  },
} as const;

// ========================================================================================
// CONFIGURACIÓN DE ANIMACIONES
// ========================================================================================
export const ANIMATION_CONFIG = {
  transition: "transition-all duration-200 ease-in-out",
  hover: {
    scale: "hover:scale-[1.02]",
    shadow: "hover:shadow-lg",
    border: "hover:border-opacity-70",
  },
  loading: {
    spin: "animate-spin",
    pulse: "animate-pulse",
    bounce: "animate-bounce",
  },
} as const;

// ========================================================================================
// HEADERS ESPERADOS DEL CSV
// ========================================================================================
export const EXPECTED_CSV_HEADERS = [
  "Command", // Nombre descriptivo del comando
  "Cmd", // El comando real con variables en formato [VARIABLE]
  "Tags", // Tags separados por comas
  "Page", // URL de documentación (opcional)
] as const;

// ========================================================================================
// CONFIGURACIÓN DE DESARROLLO Y DEBUGGING
// ========================================================================================
export const DEBUG_CONFIG = {
  enableLogging: process.env.NODE_ENV === "development",
  showPerformanceMetrics: process.env.NODE_ENV === "development",
  enableVerboseErrors: process.env.NODE_ENV === "development",
} as const;

// ========================================================================================
// FUNCIONES UTILITARIAS PARA CONSTANTES
// ========================================================================================

/**
 * Obtiene la configuración de una sección por su clave
 */
export const getSectionConfig = (
  sectionKey: string
): DashboardSection | null => {
  return DASHBOARD_SECTIONS[sectionKey] || null;
};

/**
 * Obtiene todas las secciones ordenadas por prioridad
 */
export const getOrderedSections = (): DashboardSection[] => {
  return Object.values(DASHBOARD_SECTIONS).sort(
    (a, b) => a.priority - b.priority
  );
};

/**
 * Determina a qué sección pertenece un tag
 */
export const getTagSection = (tag: string): string | null => {
  const normalizedTag = tag.trim();

  for (const [sectionKey, section] of Object.entries(DASHBOARD_SECTIONS)) {
    if (
      section.tags.some(
        (sectionTag) => sectionTag.toLowerCase() === normalizedTag.toLowerCase()
      )
    ) {
      return sectionKey;
    }
  }

  return null;
};

/**
 * Obtiene los colores de una sección
 */
export const getSectionColors = (
  sectionKey: string,
  isDark: boolean = false
) => {
  const section = DASHBOARD_SECTIONS[sectionKey];
  if (!section) return null;

  return {
    primary: section.color.primary,
    secondary: section.color.secondary,
    accent: section.color.accent,
    background: isDark
      ? section.color.background.dark
      : section.color.background.light,
    text: isDark ? section.color.text.dark : section.color.text.light,
  };
};
