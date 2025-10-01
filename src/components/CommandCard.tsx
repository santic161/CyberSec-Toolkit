// ========================================================================================
// COMMANDCARD.TSX - COMPONENTE MEJORADO DE TARJETA DE COMANDO
// ========================================================================================
// Componente profesional para mostrar comandos individuales con soporte para tags
// clickeables, variables dinámicas y diferentes modos de vista.

import React, { memo, useState, useCallback } from "react";
import {
  Copy,
  ExternalLink,
  Tag,
  Terminal,
  CheckCircle,
  Clock,
  Code2,
  Zap,
  Hash,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
} from "lucide-react";
import { ANIMATION_CONFIG } from "../constants";

// ========================================================================================
// INTERFACES
// ========================================================================================
interface Tool {
  Command: string;
  Cmd: string;
  Tags: string;
  Page?: string;
}

interface CommandCardProps {
  item: Tool;
  isDarkMode: boolean;
  viewMode: "grid" | "list";
  replaceVariables: (command: string) => string;
  copyToClipboard: (text: string) => Promise<void>;
  getCategoryColors: (
    categoryKey: string,
    isDark: boolean
  ) => { bg: string; text: string };
  onTagClick?: (tag: string) => void;
  selectedTag?: string;
}

// ========================================================================================
// COMPONENTE PRINCIPAL
// ========================================================================================
const CommandCard: React.FC<CommandCardProps> = memo(
  ({
    item,
    isDarkMode,
    viewMode,
    replaceVariables,
    copyToClipboard,
    getCategoryColors,
    onTagClick,
    selectedTag,
  }) => {
    const [copied, setCopied] = useState(false);
    const [showFullCommand, setShowFullCommand] = useState(false);
    const [showOriginalCommand, setShowOriginalCommand] = useState(false);

    const tags = item.Tags.split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    const processedCommand = replaceVariables(item.Cmd);

    // Detectar si hay variables en el comando
    const hasVariables = /\[([A-Z_]+)\]/g.test(item.Cmd);
    const variableCount = (item.Cmd.match(/\[([A-Z_]+)\]/g) || []).length;
    const isCommandDifferent = processedCommand !== item.Cmd;

    // Manejar copia con feedback visual
    const handleCopy = useCallback(async () => {
      await copyToClipboard(processedCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }, [copyToClipboard, processedCommand]);

    // Manejar click en tag
    const handleTagClick = useCallback(
      (tag: string, event: React.MouseEvent) => {
        event.stopPropagation();
        if (onTagClick) {
          onTagClick(tag);
        }
      },
      [onTagClick]
    );

    // Truncar comando largo para vista previa
    const shouldTruncateCommand = processedCommand.length > 100;
    const displayCommand =
      showFullCommand || !shouldTruncateCommand
        ? showOriginalCommand
          ? item.Cmd
          : processedCommand
        : `${processedCommand.substring(0, 100)}...`;

    // ========================================================================================
    // VISTA DE LISTA
    // ========================================================================================
    if (viewMode === "list") {
      return (
        <div
          className={`group p-6 rounded-lg border ${
            ANIMATION_CONFIG.transition
          } ${ANIMATION_CONFIG.hover.shadow} ${
            isDarkMode
              ? "bg-gray-800 border-gray-700 hover:border-gray-600"
              : "bg-white border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              {/* Header con título y estadísticas */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.Command}
                  </h3>
                  {/* <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                    {hasVariables && (
                      <div className="flex items-center space-x-1">
                        <Zap className="h-3 w-3 text-yellow-500" />
                        <span>{variableCount} variables</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Hash className="h-3 w-3" />
                      <span>{tags.length} tags</span>
                    </div>
                    {item.Page && (
                      <div className="flex items-center space-x-1">
                        <ExternalLink className="h-3 w-3" />
                        <span>docs</span>
                      </div>
                    )}
                  </div> */}
                </div>
              </div>

              {/* Comando */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Terminal className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Comando:
                    </span>
                    {isCommandDifferent && (
                      <button
                        onClick={() =>
                          setShowOriginalCommand(!showOriginalCommand)
                        }
                        className={`flex items-center space-x-1 text-xs px-2 py-1 rounded ${
                          showOriginalCommand
                            ? "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400"
                            : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                        } ${ANIMATION_CONFIG.transition}`}
                        title={
                          showOriginalCommand
                            ? "Ver comando procesado"
                            : "Ver comando original"
                        }
                      >
                        {showOriginalCommand ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                        <span>
                          {showOriginalCommand ? "Original" : "Procesado"}
                        </span>
                      </button>
                    )}
                  </div>
                  {shouldTruncateCommand && (
                    <button
                      onClick={() => setShowFullCommand(!showFullCommand)}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
                    >
                      {showFullCommand ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                      <span>{showFullCommand ? "Menos" : "Más"}</span>
                    </button>
                  )}
                </div>
                <div
                  className={`p-4 rounded-lg font-mono text-sm overflow-x-auto ${
                    isDarkMode
                      ? "bg-gray-900 text-green-400"
                      : "bg-gray-100 text-gray-800"
                  } border ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <code className="whitespace-pre-wrap break-all">
                    {displayCommand}
                  </code>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, tagIndex) => {
                  const colors = getCategoryColors(
                    tag.toLowerCase(),
                    isDarkMode
                  );
                  const isSelected = selectedTag === tag;
                  return (
                    <button
                      key={tagIndex}
                      onClick={(e) => handleTagClick(tag, e)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ANIMATION_CONFIG.transition
                      } hover:scale-105 ${
                        isSelected
                          ? "ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-800"
                          : ""
                      } ${colors.bg} ${colors.text}`}
                    >
                      <Tag className="inline h-3 w-3 mr-1" />
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Acciones */}
            <div className="flex items-start space-x-2 ml-6">
              <button
                onClick={handleCopy}
                className={`p-2 rounded-lg ${ANIMATION_CONFIG.transition} ${
                  copied
                    ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                    : "bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400"
                }`}
                title={copied ? "¡Copiado!" : "Copiar comando"}
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
              {item.Page && (
                <a
                  href={item.Page}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 ${ANIMATION_CONFIG.transition}`}
                  title="Abrir documentación"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      );
    }

    // ========================================================================================
    // VISTA DE GRILLA (TARJETA COMPACTA) - LAYOUT UNIFORME
    // ========================================================================================
    return (
      <div
        className={`group rounded-lg border ${ANIMATION_CONFIG.transition} ${
          ANIMATION_CONFIG.hover.shadow
        } ${ANIMATION_CONFIG.hover.scale} ${
          isDarkMode
            ? "bg-gray-800 border-gray-700 hover:border-gray-600"
            : "bg-white border-gray-200 hover:border-gray-300"
        } flex flex-col h-full`}
        onMouseEnter={() => setShowFullCommand(true)}
        onMouseLeave={() => setShowFullCommand(false)}
      >
        {/* Contenido Principal - Flex grow para ocupar espacio disponible */}
        <div className="flex-1 p-6 flex flex-col">
          {/* Header - Altura fija */}
          <div className="flex items-start justify-between mb-4">
            <div className="min-w-0 pr-4">
              <h3
                className="text-lg font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: showFullCommand ? 2 : 1,
                  WebkitBoxOrient: "vertical",
                  overflow: showFullCommand ? "visible" : "hidden",
                }}
              >
                {item.Command}
              </h3>
              {/* <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                {hasVariables && (
                  <div className="flex items-center space-x-1">
                    <Zap className="h-3 w-3 text-yellow-500" />
                    <span>{variableCount}v</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Hash className="h-3 w-3" />
                  <span>{tags.length}t</span>
                </div>
                {item.Page && (
                  <div className="flex items-center space-x-1 text-blue-500">
                    <ExternalLink className="h-3 w-3" />
                    <span>docs</span>
                  </div>
                )}
              </div> */}
            </div>
            <Terminal className="h-5 w-5 text-gray-400 flex-shrink-0" />
          </div>

          {/* Comando - Área que se expande */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              {shouldTruncateCommand && (
                <button
                  onClick={() => setShowFullCommand(!showFullCommand)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1 ml-auto"
                >
                  {showFullCommand ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                  <span>{showFullCommand ? "Menos" : "Más"}</span>
                </button>
              )}
            </div>
            <div
              className={`p-3 rounded-lg font-mono text-sm overflow-hidden ${
                isDarkMode
                  ? "bg-gray-900 text-green-400"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <code
                className="whitespace-pre-wrap break-all text-xs leading-relaxed outline-none"
                style={
                  !showFullCommand && shouldTruncateCommand
                    ? {
                        display: "-webkit-box",
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        outline: "none"
                      }
                    : {}
                }
                spellCheck={false}
                contentEditable={true}
              >
                ~$ {displayCommand}
              </code>
            </div>
          </div>

          {/* Tags - Altura controlada */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag, tagIndex) => {
                const colors = getCategoryColors(tag.toLowerCase(), isDarkMode);
                const isSelected = selectedTag === tag;
                return (
                  <button
                    key={tagIndex}
                    onClick={(e) => handleTagClick(tag, e)}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ANIMATION_CONFIG.transition
                    } hover:scale-105 ${
                      isSelected
                        ? "ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-800"
                        : ""
                    } ${colors.bg} ${colors.text}`}
                  >
                    <Tag className="inline h-3 w-3 mr-1" />
                    {tag}
                  </button>
                );
              })}
              {tags.length > 3 && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  +{tags.length - 3} más
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer fijo - Siempre en la parte inferior */}
        <div className="p-6 pt-0 mt-auto">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <button
                onClick={handleCopy}
                className={`px-3 py-2 rounded-lg ${
                  ANIMATION_CONFIG.transition
                } text-sm font-medium flex items-center space-x-1 ${
                  copied
                    ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                    : "bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400"
                }`}
              >
                {copied ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                <span>{copied ? "¡Copiado!" : "Copiar"}</span>
              </button>
              {item.Page && (
                <a
                  href={item.Page}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 ${ANIMATION_CONFIG.transition} text-sm font-medium flex items-center space-x-1`}
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Docs</span>
                </a>
              )}
            </div>

            {/* Indicadores de estado */}
            {isCommandDifferent && (
              <button
                onClick={() => setShowOriginalCommand(!showOriginalCommand)}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1 ${
                  showOriginalCommand
                    ? "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400"
                    : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                } ${ANIMATION_CONFIG.transition}`}
              >
                {showOriginalCommand ? (
                  <EyeOff className="h-3 w-3" />
                ) : (
                  <Eye className="h-3 w-3" />
                )}
                <span>{showOriginalCommand ? "Original" : "Procesado"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

CommandCard.displayName = "CommandCard";

export default CommandCard;
