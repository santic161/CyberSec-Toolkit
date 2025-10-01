// ========================================================================================
// SECTIONCARD.TSX - COMPONENTE DE TARJETA DE SECCIÓN
// ========================================================================================
// Componente para mostrar cada sección principal del dashboard con estadísticas,
// categorías y acceso directo a las herramientas de cada sección.

import React, { memo } from 'react';
import { 
  ArrowRight, 
  Tag, 
  TrendingUp, 
  Activity,
  Layers,
  Star,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { ANIMATION_CONFIG } from '../constants';

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

interface SectionData {
  section: DashboardSection;
  tools: Tool[];
  count: number;
  categories: Record<string, number>;
}

interface SectionCardProps {
  sectionData: SectionData;
  isDarkMode: boolean;
  onSelect: () => void;
  getSectionColors: (sectionKey: string, isDark: boolean) => { bg: string; text: string } | null;
}

// ========================================================================================
// COMPONENTE PRINCIPAL
// ========================================================================================
const SectionCard: React.FC<SectionCardProps> = memo(({
  sectionData,
  isDarkMode,
  onSelect,
  getSectionColors
}) => {
  const { section, tools, count, categories } = sectionData;
  
  // Obtener las categorías más populares (top 5)
  const topCategories = Object.entries(categories)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([tag, count]) => ({ tag, count }));

  // Obtener algunos comandos de ejemplo (top 3)
  const exampleTools = tools.slice(0, 3);

  // Colores de la sección
  const sectionColors = {
    primary: section.color.primary,
    background: isDarkMode ? section.color.background.dark : section.color.background.light,
    text: isDarkMode ? section.color.text.dark : section.color.text.light
  };

  return (
    <div
      className={`group relative rounded-xl border-2 border-opacity-20 ${ANIMATION_CONFIG.transition} ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-600 hover:border-gray-500' 
          : 'bg-white border-gray-200 hover:border-gray-300'
      } ${ANIMATION_CONFIG.hover.shadow} ${ANIMATION_CONFIG.hover.scale} cursor-pointer overflow-hidden`}
      onClick={onSelect}
      style={{ 
        borderColor: `${section.color.primary}40`,
      }}
    >
      {/* Header Gradient */}
      <div 
        className={`h-2 w-full`}
        style={{ 
          background: `linear-gradient(90deg, ${section.color.primary}, ${section.color.secondary})` 
        }}
      />

      <div className="p-6">
        {/* Section Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* Icon */}
            <div 
              className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${sectionColors.background}`}
              style={{ 
                backgroundColor: `${section.color.primary}15`,
                color: section.color.primary 
              }}
            >
              {section.icon}
            </div>
            
            {/* Title and Description */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {section.displayName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {section.description}
              </p>
            </div>
          </div>

          {/* Arrow Icon */}
          <div className={`p-2 rounded-lg opacity-60 group-hover:opacity-100 ${ANIMATION_CONFIG.transition}`}>
            <ArrowRight 
              className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" 
              style={{ color: section.color.primary }}
            />
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {/* Tool Count */}
            <div className="flex items-center space-x-2">
              <div 
                className={`p-1.5 rounded ${sectionColors.background}`}
                style={{ 
                  backgroundColor: `${section.color.primary}10`,
                  color: section.color.primary 
                }}
              >
                <BarChart3 className="h-4 w-4" />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: section.color.primary }}>
                  {count}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">herramientas</div>
              </div>
            </div>

            {/* Categories Count */}
            <div className="flex items-center space-x-2">
              <div 
                className={`p-1.5 rounded ${sectionColors.background}`}
                style={{ 
                  backgroundColor: `${section.color.secondary}15`,
                  color: section.color.secondary 
                }}
              >
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: section.color.secondary }}>
                  {Object.keys(categories).length}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">categorías</div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Categories */}
        {topCategories.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold mb-3 flex items-center space-x-2">
              <Tag className="h-4 w-4" />
              <span>Categorías Principales</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {topCategories.map(({ tag, count: tagCount }) => (
                <div
                  key={tag}
                  className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                  style={{ 
                    backgroundColor: `${section.color.primary}10`,
                    color: section.color.primary 
                  }}
                >
                  <span>{tag}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                    isDarkMode ? 'bg-gray-600' : 'bg-white'
                  }`}>
                    {tagCount}
                  </span>
                </div>
              ))}
              {Object.keys(categories).length > 5 && (
                <div className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                  +{Object.keys(categories).length - 5} más
                </div>
              )}
            </div>
          </div>
        )}

        {/* Example Tools Preview */}
        {exampleTools.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-3 flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Herramientas Destacadas</span>
            </h4>
            <div className="space-y-2">
              {exampleTools.map((tool, index) => (
                <div
                  key={index}
                  className={`p-2 rounded border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-gray-50 border-gray-200'
                  } ${ANIMATION_CONFIG.transition} hover:border-opacity-70`}
                  style={{ borderColor: `${section.color.primary}30` }}
                >
                  <div className="text-sm font-medium mb-1">{tool.Command}</div>
                  <div className={`text-xs font-mono ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  } truncate`}>
                    {tool.Cmd.length > 60 ? `${tool.Cmd.substring(0, 60)}...` : tool.Cmd}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Explorar {section.displayName.toLowerCase()}
          </div>
          <div className="flex items-center space-x-1 text-sm font-medium group-hover:translate-x-1 transition-transform" style={{ color: section.color.primary }}>
            <span>Ver todas</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Hover Overlay Effect */}
      <div 
        className={`absolute inset-0 opacity-0 group-hover:opacity-5 ${ANIMATION_CONFIG.transition} pointer-events-none`}
        style={{ backgroundColor: section.color.primary }}
      />
    </div>
  );
});

SectionCard.displayName = 'SectionCard';

export default SectionCard;