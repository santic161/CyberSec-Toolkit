// ========================================================================================
// SMARTSEARCHBAR.TSX - BUSCADOR INTELIGENTE CON SUGERENCIAS DE TAGS
// ========================================================================================
// Componente avanzado de búsqueda que sugiere tags dinámicamente basado en el contexto
// actual, sección seleccionada y permite filtrado inteligente por tags.

import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { 
  Search, 
  X, 
  Tag, 
  ChevronDown,
  Filter,
  Hash,
  ArrowRight,
  Zap
} from 'lucide-react';
import { ANIMATION_CONFIG, UI_TEXTS, DASHBOARD_SECTIONS, getTagSection } from '../constants';

// ========================================================================================
// INTERFACES
// ========================================================================================
interface Tool {
  Command: string;
  Cmd: string;
  Tags: string;
  Page?: string;
}

interface DashboardSection {
  key: string;
  displayName: string;
  description: string;
  icon: string;
  tags: string[];
  color: any;
  priority: number;
}

interface SectionData {
  section: DashboardSection;
  tools: Tool[];
  count: number;
  categories: Record<string, number>;
}

interface SmartSearchBarProps {
  isDarkMode: boolean;
  globalSearch: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTagSelect: (tag: string) => void;
  allTags: string[];
  selectedSection: string | null;
  sectionData: SectionData[];
}

interface TagSuggestion {
  tag: string;
  count: number;
  section?: string;
  category?: string;
  relevance: number;
}

// ========================================================================================
// COMPONENTE PRINCIPAL
// ========================================================================================
const SmartSearchBar: React.FC<SmartSearchBarProps> = memo(({
  isDarkMode,
  globalSearch,
  onSearchChange,
  onTagSelect,
  allTags,
  selectedSection,
  sectionData
}) => {
  // ========================================================================================
  // ESTADO LOCAL
  // ========================================================================================
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [inputFocused, setInputFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // ========================================================================================
  // PROCESAMIENTO DE SUGERENCIAS DINÁMICAS
  // ========================================================================================
  const tagSuggestions = useMemo((): TagSuggestion[] => {
    if (!globalSearch || globalSearch.length < 1) {
      // Si no hay búsqueda, mostrar tags populares de la sección actual
      if (selectedSection) {
        const currentSectionData = sectionData.find(s => s.section.key === selectedSection);
        if (currentSectionData) {
          return Object.entries(currentSectionData.categories)
            .map(([tag, count]) => ({
              tag,
              count,
              section: selectedSection,
              category: 'current-section',
              relevance: count
            }))
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, 8);
        }
      }
      
      // Tags más populares globalmente
      const tagCounts: Record<string, number> = {};
      sectionData.forEach(sectionData => {
        Object.entries(sectionData.categories).forEach(([tag, count]) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + count;
        });
      });
      
      return Object.entries(tagCounts)
        .map(([tag, count]) => ({
          tag,
          count,
          section: getTagSection(tag) || undefined,
          category: 'popular',
          relevance: count
        }))
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, 10);
    }

    const searchTerm = globalSearch.toLowerCase();
    const suggestions: TagSuggestion[] = [];
    
    // Buscar tags que coincidan con el término de búsqueda
    allTags.forEach(tag => {
      const tagLower = tag.toLowerCase();
      let relevance = 0;
      
      // Coincidencia exacta al inicio (mayor relevancia)
      if (tagLower.startsWith(searchTerm)) {
        relevance += 100;
      }
      // Coincidencia parcial
      else if (tagLower.includes(searchTerm)) {
        relevance += 50;
      }
      // Coincidencia difusa (por palabras)
      else {
        const searchWords = searchTerm.split(' ');
        const tagWords = tagLower.split(' ');
        const matchingWords = searchWords.filter(word => 
          tagWords.some(tagWord => tagWord.includes(word))
        );
        if (matchingWords.length > 0) {
          relevance += matchingWords.length * 25;
        }
      }
      
      if (relevance > 0) {
        // Obtener count del tag en la sección actual o globalmente
        let count = 0;
        const tagSection = getTagSection(tag);
        
        if (selectedSection) {
          const currentSectionData = sectionData.find(s => s.section.key === selectedSection);
          count = currentSectionData?.categories[tag] || 0;
        }
        
        if (count === 0) {
          // Buscar en todas las secciones
          sectionData.forEach(sd => {
            count += sd.categories[tag] || 0;
          });
        }
        
        // Boost relevance based on count
        relevance += Math.log(count + 1) * 10;
        
        suggestions.push({
          tag,
          count,
          section: tagSection || undefined,
          category: selectedSection && tagSection === selectedSection ? 'current-section' : 'other-section',
          relevance
        });
      }
    });
    
    return suggestions
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 8);
  }, [globalSearch, allTags, selectedSection, sectionData]);

  // ========================================================================================
  // MANEJADORES DE EVENTOS
  // ========================================================================================
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || tagSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < tagSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : tagSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < tagSuggestions.length) {
          const selectedTag = tagSuggestions[highlightedIndex];
          onTagSelect(selectedTag.tag);
          setShowSuggestions(false);
          setHighlightedIndex(-1);
          // Limpiar búsqueda después de seleccionar tag
          onSearchChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        searchInputRef.current?.blur();
        break;
    }
  }, [showSuggestions, tagSuggestions, highlightedIndex, onTagSelect, onSearchChange]);

  const handleSuggestionClick = useCallback((suggestion: TagSuggestion) => {
    onTagSelect(suggestion.tag);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    // Limpiar búsqueda después de seleccionar tag
    onSearchChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
  }, [onTagSelect, onSearchChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e);
    setShowSuggestions(true);
    setHighlightedIndex(-1);
  }, [onSearchChange]);

  const handleInputFocus = useCallback(() => {
    setInputFocused(true);
    setShowSuggestions(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setInputFocused(false);
    // Delay para permitir clicks en sugerencias
    setTimeout(() => {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }, 200);
  }, []);

  const handleClearSearch = useCallback(() => {
    onSearchChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    searchInputRef.current?.focus();
  }, [onSearchChange]);

  // ========================================================================================
  // EFECTOS
  // ========================================================================================
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ========================================================================================
  // FUNCIONES AUXILIARES
  // ========================================================================================
  const getSuggestionIcon = (suggestion: TagSuggestion) => {
    if (suggestion.category === 'current-section') {
      return <Zap className="h-3 w-3 text-yellow-500" />;
    }
    if (suggestion.section) {
      const sectionConfig = DASHBOARD_SECTIONS[suggestion.section];
      if (sectionConfig) {
        return <span className="text-xs">{sectionConfig.icon}</span>;
      }
    }
    return <Tag className="h-3 w-3" />;
  };

  const getSuggestionColors = (suggestion: TagSuggestion) => {
    if (suggestion.category === 'current-section') {
      return {
        bg: isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-50',
        text: isDarkMode ? 'text-yellow-300' : 'text-yellow-700',
        border: 'border-yellow-500/30'
      };
    }
    
    if (suggestion.section && DASHBOARD_SECTIONS[suggestion.section]) {
      const sectionConfig = DASHBOARD_SECTIONS[suggestion.section];
      return {
        bg: isDarkMode ? sectionConfig.color.background.dark : sectionConfig.color.background.light,
        text: isDarkMode ? sectionConfig.color.text.dark : sectionConfig.color.text.light,
        border: `border-[${sectionConfig.color.primary}]/30`
      };
    }

    return {
      bg: isDarkMode ? 'bg-gray-700' : 'bg-gray-50',
      text: isDarkMode ? 'text-gray-300' : 'text-gray-700',
      border: 'border-gray-300'
    };
  };

  // ========================================================================================
  // RENDER
  // ========================================================================================
  return (
    <div className="relative flex-1 max-w-lg">
      {/* Input Principal */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          ref={searchInputRef}
          type="text"
          placeholder={selectedSection 
            ? `Buscar en ${DASHBOARD_SECTIONS[selectedSection]?.displayName || 'sección'}...`
            : UI_TEXTS.navigation.search
          }
          value={globalSearch}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className={`w-full pl-10 pr-12 py-3 rounded-lg border ${ANIMATION_CONFIG.transition} ${
            isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
          } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            showSuggestions ? 'rounded-b-none' : ''
          }`}
        />
        
        {/* Indicador de sugerencias / Clear button */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {globalSearch && (
            <button
              onClick={handleClearSearch}
              className={`p-1 rounded text-gray-400 hover:text-gray-600 ${ANIMATION_CONFIG.transition}`}
              title="Limpiar búsqueda"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {tagSuggestions.length > 0 && (inputFocused || showSuggestions) && (
            <div className={`p-1 rounded ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} title="Sugerencias disponibles">
              <ChevronDown className={`h-4 w-4 ${ANIMATION_CONFIG.transition} ${
                showSuggestions ? 'rotate-180' : ''
              }`} />
            </div>
          )}
        </div>
      </div>

      {/* Panel de Sugerencias */}
      {showSuggestions && tagSuggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className={`absolute top-full left-0 right-0 z-50 border border-t-0 rounded-b-lg shadow-lg max-h-80 overflow-y-auto ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600' 
              : 'bg-white border-gray-300'
          }`}
        >
          {/* Header de sugerencias */}
          <div className={`px-3 py-2 border-b text-xs font-medium flex items-center justify-between ${
            isDarkMode 
              ? 'border-gray-600 text-gray-400 bg-gray-750' 
              : 'border-gray-200 text-gray-500 bg-gray-50'
          }`}>
            <div className="flex items-center space-x-1">
              <Filter className="h-3 w-3" />
              <span>
                {globalSearch 
                  ? `${tagSuggestions.length} tags encontrados`
                  : selectedSection 
                    ? 'Tags populares en sección'
                    : 'Tags más utilizados'
                }
              </span>
            </div>
            <div className="text-xs text-gray-400">
              ↑↓ Navegar • Enter Seleccionar • Esc Cerrar
            </div>
          </div>

          {/* Lista de sugerencias */}
          <div className="py-1">
            {tagSuggestions.map((suggestion, index) => {
              const colors = getSuggestionColors(suggestion);
              const isHighlighted = index === highlightedIndex;
              
              return (
                <button
                  key={suggestion.tag}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full px-3 py-2 flex items-center justify-between text-left ${ANIMATION_CONFIG.transition} ${
                    isHighlighted 
                      ? `${colors.bg} ${colors.text} ${colors.border} border-l-4` 
                      : `hover:${colors.bg} ${
                          isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50'
                        }`
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      {getSuggestionIcon(suggestion)}
                    </div>
                    
                    {/* Tag name con highlight */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {globalSearch ? (
                          <span>
                            {suggestion.tag.split(new RegExp(`(${globalSearch})`, 'gi')).map((part, i) => (
                              <span
                                key={i}
                                className={part.toLowerCase() === globalSearch.toLowerCase() 
                                  ? 'bg-yellow-300 dark:bg-yellow-700 text-gray-900 dark:text-gray-100' 
                                  : ''
                                }
                              >
                                {part}
                              </span>
                            ))}
                          </span>
                        ) : (
                          suggestion.tag
                        )}
                      </div>
                      
                      {/* Context info */}
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                        {suggestion.section && (
                          <span>
                            {DASHBOARD_SECTIONS[suggestion.section]?.displayName || suggestion.section}
                          </span>
                        )}
                        {suggestion.count > 0 && (
                          <span>• {suggestion.count} comandos</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Arrow indicator */}
                  <div className="flex-shrink-0 ml-2">
                    <ArrowRight className={`h-3 w-3 text-gray-400 ${
                      isHighlighted ? 'text-current' : ''
                    }`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer con instrucciones */}
          {tagSuggestions.length > 5 && (
            <div className={`px-3 py-2 border-t text-xs ${
              isDarkMode 
                ? 'border-gray-600 text-gray-500 bg-gray-750' 
                : 'border-gray-200 text-gray-400 bg-gray-50'
            }`}>
              <div className="flex items-center justify-between">
                <span>Mostrando los {tagSuggestions.length} tags más relevantes</span>
                <span>Escribe para refinar búsqueda</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

SmartSearchBar.displayName = 'SmartSearchBar';

export default SmartSearchBar;