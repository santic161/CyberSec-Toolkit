// ========================================================================================
// VARIABLESPANEL.TSX - PANEL DE VARIABLES DINÁMICAS MEJORADO
// ========================================================================================
// Panel profesional para gestión de variables dinámicas con categorización automática,
// importación/exportación, presets y interfaz intuitiva.

import React, { useState, useCallback, memo, useMemo } from "react";
import {
  Settings,
  Eye,
  EyeOff,
  Copy,
  RotateCcw,
  Download,
  Upload,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle,
  AlertTriangle,
  Search,
  Zap,
  Filter,
  X,
  Save,
  Edit,
  Globe,
  Lock,
  Folder,
  Code,
  Server,
  Hash,
  Link,
} from "lucide-react";
import {
  VARIABLE_CONFIG,
  DEFAULT_VARIABLES,
  UI_TEXTS,
  ANIMATION_CONFIG,
} from "../constants";

// ========================================================================================
// INTERFACES
// ========================================================================================
interface VariablesPanelProps {
  isDarkMode: boolean;
  showVariables: boolean;
  commandVariables: Record<string, string>;
  setCommandVariables: (vars: Record<string, string>) => void;
  updateVariable: (key: string, value: string) => void;
  availableVariables: string[]; // Variables detectadas dinámicamente en el CSV
}

interface VariableGroup {
  key: string;
  name: string;
  icon: React.ReactNode;
  variables: string[];
  color: string;
}

// ========================================================================================
// COMPONENTE PRINCIPAL
// ========================================================================================
const VariablesPanel: React.FC<VariablesPanelProps> = memo(
  ({
    isDarkMode,
    showVariables,
    commandVariables,
    setCommandVariables,
    updateVariable,
    availableVariables,
  }) => {
    // ========================================================================================
    // ESTADO LOCAL
    // ========================================================================================
    const [expandedSections, setExpandedSections] = useState({
      detected: true,
      network: true,
      auth: true,
      file: false,
      web: false,
      exploit: false,
    });
    const [showPasswords, setShowPasswords] = useState(false);
    const [searchFilter, setSearchFilter] = useState("");
    const [editingVariable, setEditingVariable] = useState<string | null>(null);
    const [notification, setNotification] = useState<{
      type: "success" | "error" | "info";
      message: string;
    } | null>(null);
    const [selectedPreset, setSelectedPreset] = useState<string>("");

    // ========================================================================================
    // FUNCIONES AUXILIARES
    // ========================================================================================
    const showNotification = useCallback(
      (type: "success" | "error" | "info", message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
      },
      []
    );

    const toggleSection = useCallback((section: string) => {
      setExpandedSections((prev) => ({
        ...prev,
        [section]: !prev[section],
      }));
    }, []);

    // ========================================================================================
    // AGRUPACIÓN DE VARIABLES
    // ========================================================================================
    const variableGroups = useMemo((): VariableGroup[] => {
      const allVariables = [
        ...new Set([...availableVariables, ...Object.keys(VARIABLE_CONFIG)]),
      ];

      // Variables detectadas dinámicamente
      const detectedVariables = availableVariables.filter(
        (variable) => !Object.keys(VARIABLE_CONFIG).includes(variable)
      );

      // Agrupar variables configuradas por categoría
      const categorizedVariables: Record<string, string[]> = {
        network: [],
        auth: [],
        file: [],
        web: [],
        exploit: [],
      };

      Object.entries(VARIABLE_CONFIG).forEach(([variable, config]) => {
        const category = config.category || "network";
        if (categorizedVariables[category]) {
          categorizedVariables[category].push(variable);
        }
      });

      const groups: VariableGroup[] = [];

      // Grupo de variables detectadas
      if (detectedVariables.length > 0) {
        groups.push({
          key: "detected",
          name: "Variables Detectadas no Reconocidas",
          icon: <Zap className="h-5 w-5" />,
          variables: detectedVariables,
          color: "yellow",
        });
      }

      // Grupos de variables configuradas
      const groupConfigs = [
        {
          key: "network",
          name: "Red y Conectividad",
          icon: <Globe className="h-5 w-5" />,
          color: "blue",
        },
        {
          key: "auth",
          name: "Autenticación",
          icon: <Lock className="h-5 w-5" />,
          color: "green",
        },
        {
          key: "file",
          name: "Archivos y Rutas",
          icon: <Folder className="h-5 w-5" />,
          color: "purple",
        },
        {
          key: "web",
          name: "Aplicaciones Web",
          icon: <Link className="h-5 w-5" />,
          color: "cyan",
        },
        {
          key: "exploit",
          name: "Exploits y Payloads",
          icon: <Code className="h-5 w-5" />,
          color: "red",
        },
      ];

      groupConfigs.forEach((groupConfig) => {
        const variables = categorizedVariables[groupConfig.key];
        if (variables && variables.length > 0) {
          groups.push({
            key: groupConfig.key,
            name: groupConfig.name,
            icon: groupConfig.icon,
            variables,
            color: groupConfig.color,
          });
        }
      });

      return groups;
    }, [availableVariables]);

    // ========================================================================================
    // PRESETS PREDEFINIDOS
    // ========================================================================================
    const variablePresets = useMemo(
      () => ({
        hackthebox: {
          name: "HackTheBox Standard",
          description: "Configuración típica para máquinas HTB",
          variables: {
            IP: "10.10.10.100",
            DOMAIN: "htb.local",
            USER: "administrator",
            PASSWORD: "Password123!",
            DCIP: "10.10.10.101",
            WORDLIST: "/usr/share/wordlists/rockyou.txt",
          },
        },
        tryhackme: {
          name: "TryHackMe Standard",
          description: "Configuración típica para TryHackMe",
          variables: {
            IP: "10.10.10.1",
            DOMAIN: "thm.local",
            USER: "admin",
            PASSWORD: "admin123",
            URL: "http://10.10.10.1",
          },
        },
        "local-testing": {
          name: "Laboratorio Local",
          description: "Para pruebas en entorno local",
          variables: {
            IP: "192.168.1.100",
            DOMAIN: "lab.local",
            USER: "testuser",
            PASSWORD: "testpass123",
            DCIP: "192.168.1.10",
            URL: "http://localhost:8080",
          },
        },
      }),
      []
    );

    // ========================================================================================
    // HANDLERS DE EVENTOS
    // ========================================================================================
    const resetToDefaults = useCallback(() => {
      const newVariables = { ...DEFAULT_VARIABLES };
      // Añadir variables detectadas con valores vacíos
      availableVariables.forEach((variable) => {
        if (!newVariables[variable]) {
          newVariables[variable] = "";
        }
      });
      setCommandVariables(newVariables);
      showNotification("success", UI_TEXTS.messages.variablesReset);
    }, [setCommandVariables, showNotification, availableVariables]);

    const copyAllVariables = useCallback(async () => {
      const variablesText = Object.entries(commandVariables)
        .filter(([, value]) => value.trim())
        .map(([key, value]) => `${key}=${value}`)
        .join("\n");

      try {
        await navigator.clipboard.writeText(variablesText);
        showNotification("success", UI_TEXTS.messages.variablesCopied);
      } catch (err) {
        showNotification("error", "Error al copiar variables");
      }
    }, [commandVariables, showNotification]);

    const exportVariables = useCallback(() => {
      try {
        const dataStr = JSON.stringify(commandVariables, null, 2);
        const dataUri =
          "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
        const exportFileDefaultName = `cybersec-variables-${
          new Date().toISOString().split("T")[0]
        }.json`;

        const linkElement = document.createElement("a");
        linkElement.setAttribute("href", dataUri);
        linkElement.setAttribute("download", exportFileDefaultName);
        linkElement.click();

        showNotification("success", UI_TEXTS.messages.variablesExported);
      } catch (error) {
        showNotification("error", "Error al exportar variables");
      }
    }, [commandVariables, showNotification]);

    const importVariables = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const imported = JSON.parse(e.target?.result as string);
              setCommandVariables((prev) => ({ ...prev, ...imported }));
              showNotification("success", UI_TEXTS.messages.variablesImported);
            } catch (err) {
              showNotification("error", UI_TEXTS.messages.variablesImportError);
            }
          };
          reader.readAsText(file);
        }
        event.target.value = "";
      },
      [setCommandVariables, showNotification]
    );

    const applyPreset = useCallback(
      (presetKey: string) => {
        const preset =
          variablePresets[presetKey as keyof typeof variablePresets];
        if (preset) {
          setCommandVariables((prev) => ({ ...prev, ...preset.variables }));
          showNotification(
            "success",
            `Preset "${preset.name}" aplicado correctamente`
          );
          setSelectedPreset(presetKey);
        }
      },
      [setCommandVariables, showNotification, variablePresets]
    );

    // ========================================================================================
    // COMPONENTE DE VARIABLE INDIVIDUAL
    // ========================================================================================
    const renderVariableInput = useCallback(
      (key: string, group: VariableGroup) => {
        const config = VARIABLE_CONFIG[key];
        const isDetected = availableVariables.includes(key);
        const isPassword = config?.type === "password";
        const shouldHidePassword = isPassword && !showPasswords;
        const isEditing = editingVariable === key;
        const hasValue =
          commandVariables[key] && commandVariables[key].trim().length > 0;

        return (
          <div
            key={key}
            className={`group p-4 rounded-lg border ${
              ANIMATION_CONFIG.transition
            } ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 hover:border-gray-500"
                : "bg-gray-50 border-gray-200 hover:border-gray-300"
            } ${isDetected ? "ring-1 ring-yellow-500/20" : ""}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <label className="font-medium text-sm flex items-center space-x-2">
                  <span
                    style={{
                      color:
                        group.color === "yellow"
                          ? "#F59E0B"
                          : group.color === "blue"
                          ? "#3B82F6"
                          : group.color === "green"
                          ? "#10B981"
                          : group.color === "purple"
                          ? "#8B5CF6"
                          : group.color === "cyan"
                          ? "#06B6D4"
                          : "#EF4444",
                    }}
                  >
                    {config?.displayName || key}
                  </span>
                </label>
                {config?.description && (
                  <div className="group/tooltip relative">
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                      {config.description}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {hasValue && (
                  <div
                    className="w-2 h-2 rounded-full bg-green-500"
                    title="Variable configurada"
                  />
                )}
                {/* <button
              onClick={() => setEditingVariable(isEditing ? null : key)}
              className={`text-xs px-2 py-1 rounded ${ANIMATION_CONFIG.transition} ${
                isEditing 
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-500'
              }`}
            >
              {isEditing ? <Save className="h-3 w-3" /> : <Edit className="h-3 w-3" />}
            </button> */}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type={shouldHidePassword ? "password" : "text"}
                value={commandVariables[key] || ""}
                onChange={(e) => updateVariable(key, e.target.value)}
                placeholder={
                  config?.placeholder || `Ingresa ${key.toLowerCase()}`
                }
                className={`flex-1 px-3 py-2 text-sm rounded-lg border ${
                  ANIMATION_CONFIG.transition
                } ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                } ${"focus:ring-2 focus:ring-blue-500 focus:border-blue-500"} ${
                  hasValue ? "border-green-500/50" : ""
                }`}
              />
              {isPassword && (
                <button
                  onClick={() => setShowPasswords(!showPasswords)}
                  className={`p-2 rounded-lg border ${
                    ANIMATION_CONFIG.transition
                  } ${
                    isDarkMode
                      ? "border-gray-600 text-gray-400 hover:text-gray-300 hover:bg-gray-600"
                      : "border-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                  title={
                    showPasswords
                      ? "Ocultar contraseñas"
                      : "Mostrar contraseñas"
                  }
                >
                  {showPasswords ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>

            {isDetected && (
              <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400 flex items-center">
                <Zap className="h-3 w-3 mr-1" />
                Variable detectada automáticamente en comandos del CSV
              </div>
            )}

            {config?.type && (
              <div className="mt-2 flex items-center space-x-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    config.type === "ip"
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                      : config.type === "domain"
                      ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                      : config.type === "password"
                      ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                      : config.type === "file"
                      ? "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
                      : config.type === "url"
                      ? "bg-cyan-100 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-300"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {config.type.toUpperCase()}
                </span>
                {config.category && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    • {config.category}
                  </span>
                )}
              </div>
            )}
          </div>
        );
      },
      [
        commandVariables,
        updateVariable,
        editingVariable,
        showPasswords,
        isDarkMode,
        availableVariables,
      ]
    );

    // ========================================================================================
    // RENDER CONDICIONAL
    // ========================================================================================
    if (!showVariables) return null;

    // Filtrar variables
    const filteredGroups = variableGroups
      .map((group) => ({
        ...group,
        variables: group.variables.filter(
          (variable) =>
            variable.toLowerCase().includes(searchFilter.toLowerCase()) ||
            (VARIABLE_CONFIG[variable]?.displayName || "")
              .toLowerCase()
              .includes(searchFilter.toLowerCase())
        ),
      }))
      .filter((group) => group.variables.length > 0);

    return (
      <div
        className={`border-b ${ANIMATION_CONFIG.transition} ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Settings className="h-6 w-6 text-blue-500" />
              <div>
                <h2 className="text-xl font-bold">
                  Variables Dinámicas del Sistema
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Gestiona variables para personalizar comandos automáticamente
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full text-sm">
                  {availableVariables.length} detectadas
                </span>
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-sm">
                  {Object.keys(VARIABLE_CONFIG).length} configuradas
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={copyAllVariables}
                className={`p-2 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400 ${ANIMATION_CONFIG.transition}`}
                title="Copiar todas las variables"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={exportVariables}
                className={`p-2 rounded-lg bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-600 dark:text-green-400 ${ANIMATION_CONFIG.transition}`}
                title="Exportar variables"
              >
                <Download className="h-4 w-4" />
              </button>
              <label
                className={`p-2 rounded-lg bg-purple-100 hover:bg-purple-200 dark:bg-purple-900 dark:hover:bg-purple-800 text-purple-600 dark:text-purple-400 ${ANIMATION_CONFIG.transition} cursor-pointer`}
              >
                <Upload className="h-4 w-4" />
                <input
                  type="file"
                  accept=".json"
                  onChange={importVariables}
                  className="hidden"
                />
              </label>
              <button
                onClick={resetToDefaults}
                className={`p-2 rounded-lg bg-orange-100 hover:bg-orange-200 dark:bg-orange-900 dark:hover:bg-orange-800 text-orange-600 dark:text-orange-400 ${ANIMATION_CONFIG.transition}`}
                title="Restablecer a valores por defecto"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Notification */}
          {notification && (
            <div
              className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${
                ANIMATION_CONFIG.transition
              } ${
                notification.type === "success"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : notification.type === "error"
                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              }`}
            >
              {notification.type === "success" && (
                <CheckCircle className="h-4 w-4" />
              )}
              {notification.type === "error" && (
                <AlertTriangle className="h-4 w-4" />
              )}
              {notification.type === "info" && <Info className="h-4 w-4" />}
              <span className="text-sm">{notification.message}</span>
              <button
                onClick={() => setNotification(null)}
                className="ml-auto p-1 hover:bg-black/10 rounded"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Presets and Search Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6 justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Buscar variables..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className={`w-full px-4 py-2 pl-10 rounded-lg border ${
                  ANIMATION_CONFIG.transition
                } ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Presets */}
            <div className="flex items-center space-x-3 justify-end">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Presets:
              </span>
              <select
                value={selectedPreset}
                onChange={(e) => e.target.value && applyPreset(e.target.value)}
                className={`px-3 py-2 rounded-lg border text-sm outline-none ${
                  ANIMATION_CONFIG.transition
                } ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="">Seleccionar preset...</option>
                {Object.entries(variablePresets).map(([key, preset]) => (
                  <option key={key} value={key}>
                    {preset.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Variable Groups */}
          <div className="space-y-6">
            {filteredGroups.map((group) => (
              <div
                key={group.key}
                className={`rounded-lg border ${ANIMATION_CONFIG.transition} ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <button
                  onClick={() => toggleSection(group.key)}
                  className={`w-full px-6 py-4 flex items-center justify-between text-left ${
                    ANIMATION_CONFIG.transition
                  } ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      style={{
                        color:
                          group.color === "yellow"
                            ? "#F59E0B"
                            : group.color === "blue"
                            ? "#3B82F6"
                            : group.color === "green"
                            ? "#10B981"
                            : group.color === "purple"
                            ? "#8B5CF6"
                            : group.color === "cyan"
                            ? "#06B6D4"
                            : "#EF4444",
                      }}
                    >
                      {group.icon}
                    </div>
                    <h3 className="font-semibold text-lg">{group.name}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        group.color === "yellow"
                          ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300"
                          : group.color === "blue"
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                          : group.color === "green"
                          ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                          : group.color === "purple"
                          ? "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
                          : group.color === "cyan"
                          ? "bg-cyan-100 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-300"
                          : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {group.variables.length}
                    </span>
                  </div>
                  {expandedSections[group.key] ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>

                {expandedSections[group.key] && (
                  <div className="px-6 pb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {group.variables.map((variable) =>
                        renderVariableInput(variable, group)
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredGroups.length === 0 && (
            <div className="text-center py-12">
              <Hash className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No se encontraron variables
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchFilter
                  ? "Intenta con otros términos de búsqueda"
                  : "No hay variables disponibles"}
              </p>
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter("")}
                  className={`inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-lg ${ANIMATION_CONFIG.transition}`}
                >
                  <X className="h-4 w-4" />
                  <span>Limpiar búsqueda</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

VariablesPanel.displayName = "VariablesPanel";

export default VariablesPanel;
