import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, RefreshCw, Download, Calendar, TrendingUp, BarChart3, Moon, Sun, FileText, X, Shield, ShieldCheck, Wrench, Settings, Database, Network, Lock, Unlock, ChevronLeft, Settings2 } from 'lucide-react';
import { API_CONFIG, CACHE_CONFIG, INDEX_JSON_PATH, DOCS_PATH, TAG_CATEGORIES } from './constants';
import Papa from 'papaparse';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Header from './components/Header';
import VariablesPanel from './components/VariablesPanel';

const Dashboard = () => {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [commandVariables, setCommandVariables] = useState<Record<string, string>>({
    IP: '10.10.10.1',
    DOMAIN: 'Santic.htb',
    USER: 'Santino',
    PASSWORD: 'SuperSecret',
    USER_WORDLIST_PATH: '/usr/share/wordlists/rockyou.txt',
    DCIP: '10.10.10.1'
  });
  const [editingCommand, setEditingCommand] = useState<string | null>(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [searchInNavbar, setSearchInNavbar] = useState(false);
  const [showVariables, setShowVariables] = useState(true);
  const [lateralWindowOpen, setLateralWindowOpen] = useState(false);
  const [lateralWindowContent, setLateralWindowContent] = useState<string>('');
  const [lateralWindowTitle, setLateralWindowTitle] = useState<string>('');
  const [docIndex, setDocIndex] = useState<Array<string | { filename: string; title?: string }> | null>(null);
  const [csvUrl, setCsvUrl] = useState<string>('');


  // Configuration from constants
  const config = {
    ...CACHE_CONFIG,
    cacheKey: `${CACHE_CONFIG.cacheKeyPrefix}data`
  };

  // Fetch CSV data with caching and error handling
  const fetchCSVData = async (useCache = true) => {
    try {
      setLoading(true);
      setError(null);

      // Wait for CSV URL to be loaded
      if (!csvUrl) {
        setLoading(false);
        return;
      }

      // Check cache first
      if (useCache) {
        const cached = localStorage.getItem(config.cacheKey);
        const cacheTimestamp = localStorage.getItem(`${config.cacheKey}_timestamp`);
        
        if (cached && cacheTimestamp) {
          const cacheAge = Date.now() - parseInt(cacheTimestamp);
          if (cacheAge < config.refreshInterval) {
            const cachedData = JSON.parse(cached);
            setData(cachedData);
            setFilteredData(cachedData);
            setLastUpdated(new Date(parseInt(cacheTimestamp)));
            setLoading(false);
            return;
          }
        }
      }

      // Fetch local CSV file
          const response = await fetch(csvUrl, {
        method: 'GET',
            cache: 'no-cache',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
        }
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const csvText = await response.text();
          
      // Parse CSV data
          Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (header) => header.trim(),
            transform: (value) => value.trim(),
            complete: (results) => {
              if (results.errors.length > 0) {
                console.warn('CSV parsing warnings:', results.errors);
              }
              
              const processedData = results.data.filter(row => 
                Object.values(row).some(value => value && value.toString().trim())
              );
              
              setData(processedData);
              setFilteredData(processedData);
              
              // Cache the data
              const timestamp = Date.now();
              localStorage.setItem(config.cacheKey, JSON.stringify(processedData));
              localStorage.setItem(`${config.cacheKey}_timestamp`, timestamp.toString());
              setLastUpdated(new Date(timestamp));
            },
            error: (error) => {
              throw new Error(`CSV parsing error: ${error.message}`);
            }
          });
    } catch (err) {
      console.error('Failed to fetch CSV data:', err);
      setError(`Failed to load data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Initialize data loading and setup auto-refresh
  useEffect(() => {
    if (csvUrl) {
      fetchCSVData();
      const interval = setInterval(() => fetchCSVData(), config.refreshInterval);
      return () => clearInterval(interval);
    }
  }, [csvUrl]);

  // Load dynamic documentation index and find CSV
  useEffect(() => {
    const loadDocIndex = async () => {
      try {
        const response = await fetch(INDEX_JSON_PATH, API_CONFIG);
        if (!response.ok) return;
        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          // Probably SPA fallback served index.html
          console.warn('index.json did not return JSON. Got', contentType);
          setDocIndex([]);
          return;
        }
        const json = await response.json();
        if (Array.isArray(json)) {
          const docIndexData = json as Array<string | { filename: string; title?: string }>;
          setDocIndex(docIndexData);
          
          // Find CSV file dynamically
          const csvFile = docIndexData.find(entry => {
            const filename = typeof entry === 'string' ? entry : entry.filename;
            return filename && filename.toLowerCase().endsWith('.csv');
          });
          
          if (csvFile) {
            const csvFilename = typeof csvFile === 'string' ? csvFile : csvFile.filename;
            setCsvUrl(`${DOCS_PATH}/${csvFilename}`);
          } else {
            console.warn('No CSV file found in index.json');
          }
        } else {
          setDocIndex([]);
        }
      } catch (e) {
        setDocIndex([]);
      }
    };
    loadDocIndex();
  }, []);

  // Get column headers
  const columns = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).filter(key => key.trim());
  }, [data]);

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, any> = {
      'Authenticated': ShieldCheck,
      'Unauthenticated': Shield,
      'Enum4Linux': Network,
      'Netexec': Wrench,
      'BloodHound': Database,
      'SMBMap': Settings,
      'Crackmapexec': Wrench,
      'Enumeration': Search,
      'Brute-Forcing': Lock,
      'Password Spraying': Unlock,
      'SMB': Network,
      'Tools': Wrench,
      'General': Settings
    };
    return iconMap[category] || BarChart3;
  };

  // Extract unique tags dynamically
  const allTags = useMemo(() => {
    if (data.length === 0) return [] as string[];
    const tagSet = new Set<string>();
    data.forEach(row => {
      if (row.Tags) {
        const tags = row.Tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag);
        tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }, [data]);

  // Group tags for separate sections (dynamic by intersection)
  const groupedTags = useMemo(() => {
    const { attackTypes: attackTypeList, tools: toolsList, general: generalList } = TAG_CATEGORIES;

    const attackTypes = allTags.filter(t => attackTypeList.includes(t));
    const tools = allTags.filter(t => toolsList.includes(t));
    const general = allTags.filter(t => generalList.includes(t));
    const known = new Set([...attackTypes, ...tools, ...general]);
    const others = allTags.filter(t => !known.has(t));

    return { attackTypes, tools, general, others };
  }, [allTags]);

  // Get data filtered by selected tag and search
  const tagFilteredData = useMemo(() => {
    if (!selectedTag) return [];
    
    let filtered = data.filter(row => 
      row.Tags && row.Tags.split(',').map((tag: string) => tag.trim()).includes(selectedTag)
    );
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    return filtered;
  }, [data, selectedTag, searchTerm]);

  // Extract variables from command string (including combined variables like [IP/DOMAIN])
  const extractVariables = (command: string): string[] => {
    const matches = command.match(/\[([^\]]+)\]/g);
    if (!matches) return [];
    
    const variables: string[] = [];
    matches.forEach(match => {
      const content = match.slice(1, -1); // Remove brackets
      if (content.includes('/')) {
        // Handle combined variables like [IP/DOMAIN]
        const options = content.split('/');
        variables.push(...options);
      } else {
        variables.push(content);
      }
    });
    
    return [...new Set(variables)]; // Remove duplicates
  };

  // Replace variables in command with user input values
  const processCommand = (command: string): string => {
    let processedCommand = command;
    
    // Handle combined variables first (like [IP/DOMAIN])
    const combinedMatches = command.match(/\[([^/\]]+\/[^\]]+)\]/g);
    if (combinedMatches) {
      combinedMatches.forEach(match => {
        const content = match.slice(1, -1);
        const [firstOption, secondOption] = content.split('/');
        
        // Use first option if available, otherwise second option
        const value = commandVariables[firstOption] || commandVariables[secondOption] || match;
        processedCommand = processedCommand.replace(match, value);
      });
    }
    
    // Handle regular variables
    Object.entries(commandVariables).forEach(([variable, value]) => {
      const regex = new RegExp(`\\[${variable}\\]`, 'g');
      processedCommand = processedCommand.replace(regex, value);
    });
    
    return processedCommand;
  };

  // Handle search and filtering
  useEffect(() => {
    let filtered = [...data];

    // Apply text search
    if (searchTerm) {
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply column filters
    if (selectedColumns.length > 0) {
      // This is a basic implementation - can be extended for complex filtering
      filtered = filtered.filter(row =>
        selectedColumns.every(col => row[col] && row[col].toString().trim())
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key!] || '';
        const bVal = b[sortConfig.key!] || '';
        
        // Try numeric comparison first
        const aNum = parseFloat(aVal);
        const bNum = parseFloat(bVal);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
        }
        
        // Fall back to string comparison
        const comparison = aVal.toString().localeCompare(bVal.toString());
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }

    setFilteredData(filtered);
  }, [data, searchTerm, selectedColumns, sortConfig]);

  // Handle column sort
  const handleSort = (column) => {
    setSortConfig(prev => ({
      key: column,
      direction: prev.key === column && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Export filtered data
  const exportData = () => {
    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `exported_data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy command to clipboard
  const copyCommand = async (command: string) => {
    try {
      const processedCmd = processCommand(command);
      await navigator.clipboard.writeText(processedCmd);
      console.log('Command copied to clipboard:', processedCmd);
    } catch (err) {
      console.error('Failed to copy command:', err);
    }
  };

  // Update variable value
  const updateVariable = (variable: string, value: string) => {
    setCommandVariables(prev => ({
      ...prev,
      [variable]: value
    }));
  };


  // Open lateral window with markdown content (dynamic resolution)
  const openLateralWindow = async (command: string) => {
    try {
      // Ensure doc index is loaded
      let files = docIndex;
      if (!files) {
        try {
          const resp = await fetch(INDEX_JSON_PATH, API_CONFIG);
          const contentType = resp.headers.get('content-type') || '';
          if (!contentType.includes('application/json')) {
            files = [];
          } else {
            const json = await resp.json();
            files = Array.isArray(json) ? (json as Array<string | { filename: string; title?: string }>) : [];
          }
          setDocIndex(files);
        } catch {
          files = [];
        }
      }

      // Resolve by title or filename starting with command
      let filename: string | undefined;
      for (const entry of files || []) {
        if (typeof entry === 'string') {
          const f = entry;
          if (f.toLowerCase().startsWith(command.toLowerCase()) && f.toLowerCase().endsWith('.md')) {
            filename = f;
            break;
          }
        } else if (entry && typeof entry === 'object') {
          const t = (entry.title || '').toLowerCase();
          const f = (entry.filename || '').toLowerCase();
          if ((t && t === command.toLowerCase()) || (f && f.startsWith(command.toLowerCase()))) {
            filename = entry.filename;
            break;
          }
        }
      }
      if (!filename) {
        console.error('No documentation file found for command:', command);
        return;
      }

      const response = await fetch(`${DOCS_PATH}/${filename}`, API_CONFIG);
      if (response.ok) {
        let content = await response.text();

        // Remove Cmd line completely
        content = content.replace(/^Cmd: .+$/gm, '');

        // Add tags styling - fix the regex to handle the actual format
        content = content.replace(/^Tags: (.+)$/gm, (match, tags) => {
          const cleanTags = tags.replace(/,,+/g, ',').replace(/^,|,$/g, '');
          const tagList = cleanTags.split(',').map((tag: string) => tag.trim()).filter(tag => tag && tag !== '');
          if (tagList.length === 0) return '';
          const tagListMarkdown = tagList.map(tag => `- ${tag}`).join('\n');
          return `**Tags:**\n${tagListMarkdown}`;
        });
        // Remove Page line completely
        content = content.replace(/^Page: .+$/gm, '');
        const title = command;
        setLateralWindowContent(content);
        setLateralWindowTitle(title);
        setLateralWindowOpen(true);
      }
    } catch (error) {
      console.error('Failed to load markdown file:', error);
    }
  };

  // Get basic statistics
  const stats = useMemo(() => {
    if (filteredData.length === 0) return null;
    
    return {
      totalRows: filteredData.length,
      totalColumns: columns.length,
      lastModified: lastUpdated,
      numericColumns: columns.filter(col => 
        filteredData.some(row => !isNaN(parseFloat(row[col])))
      ).length
    };
  }, [filteredData, columns, lastUpdated]);

  if (loading && data.length === 0) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center max-w-md mx-auto p-6">
          <div className={`${isDarkMode ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200'} border rounded-lg p-4`}>
            <h2 className={`${isDarkMode ? 'text-red-200' : 'text-red-800'} font-semibold mb-2`}>Error Loading Data</h2>
            <p className={`${isDarkMode ? 'text-red-300' : 'text-red-600'} text-sm mb-4`}>{error}</p>
            <button
              onClick={() => fetchCSVData(false)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        selectedTag={selectedTag}
        searchInNavbar={searchInNavbar}
        setSearchInNavbar={setSearchInNavbar}
        globalSearch={globalSearch}
        setGlobalSearch={setGlobalSearch}
        showVariables={showVariables}
        setShowVariables={setShowVariables}
        title="AD Cheatsheet"
      />

      <VariablesPanel
        isDarkMode={isDarkMode}
        showVariables={showVariables}
        commandVariables={commandVariables}
        setCommandVariables={setCommandVariables}
        updateVariable={updateVariable}
      />



      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {globalSearch ? (
          /* Global Search Results */
          <div>
            <div className="mb-6">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                Search Results for "{globalSearch}"
              </h2>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Found {data.filter(row => 
                  Object.values(row).some(value =>
                    value && value.toString().toLowerCase().includes(globalSearch.toLowerCase())
                  )
                ).length} results across all categories
              </p>
            </div>

            {/* Global Search Results */}
            <div className="space-y-4">
              {data.filter(row => 
                Object.values(row).some(value =>
                  value && value.toString().toLowerCase().includes(globalSearch.toLowerCase())
                )
              ).map((row, index) => {
                const variables = extractVariables(row.Cmd || '');
                const processedCommand = processCommand(row.Cmd || '');
                
                return (
                  <div
                    key={index}
                    className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-6`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {row.Command}
                        </h3>
                        {row.Tags && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {row.Tags.split(',').map((tag: string, tagIndex: number) => (
                              <span
                                key={tagIndex}
                                className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${
                                  isDarkMode 
                                    ? 'bg-gray-700 text-gray-300 hover:bg-blue-700' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                                }`}
                                onClick={() => {
                                  setSelectedTag(tag.trim());
                                  setShowGlobalSearch(false);
                                  setGlobalSearch('');
                                }}
                              >
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
            <button
                        onClick={() => copyCommand(row.Cmd)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          isDarkMode 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        Copy Command
            </button>
          </div>

                    {/* Command Display */}
                    <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg p-4 mb-4`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Command:
                        </span>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {variables.length > 0 ? `${variables.length} variable${variables.length !== 1 ? 's' : ''}` : 'No variables'}
                        </span>
                      </div>
                      <code className={`block text-sm font-mono break-all ${
                        isDarkMode ? 'text-green-400' : 'text-green-600'
                      }`}>
                        {processedCommand}
                      </code>
                    </div>
                    
                    {/* Variables in this command */}
                    {variables.length > 0 && (
                      <div className="mb-4">
                        <h4 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Variables used in this command:
                        </h4>
              <div className="flex flex-wrap gap-2">
                          {variables.map((variable, varIndex) => (
                            <span
                              key={varIndex}
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                commandVariables[variable] 
                                  ? (isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800')
                                  : (isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800')
                              }`}
                            >
                              {variable}: {commandVariables[variable] || 'Not set'}
                            </span>
                ))}
              </div>
            </div>
          )}
                    
                    {/* Page Link */}
                    {row.Page && (
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <a
                          href={row.Page}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-sm ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} underline`}
                        >
                          View Documentation →
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {data.filter(row => 
                Object.values(row).some(value =>
                  value && value.toString().toLowerCase().includes(globalSearch.toLowerCase())
                )
              ).length === 0 && (
                <div className={`text-center py-12 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg border border-gray-200 dark:border-gray-700`}>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                    No results found for "{globalSearch}".
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : !selectedTag ? (
          /* Categories View */
          <div>
            <div className="mb-6">
              <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                Attack Categories
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Choose a category to explore tools and commands
              </p>
        </div>

            {/* Attack Types */}
            {groupedTags.attackTypes.length > 0 && (
              <div className="mb-6">
                <h3 className={`text-lg font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Attack Types
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groupedTags.attackTypes.map(tag => {
                    const tagCount = data.filter(row => 
                      row.Tags && row.Tags.split(',').map((t: string) => t.trim()).includes(tag)
                    ).length;
                    if (tagCount === 0) return null;
                    const IconComponent = getCategoryIcon(tag);
                    return (
                      <div
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-150 hover:shadow-md ${
                          isDarkMode 
                            ? 'bg-gray-800 border-gray-700 hover:border-blue-500 hover:bg-gray-750' 
                            : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            tag === 'Authenticated' 
                              ? (isDarkMode ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-600')
                              : (isDarkMode ? 'bg-orange-900 text-orange-400' : 'bg-orange-100 text-orange-600')
                          }`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {tag}
                            </h4>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {tagCount} tools
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tools */}
            {groupedTags.tools.length > 0 && (
              <div className="mb-6">
                <h3 className={`text-lg font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Tools
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedTags.tools.map(tag => {
                    const tagCount = data.filter(row => 
                      row.Tags && row.Tags.split(',').map((t: string) => t.trim()).includes(tag)
                    ).length;
                    if (tagCount === 0) return null;
                    const IconComponent = getCategoryIcon(tag);
                    return (
                      <div
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-150 hover:shadow-md ${
                          isDarkMode 
                            ? 'bg-gray-800 border-gray-700 hover:border-blue-500 hover:bg-gray-750' 
                            : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {tag}
                            </h4>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {tagCount} tools
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* General */}
            {groupedTags.general.length > 0 && (
              <div className="mb-6">
                <h3 className={`text-lg font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  General
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedTags.general.map(tag => {
                    const tagCount = data.filter(row => 
                      row.Tags && row.Tags.split(',').map((t: string) => t.trim()).includes(tag)
                    ).length;
                    if (tagCount === 0) return null;
                    const IconComponent = getCategoryIcon(tag);
                    return (
                      <div
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-150 hover:shadow-md ${
                          isDarkMode 
                            ? 'bg-gray-800 border-gray-700 hover:border-blue-500 hover:bg-gray-750' 
                            : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-purple-900 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {tag}
                            </h4>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {tagCount} tools
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Other categories present in CSV */}
            {groupedTags.others.length > 0 && (
              <div>
                <h3 className={`text-lg font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Other
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedTags.others.map(tag => {
                    const tagCount = data.filter(row => 
                      row.Tags && row.Tags.split(',').map((t: string) => t.trim()).includes(tag)
                    ).length;
                    if (tagCount === 0) return null;
                    const IconComponent = getCategoryIcon(tag);
                    return (
                      <div
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-150 hover:shadow-md ${
                          isDarkMode 
                            ? 'bg-gray-800 border-gray-700 hover:border-blue-500 hover:bg-gray-750' 
                            : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {tag}
                            </h4>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {tagCount} tools
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Command View - Show tools for selected tag */
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded text-sm transition-colors ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span>←</span>
                  <span>Back</span>
                </button>
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedTag}
                </h2>
              </div>
            </div>


            {/* Command Cards */}
            <div className="space-y-3">
              {tagFilteredData.map((row, index) => {
                const variables = extractVariables(row.Cmd || '');
                const processedCommand = processCommand(row.Cmd || '');
                
                return (
                  <div
                    key={index}
                    className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded border p-4`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {row.Command}
                        </h3>
                        {row.Tags && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {row.Tags.split(',').map((tag: string, tagIndex: number) => (
                              <span
                                key={tagIndex}
                                className={`px-2 py-0.5 rounded text-xs ${
                                  isDarkMode 
                                    ? 'bg-gray-700 text-gray-300' 
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => copyCommand(row.Cmd)}
                        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                          isDarkMode 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        Copy
                      </button>
          </div>
          
                    {/* Command Display */}
                    <div className={`${isDarkMode ? 'bg-black border-gray-700' : 'bg-gray-900 border-gray-600'} border rounded p-3 mb-3`}>
                      <code className={`block text-sm font-mono break-all ${
                        isDarkMode ? 'text-green-400' : 'text-green-300'
                      }`}>
                        ~$ {processedCommand}
                      </code>
                    </div>
                    
                    {/* Variables in this command */}
                    {variables.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {variables.map((variable, varIndex) => (
                            <span
                              key={varIndex}
                              className={`px-2 py-0.5 rounded text-xs ${
                                commandVariables[variable] 
                                  ? (isDarkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800')
                                  : (isDarkMode ? 'bg-red-800 text-red-200' : 'bg-red-100 text-red-800')
                              }`}
                            >
                              {variable}: {commandVariables[variable] || 'Not set'}
                            </span>
                          ))}
                        </div>
            </div>
                    )}
                    
                    {/* Documentation */}
                    {row.Page && (
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => {
                              openLateralWindow(row.Command);
                            }}
                            className={`text-xs ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} underline`}
                          >
                            📖 View Documentation
                          </button>
                        </div>
            </div>
          )}
        </div>
                );
              })}
              
              {tagFilteredData.length === 0 && (
                <div className={`text-center py-12 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg border border-gray-200 dark:border-gray-700`}>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                    No tools found for the selected category.
                  </p>
              </div>
              )}
            </div>
            </div>
          )}

        {/* Stats */}
        {selectedTag && (
          <div className="mt-4">
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} rounded border p-3`}>
              <div className={`flex flex-wrap gap-4 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span>{tagFilteredData.length} tools in {selectedTag}</span>
                <span>{allTags.length} categories total</span>
              {searchTerm && (
                  <span>Search: "{searchTerm}"</span>
              )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Lateral Window for Markdown Documentation */}
      {lateralWindowOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="flex-1 bg-black bg-opacity-50"
            onClick={() => setLateralWindowOpen(false)}
          />
          
          {/* Lateral Window */}
          <div className={`w-full max-w-2xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-2xl flex flex-col`}>
            {/* Header */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-b px-6 py-4 flex items-center justify-between`}>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setLateralWindowOpen(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {lateralWindowTitle}
                </h2>
              </div>
              <button
                onClick={() => setLateralWindowOpen(false)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className={`prose prose-sm max-w-none ${
                isDarkMode 
                  ? 'prose-invert prose-gray' 
                  : 'prose-gray'
              }`}>
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code: ({ className, children, ...props }: any) => {
                      const isInline = !className?.includes('language-');
                      
                      if (isInline) {
                        return (
                          <code 
                            className={`px-1.5 py-0.5 rounded text-sm font-mono ${
                              isDarkMode 
                                ? 'bg-gray-800 text-green-400' 
                                : 'bg-gray-100 text-green-600'
                            }`}
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      }
                      return (
                        <pre className={`${isDarkMode ? 'bg-black border-gray-700' : 'bg-black border-gray-600'} border rounded-lg p-4 overflow-x-auto`}>
                          <code 
                            className={`text-sm font-mono ${
                              isDarkMode ? 'text-green-400' : 'text-green-400'
                            }`}
                            {...props}
                          >
                            ~$ {children}
                          </code>
                        </pre>
                      );
                      },
                    h1: ({ children }) => (
                      <h1 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className={`text-xl font-semibold mb-3 mt-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className={`text-lg font-medium mb-2 mt-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {children}
                      </h3>
                    ),
                    ul: ({ children }) => (
                      <ul className={`mb-3 ml-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className={`mb-3 ml-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => {
                      const content = children?.toString() || '';
                      // Check if this is a tag list item
                      if (content.match(/^[A-Za-z\s]+$/)) {
                        return (
                          <li className="mb-1">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${isDarkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800'} mr-1 mb-1`}>
                              {children}
                            </span>
                          </li>
                        );
                      }
                      return (
                        <li className={`mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {children}
                        </li>
                      );
                    },
                    strong: ({ children }) => (
                      <strong className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className={`italic ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {children}
                      </em>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className={`border-l-4 pl-4 my-4 ${
                        isDarkMode 
                          ? 'border-gray-600 text-gray-300' 
                          : 'border-gray-300 text-gray-600'
                      }`}>
                        {children}
                      </blockquote>
                    ),
                    a: ({ href, children }) => (
                      <a 
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`underline ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                      >
                        {children}
                      </a>
                    ),
                    p: ({ children }) => (
                      <p className={`mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {children}
                      </p>
                    ),
                  }}
                >
                  {lateralWindowContent}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;