// ========================================================================================
// DASHBOARD.TSX - DASHBOARD PRINCIPAL CON SECCIONES DINÁMICAS
// ========================================================================================
// Dashboard profesional de ciberseguridad con separación automática por secciones
// basado en tags, interfaz intuitiva y sistema de variables dinámicas.

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  Suspense,
} from "react";
import Papa from "papaparse";
import {
  Search,
  Filter,
  Copy,
  ExternalLink,
  ChevronRight,
  Settings,
  Sun,
  Moon,
  Grid,
  List,
  TrendingUp,
  Shield,
  Activity,
  Layers,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Database,
  Tag,
  ChevronDown,
  ChevronUp,
  Eye,
  Users,
  Zap,
  Hash,
  Globe,
  Server,
  BarChart3,
  Filter as FilterIcon,
  X,
  Star,
  Clock,
  ArrowRight,
} from "lucide-react";

// Lazy load components
const VariablesPanel = React.lazy(() => import("./components/VariablesPanel"));
const CommandCard = React.lazy(() => import("./components/CommandCard"));
const SectionCard = React.lazy(() => import("./components/SectionCard"));
const SmartSearchBar = React.lazy(() => import("./components/SmartSearchBar"));

// Importar toda la configuración centralizada
import {
  DASHBOARD_SECTIONS,
  TAG_CATEGORIES,
  CATEGORY_DISPLAY_CONFIG,
  CATEGORY_COLOR_THEMES,
  API_CONFIG,
  CACHE_CONFIG,
  FILE_PATHS,
  DEFAULT_VARIABLES,
  VARIABLE_CONFIG,
  UI_TEXTS,
  LAYOUT_CONFIG,
  ANIMATION_CONFIG,
  DEBUG_CONFIG,
  getOrderedSections,
  getTagSection,
  getSectionColors,
  type DashboardSection,
} from "./constants";

// ========================================================================================
// INTERFACES Y TIPOS
// ========================================================================================
interface Tool {
  Command: string;
  Cmd: string;
  Tags: string;
  Page?: string;
}

interface SectionData {
  section: DashboardSection;
  tools: Tool[];
  count: number;
  categories: Record<string, number>;
}

interface DashboardState {
  data: Tool[];
  loading: boolean;
  error: string | null;
  selectedSection: string | null;
  selectedTag: string;
  globalSearch: string;
  isDarkMode: boolean;
  showVariables: boolean;
  showSections: boolean;
  commandVariables: Record<string, string>;
  viewMode: "grid" | "list";
  sortBy: "name" | "popularity" | "category" | "section";
  csvUrl: string | null;
  lastUpdated: Date | null;
  filters: {
    sections: string[];
    categories: string[];
    tools: string[];
  };
}

// ========================================================================================
// FUNCIONES UTILITARIAS
// ========================================================================================
const safeString = (value: any): string => {
  if (value === null || value === undefined) return "";
  return String(value);
};

const safeLocaleCompare = (a: any, b: any): number => {
  const strA = safeString(a);
  const strB = safeString(b);
  return strA.localeCompare(strB);
};

// Procesar tags dinámicamente
const extractAllTags = (data: Tool[]): string[] => {
  const allTags = new Set<string>();
  data.forEach((item) => {
    if (item.Tags) {
      const tags = item.Tags.split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
      tags.forEach((tag) => allTags.add(tag));
    }
  });
  return Array.from(allTags).sort();
};

// Categorizar tools por secciones
const categorizeToolsBySections = (tools: Tool[]): Record<string, Tool[]> => {
  const sections: Record<string, Tool[]> = {};

  // Inicializar todas las secciones
  Object.keys(DASHBOARD_SECTIONS).forEach((sectionKey) => {
    sections[sectionKey] = [];
  });

  // Agregar herramientas no categorizadas
  sections["uncategorized"] = [];

  tools.forEach((tool) => {
    const tags = tool.Tags.split(",").map((tag) => tag.trim());
    let assigned = false;

    // Verificar cada tag contra las secciones
    for (const tag of tags) {
      const sectionKey = getTagSection(tag);
      if (sectionKey && sections[sectionKey]) {
        sections[sectionKey].push(tool);
        assigned = true;
        break; // Asignar solo a la primera sección que coincida
      }
    }

    // Si no se asignó a ninguna sección, agregar a uncategorized
    if (!assigned) {
      sections["uncategorized"].push(tool);
    }
  });

  return sections;
};

// Extraer variables de comandos
const extractVariables = (data: Tool[]): string[] => {
  const variables = new Set<string>();
  const pattern = /\[([A-Z_]+)\]/g;

  data.forEach((item) => {
    if (item.Cmd) {
      const matches = item.Cmd.match(pattern);
      if (matches) {
        matches.forEach((match) => {
          const variable = match.slice(1, -1);
          variables.add(variable);
        });
      }
    }
  });

  return Array.from(variables).sort();
};

// ========================================================================================
// CUSTOM HOOKS
// ========================================================================================
const useLocalStorage = (key: string, initialValue: any) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      if (DEBUG_CONFIG.enableLogging) {
        console.error(`Error loading ${key} from localStorage:`, error);
      }
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: any) => {
      try {
        setStoredValue(value);
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        if (DEBUG_CONFIG.enableLogging) {
          console.error(`Error saving ${key} to localStorage:`, error);
        }
      }
    },
    [key]
  );

  return [storedValue, setValue];
};

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// ========================================================================================
// COMPONENTE PRINCIPAL
// ========================================================================================
const Dashboard: React.FC = () => {
  // ========================================================================================
  // ESTADO DEL DASHBOARD
  // ========================================================================================
  const [state, setState] = useState<DashboardState>({
    data: [],
    loading: true,
    error: null,
    selectedSection: null,
    selectedTag: "",
    globalSearch: "",
    isDarkMode: true,
    showVariables: false,
    showSections: true, // Mostrar secciones por defecto
    commandVariables: DEFAULT_VARIABLES,
    viewMode: "grid",
    sortBy: "name",
    csvUrl: null,
    lastUpdated: null,
    filters: {
      sections: [],
      categories: [],
      tools: [],
    },
  });

  // Estado persistente
  const [preferences, setPreferences] = useLocalStorage(
    "cybersec_preferences",
    {
      isDarkMode: true,
      viewMode: "grid",
      sortBy: "name",
      selectedSection: null,
    }
  );

  // Búsqueda con debounce
  const debouncedSearch = useDebounce(state.globalSearch, 300);

  // ========================================================================================
  // INICIALIZACIÓN
  // ========================================================================================
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      isDarkMode: preferences.isDarkMode,
      viewMode: preferences.viewMode,
      sortBy: preferences.sortBy,
      selectedSection: preferences.selectedSection,
    }));
  }, [preferences]);

  // ========================================================================================
  // CARGA DE DATOS
  // ========================================================================================
  const loadCSVUrl = useCallback(async () => {
    try {
      if (DEBUG_CONFIG.enableLogging) {
        console.log("Loading CSV URL from:", FILE_PATHS.indexJson);
      }

      const response = await fetch(FILE_PATHS.indexJson, API_CONFIG);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const indexData = await response.json();
      if (DEBUG_CONFIG.enableLogging) {
        console.log("Index data loaded:", indexData);
      }

      let csvUrl = "";

      if (Array.isArray(indexData)) {
        const csvEntry = indexData.find((entry: any) => {
          const filename = typeof entry === "string" ? entry : entry.filename;
          return filename && filename.toLowerCase().endsWith(".csv");
        });
        if (csvEntry) {
          csvUrl = FILE_PATHS.docsPath + "/" + (csvEntry.filename || csvEntry);
        }
      }

      if (csvUrl && !csvUrl.startsWith("http")) {
        if (csvUrl.startsWith("/")) {
          csvUrl = window.location.origin + csvUrl;
        }
      }

      if (DEBUG_CONFIG.enableLogging) {
        console.log("CSV URL resolved to:", csvUrl);
      }

      setState((prev) => ({ ...prev, csvUrl }));
      return csvUrl;
    } catch (error) {
      if (DEBUG_CONFIG.enableLogging) {
        console.error("Failed to load CSV URL from index:", error);
      }

      const fallbackUrl = `${FILE_PATHS.docsPath}/${FILE_PATHS.csvFallback}`;
      if (DEBUG_CONFIG.enableLogging) {
        console.log("Using fallback CSV URL:", fallbackUrl);
      }

      setState((prev) => ({ ...prev, csvUrl: fallbackUrl }));
      return fallbackUrl;
    }
  }, []);

  const fetchCSVData = useCallback(
    async (useCache = false) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        let csvUrl = state.csvUrl;
        if (!csvUrl) {
          csvUrl = await loadCSVUrl();
        }

        if (!csvUrl) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: "No se encontró la URL del CSV",
          }));
          return;
        }

        // Verificar caché solo si se solicita y el caché está habilitado
        if (useCache && CACHE_CONFIG.refreshInterval > 0) {
          const cached = localStorage.getItem(
            CACHE_CONFIG.cacheKeyPrefix + "data"
          );
          const cacheTimestamp = localStorage.getItem(
            `${CACHE_CONFIG.cacheKeyPrefix}data_timestamp`
          );

          if (cached && cacheTimestamp) {
            const cacheAge = Date.now() - parseInt(cacheTimestamp);
            if (cacheAge < CACHE_CONFIG.refreshInterval) {
              const cachedData = JSON.parse(cached);
              if (DEBUG_CONFIG.enableLogging) {
                console.log("Using cached data:", cachedData.length, "records");
              }
              setState((prev) => ({
                ...prev,
                data: cachedData,
                loading: false,
                lastUpdated: new Date(parseInt(cacheTimestamp)),
              }));
              return;
            }
          }
        }

        if (DEBUG_CONFIG.enableLogging) {
          console.log("Fetching fresh CSV from:", csvUrl);
        }

        const response = await fetch(csvUrl, {
          method: "GET",
          cache: "no-cache",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const csvText = await response.text();
        if (DEBUG_CONFIG.enableLogging) {
          console.log("CSV text loaded, length:", csvText.length);
        }

        Papa.parse<Tool>(csvText, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header) => header.trim(),
          transform: (value) => value.trim(),
          complete: (results) => {
            if (DEBUG_CONFIG.enableLogging) {
              console.log("Papa Parse results:", results);
            }

            if (results.errors.length > 0) {
              console.warn("CSV parsing warnings:", results.errors);
            }

            const processedData = results.data
              .filter((row) => {
                return Object.values(row).some(
                  (value) => value && value.toString().trim()
                );
              })
              .map((row) => ({
                Command: safeString(row.Command || "").trim(),
                Cmd: safeString(row.Cmd || "").trim(),
                Tags: safeString(row.Tags || "").trim(),
                Page: safeString(row.Page || "").trim(),
              }))
              .filter((item) => item.Command && item.Cmd);

            if (DEBUG_CONFIG.enableLogging) {
              console.log(
                "Processed data:",
                processedData.length,
                "valid records"
              );
            }

            setState((prev) => ({
              ...prev,
              data: processedData,
              loading: false,
              error: null,
            }));

            // Guardar en caché si está habilitado
            if (CACHE_CONFIG.refreshInterval > 0) {
              const timestamp = Date.now();
              localStorage.setItem(
                CACHE_CONFIG.cacheKeyPrefix + "data",
                JSON.stringify(processedData)
              );
              localStorage.setItem(
                `${CACHE_CONFIG.cacheKeyPrefix}data_timestamp`,
                timestamp.toString()
              );
            }

            setState((prev) => ({
              ...prev,
              lastUpdated: new Date(),
            }));
          },
          error: (error) => {
            throw new Error(`Error al procesar CSV: ${error.message}`);
          },
        });
      } catch (err) {
        console.error("Failed to fetch CSV data:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setState((prev) => ({
          ...prev,
          error: `Error al cargar datos: ${errorMessage}`,
          loading: false,
        }));
      }
    },
    [state.csvUrl, loadCSVUrl]
  );

  // Inicializar carga de datos
  useEffect(() => {
    loadCSVUrl().then(() => {
      fetchCSVData(!CACHE_CONFIG.forceRefreshOnLoad);
    });
  }, [loadCSVUrl, fetchCSVData]);

  // ========================================================================================
  // PROCESAMIENTO DE DATOS
  // ========================================================================================
  const { sectionData, allTags, availableVariables, totalStats } =
    useMemo(() => {
      if (!state.data.length) {
        return {
          sectionData: [],
          allTags: [],
          availableVariables: [],
          totalStats: { tools: 0, categories: 0, variables: 0 },
        };
      }

      // Extraer datos básicos
      const tags = extractAllTags(state.data);
      const variables = extractVariables(state.data);
      const sectionsByTools = categorizeToolsBySections(state.data);

      // Crear datos de secciones
      const sections: SectionData[] = getOrderedSections()
        .map((section) => {
          const tools = sectionsByTools[section.key] || [];
          const categories: Record<string, number> = {};

          // Contar categorías dentro de cada sección
          tools.forEach((tool) => {
            const toolTags = tool.Tags.split(",").map((t) => t.trim());
            toolTags.forEach((tag) => {
              categories[tag] = (categories[tag] || 0) + 1;
            });
          });

          return {
            section,
            tools,
            count: tools.length,
            categories,
          };
        })
        .filter((sectionData) => sectionData.count > 0); // Solo mostrar secciones con contenido

      if (DEBUG_CONFIG.enableLogging) {
        console.log("Section analysis:", {
          totalSections: sections.length,
          totalTags: tags.length,
          totalVariables: variables.length,
          sectionBreakdown: sections.map((s) => ({
            name: s.section.displayName,
            count: s.count,
          })),
        });
      }

      const stats = {
        tools: state.data.length,
        categories: tags.length,
        variables: variables.length,
      };

      return {
        sectionData: sections,
        allTags: tags,
        availableVariables: variables,
        totalStats: stats,
      };
    }, [state.data]);

  // Filtrar datos basado en búsqueda y selecciones
  const filteredData = useMemo(() => {
    let filtered = state.data;

    // Filtro por sección seleccionada
    if (state.selectedSection) {
      const sectionTools =
        sectionData.find((s) => s.section.key === state.selectedSection)
          ?.tools || [];
      filtered = sectionTools;
    }

    // Filtro por búsqueda global
    if (debouncedSearch) {
      const searchTerm = debouncedSearch.toLowerCase();
      filtered = filtered.filter((item) => {
        const command = safeString(item.Command).toLowerCase();
        const cmd = safeString(item.Cmd).toLowerCase();
        const tags = safeString(item.Tags).toLowerCase();

        return (
          command.includes(searchTerm) ||
          cmd.includes(searchTerm) ||
          tags.includes(searchTerm)
        );
      });
    }

    // Filtro por tag específico
    if (state.selectedTag) {
      filtered = filtered.filter((item) => {
        const tags = item.Tags.split(",").map((tag) =>
          tag.trim().toLowerCase()
        );
        return tags.includes(state.selectedTag.toLowerCase());
      });
    }

    // Aplicar ordenamiento
    switch (state.sortBy) {
      case "name":
        filtered.sort((a, b) => safeLocaleCompare(a.Command, b.Command));
        break;
      case "category":
        filtered.sort((a, b) => {
          const aFirstTag = safeString(a.Tags).split(",")[0]?.trim() || "";
          const bFirstTag = safeString(b.Tags).split(",")[0]?.trim() || "";
          return safeLocaleCompare(aFirstTag, bFirstTag);
        });
        break;
      case "popularity":
        filtered.sort((a, b) => {
          const aTagCount = safeString(a.Tags)
            .split(",")
            .filter((t) => t.trim()).length;
          const bTagCount = safeString(b.Tags)
            .split(",")
            .filter((t) => t.trim()).length;
          return bTagCount - aTagCount;
        });
        break;
      case "section":
        filtered.sort((a, b) => {
          const aSection =
            getTagSection(a.Tags.split(",")[0]?.trim() || "") || "z";
          const bSection =
            getTagSection(b.Tags.split(",")[0]?.trim() || "") || "z";
          return aSection.localeCompare(bSection);
        });
        break;
    }

    return filtered;
  }, [
    state.data,
    sectionData,
    state.selectedSection,
    debouncedSearch,
    state.selectedTag,
    state.sortBy,
  ]);

  // ========================================================================================
  // MANEJADORES DE EVENTOS
  // ========================================================================================
  const handleThemeToggle = useCallback(() => {
    const newTheme = !state.isDarkMode;
    setState((prev) => ({ ...prev, isDarkMode: newTheme }));
    setPreferences((prev) => ({ ...prev, isDarkMode: newTheme }));
  }, [state.isDarkMode, setPreferences]);

  const handleSectionSelect = useCallback(
    (sectionKey: string | null) => {
      setState((prev) => ({
        ...prev,
        selectedSection:
          prev.selectedSection === sectionKey ? null : sectionKey,
        selectedTag: "", // Limpiar tag al cambiar sección
        showSections: sectionKey === null, // Mostrar secciones si no hay selección
      }));
      setPreferences((prev) => ({ ...prev, selectedSection: sectionKey }));
    },
    [setPreferences]
  );

  const handleTagSelect = useCallback((tag: string) => {
    setState((prev) => ({
      ...prev,
      selectedTag: prev.selectedTag === tag ? "" : tag,
    }));
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setState((prev) => ({ ...prev, globalSearch: e.target.value }));
    },
    []
  );

  const updateVariable = useCallback((key: string, value: string) => {
    setState((prev) => ({
      ...prev,
      commandVariables: { ...prev.commandVariables, [key]: value },
    }));
  }, []);

  const replaceVariables = useCallback(
    (command: string) => {
      if (!command || typeof command !== "string") return "";

      return Object.entries(state.commandVariables).reduce(
        (cmd, [key, value]) => {
          const safeValue = safeString(value);
          return cmd.replace(new RegExp(`\\[${key}\\]`, "g"), safeValue);
        },
        command
      );
    },
    [state.commandVariables]
  );

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Aquí podrías agregar una notificación de éxito
    } catch (error) {
      if (DEBUG_CONFIG.enableLogging) {
        console.error("Failed to copy to clipboard:", error);
      }
    }
  }, []);

  const forceRefresh = useCallback(() => {
    // Limpiar caché
    localStorage.removeItem(CACHE_CONFIG.cacheKeyPrefix + "data");
    localStorage.removeItem(`${CACHE_CONFIG.cacheKeyPrefix}data_timestamp`);
    fetchCSVData(false);
  }, [fetchCSVData]);

  const getCategoryColors = useCallback(
    (categoryKey: string, isDark: boolean = false) => {
      const theme =
        CATEGORY_COLOR_THEMES[categoryKey.toLowerCase()] ||
        CATEGORY_COLOR_THEMES.uncategorized;

      return {
        bg: isDark ? theme.darkBg : theme.lightBg,
        text: isDark ? theme.darkText : theme.lightText,
      };
    },
    []
  );

  // ========================================================================================
  // COMPONENTES DE UI
  // ========================================================================================
  const LoadingSpinner = () => (
    <div className="flex flex-col justify-center items-center min-h-64">
      <div className="relative mb-4">
        <div
          className={`w-16 h-16 border-4 border-blue-200 rounded-full ${ANIMATION_CONFIG.loading.spin}`}
        ></div>
        <div
          className={`w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full ${ANIMATION_CONFIG.loading.spin} absolute top-0 left-0`}
        ></div>
      </div>
      <span className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
        {UI_TEXTS.loading}
      </span>
      {state.csvUrl && (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Fuente: {state.csvUrl.split("/").pop()}
        </span>
      )}
    </div>
  );

  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6 text-center">
      <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
        {UI_TEXTS.error}
      </h3>
      <p className="text-red-600 dark:text-red-300 mb-4">{message}</p>
      <div className="flex justify-center space-x-2">
        <button
          onClick={() => fetchCSVData(false)}
          className={`inline-flex items-center space-x-2 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 text-red-800 dark:text-red-200 rounded-lg ${ANIMATION_CONFIG.transition}`}
        >
          <RefreshCw className="h-4 w-4" />
          <span>Reintentar</span>
        </button>
        <button
          onClick={forceRefresh}
          className={`inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:hover:bg-blue-700 text-blue-800 dark:text-blue-200 rounded-lg ${ANIMATION_CONFIG.transition}`}
        >
          <Database className="h-4 w-4" />
          <span>Refrescar</span>
        </button>
      </div>
    </div>
  );

  // Panel de secciones principales
  const SectionsOverview = () => {
    if (!state.showSections || state.selectedSection) return null;

    return (
      <div className="mb-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">{UI_TEXTS.appTitle}</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {UI_TEXTS.appSubtitle}
          </p>
        </div>

        <div
          className={`grid gap-6 ${LAYOUT_CONFIG.gridCols.mobile} ${LAYOUT_CONFIG.gridCols.tablet} ${LAYOUT_CONFIG.gridCols.desktop}`}
        >
          {sectionData.map((section) => (
            <Suspense
              key={section.section.key}
              fallback={
                <div
                  className={`p-6 ${ANIMATION_CONFIG.loading.pulse} bg-gray-200 dark:bg-gray-700 rounded-lg`}
                >
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                </div>
              }
            >
              <SectionCard
                sectionData={section}
                isDarkMode={state.isDarkMode}
                onSelect={() => handleSectionSelect(section.section.key)}
                getSectionColors={getSectionColors}
              />
            </Suspense>
          ))}
        </div>
      </div>
    );
  };

  // ========================================================================================
  // RENDER PRINCIPAL
  // ========================================================================================
  return (
    <div
      className={`min-h-screen ${ANIMATION_CONFIG.transition} ${
        state.isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-50 border-b ${ANIMATION_CONFIG.transition} ${
          state.isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        } backdrop-blur-sm bg-opacity-90`}
      >
        <div
          className={`${LAYOUT_CONFIG.maxWidth} mx-auto ${LAYOUT_CONFIG.padding.mobile} ${LAYOUT_CONFIG.padding.tablet} ${LAYOUT_CONFIG.padding.desktop}`}
        >
          <div className="flex items-center justify-between h-16">
            {/* Logo y título */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-blue-500" />
                <div>
                  <h1 className="text-xl font-bold">
                    {state.selectedSection
                      ? DASHBOARD_SECTIONS[state.selectedSection]
                          ?.displayName || UI_TEXTS.appTitle
                      : UI_TEXTS.appTitle}
                  </h1>
                  {state.selectedSection && (
                    <button
                      onClick={() => handleSectionSelect(null)}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
                    >
                      <ArrowRight className="h-3 w-3 rotate-180" />
                      <span>Volver a secciones</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                <Database className="h-4 w-4" />
                <span>
                  {totalStats.tools} {UI_TEXTS.stats.tools}
                </span>
                <span>•</span>
                <span>
                  {totalStats.categories} {UI_TEXTS.stats.categories}
                </span>
                <span>•</span>
                <span>
                  {totalStats.variables} {UI_TEXTS.stats.variables}
                </span>
                {state.selectedSection && (
                  <>
                    <span>•</span>
                    <span>{filteredData.length} filtradas</span>
                  </>
                )}
              </div>
            </div>

            {/* Controles */}
            <div className="flex items-center space-x-2">
              {/* View Mode Toggle */}
              <button
                onClick={() =>
                  setState((prev) => ({
                    ...prev,
                    viewMode: prev.viewMode === "grid" ? "list" : "grid",
                  }))
                }
                className={`p-2 rounded-lg ${ANIMATION_CONFIG.transition} ${
                  state.viewMode === "grid"
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
                title={
                  state.viewMode === "grid"
                    ? UI_TEXTS.navigation.toggleCategories
                    : UI_TEXTS.navigation.toggleCategories
                }
              >
                {state.viewMode === "grid" ? (
                  <Grid className="h-5 w-5" />
                ) : (
                  <List className="h-5 w-5" />
                )}
              </button>

              {/* Refresh Button */}
              <button
                onClick={forceRefresh}
                className={`p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 ${ANIMATION_CONFIG.transition}`}
                title={UI_TEXTS.navigation.refreshData}
              >
                <RefreshCw className="h-5 w-5" />
              </button>

              {/* Variables Toggle */}
              <button
                onClick={() =>
                  setState((prev) => ({
                    ...prev,
                    showVariables: !prev.showVariables,
                  }))
                }
                className={`p-2 rounded-lg ${ANIMATION_CONFIG.transition} ${
                  state.showVariables
                    ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
                title={UI_TEXTS.navigation.toggleVariables}
              >
                <Settings className="h-5 w-5" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={handleThemeToggle}
                className={`p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 ${ANIMATION_CONFIG.transition}`}
                title={UI_TEXTS.navigation.toggleTheme}
              >
                {state.isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Variables Panel */}
      <Suspense
        fallback={<div className="p-4 text-center">Cargando variables...</div>}
      >
        <VariablesPanel
          isDarkMode={state.isDarkMode}
          showVariables={state.showVariables}
          commandVariables={state.commandVariables}
          setCommandVariables={(vars) =>
            setState((prev) => ({ ...prev, commandVariables: vars }))
          }
          updateVariable={updateVariable}
          availableVariables={availableVariables}
        />
      </Suspense>

      {/* Main Content */}
      <main
        className={`${LAYOUT_CONFIG.maxWidth} mx-auto ${LAYOUT_CONFIG.padding.mobile} ${LAYOUT_CONFIG.padding.tablet} ${LAYOUT_CONFIG.padding.desktop} py-6`}
      >
        {/* Search and Filters - Mostrar siempre el buscador inteligente */}
        <div
          className={`rounded-lg p-6 mb-8 ${ANIMATION_CONFIG.transition} ${
            state.isDarkMode ? "bg-gray-800" : "bg-white"
          } shadow-sm border ${
            state.isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            {/* Smart Search Bar with Tag Suggestions */}
            <Suspense
              fallback={
                <div className="flex-1 max-w-lg h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              }
            >
              <SmartSearchBar
                isDarkMode={state.isDarkMode}
                globalSearch={state.globalSearch}
                onSearchChange={handleSearchChange}
                onTagSelect={handleTagSelect}
                allTags={allTags}
                selectedSection={state.selectedSection}
                sectionData={sectionData}
              />
            </Suspense>

            {/* Sort and Filter Controls */}
            <div className="flex items-center space-x-4">
              <select
                value={state.sortBy}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    sortBy: e.target.value as any,
                  }))
                }
                className={`px-3 py-2 rounded-lg border ${
                  ANIMATION_CONFIG.transition
                } ${
                  state.isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                // style={{ "pointer-events": "none" }}
              >
                <option value="name">Ordenar: Nombre</option>
                <option value="category">Ordenar: Categoría</option>
                <option value="popularity">Ordenar: Popularidad</option>
                <option value="section">Ordenar: Sección</option>
              </select>
              {state.lastUpdated && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {UI_TEXTS.stats.lastUpdated}:{" "}
                  {state.lastUpdated.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>

          {/* Selected Filters Display */}
          {(state.selectedTag || state.selectedSection) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {state.selectedSection && (
                <div className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium">
                    Sección:{" "}
                    {DASHBOARD_SECTIONS[state.selectedSection]?.displayName}
                  </span>
                  <button
                    onClick={() => handleSectionSelect(null)}
                    className="p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800 rounded"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {state.selectedTag && (
                <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium">
                    Tag: {state.selectedTag}
                  </span>
                  <button
                    onClick={() =>
                      setState((prev) => ({ ...prev, selectedTag: "" }))
                    }
                    className="p-0.5 hover:bg-green-200 dark:hover:bg-green-800 rounded"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {state.loading && <LoadingSpinner />}

        {/* Error State */}
        {state.error && <ErrorMessage message={state.error} />}

        {/* Content Area */}
        {!state.loading && !state.error && (
          <>
            {/* Sections Overview */}
            <SectionsOverview />

            {/* Search Results or Selected Section Content */}
            {(state.selectedSection ||
              debouncedSearch ||
              state.selectedTag) && (
              <>
                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    {debouncedSearch && (
                      <h2 className="text-2xl font-bold mb-2">
                        Resultados para "{debouncedSearch}"
                      </h2>
                    )}
                    {state.selectedSection && !debouncedSearch && (
                      <h2 className="text-2xl font-bold mb-2">
                        {DASHBOARD_SECTIONS[state.selectedSection]?.displayName}
                      </h2>
                    )}
                    <p className="text-gray-600 dark:text-gray-400">
                      {filteredData.length}{" "}
                      {filteredData.length === 1
                        ? "comando encontrado"
                        : "comandos encontrados"}
                      {state.selectedSection && (
                        <span className="ml-2 text-sm">
                          •{" "}
                          {
                            DASHBOARD_SECTIONS[state.selectedSection]
                              ?.description
                          }
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <BarChart3 className="h-4 w-4" />
                      <span>{filteredData.length}</span>
                    </div>
                  </div>
                </div>

                {/* Results Grid/List */}
                {filteredData.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {UI_TEXTS.noResults}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Intenta con diferentes términos de búsqueda o selecciona
                      otra sección
                    </p>
                    <button
                      onClick={() =>
                        setState((prev) => ({
                          ...prev,
                          globalSearch: "",
                          selectedTag: "",
                          selectedSection: null,
                          showSections: true,
                        }))
                      }
                      className={`inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-lg ${ANIMATION_CONFIG.transition}`}
                    >
                      <Eye className="h-4 w-4" />
                      <span>Ver todas las secciones</span>
                    </button>
                  </div>
                ) : (
                  <div
                    className={`grid gap-6 ${
                      state.viewMode === "grid"
                        ? `${LAYOUT_CONFIG.gridCols.mobile} ${LAYOUT_CONFIG.gridCols.tablet} ${LAYOUT_CONFIG.gridCols.desktop}`
                        : "grid-cols-1"
                    }`}
                  >
                    {filteredData.map((item, index) => (
                      <Suspense
                        key={`${safeString(item.Command)}-${index}`}
                        fallback={
                          <div
                            className={`p-6 ${ANIMATION_CONFIG.loading.pulse} bg-gray-200 dark:bg-gray-700 rounded-lg`}
                          >
                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                          </div>
                        }
                      >
                        <CommandCard
                          item={item}
                          isDarkMode={state.isDarkMode}
                          viewMode={state.viewMode}
                          replaceVariables={replaceVariables}
                          copyToClipboard={copyToClipboard}
                          getCategoryColors={getCategoryColors}
                          onTagClick={handleTagSelect}
                          selectedTag={state.selectedTag}
                        />
                      </Suspense>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
