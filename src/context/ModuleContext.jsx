import { createContext, useContext, useState, useEffect } from 'react';
import { modules as initialModules } from '../data/modules';

const ModuleContext = createContext();

export const useModules = () => {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error('useModules must be used within a ModuleProvider');
  }
  return context;
};

export const ModuleProvider = ({ children }) => {
  const [modules, setModules] = useState(() => {
    const savedModules = localStorage.getItem('helpdesk_modules_v4'); // Changed key to force refresh
    return savedModules ? JSON.parse(savedModules) : initialModules;
  });

  useEffect(() => {
    localStorage.setItem('helpdesk_modules_v4', JSON.stringify(modules));
  }, [modules]);

  const addModule = (newModule) => {
    setModules(prev => [...prev, { ...newModule, id: Date.now().toString(), guides: [] }]);
  };

  const updateModule = (id, updatedData) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, ...updatedData } : m));
  };

  const deleteModule = (id) => {
    setModules(prev => prev.filter(m => m.id !== id));
  };

  const addGuide = (moduleId, newGuide) => {
    setModules(prev => prev.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          guides: [...m.guides, { ...newGuide, id: Date.now().toString() }]
        };
      }
      return m;
    }));
  };

  const updateGuide = (moduleId, guideId, updatedData) => {
    setModules(prev => prev.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          guides: m.guides.map(g => g.id === guideId ? { ...g, ...updatedData } : g)
        };
      }
      return m;
    }));
  };

  const deleteGuide = (moduleId, guideId) => {
    setModules(prev => prev.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          guides: m.guides.filter(g => g.id !== guideId)
        };
      }
      return m;
    }));
  };

  const value = {
    modules,
    addModule,
    updateModule,
    deleteModule,
    addGuide,
    updateGuide,
    deleteGuide
  };

  return (
    <ModuleContext.Provider value={value}>
      {children}
    </ModuleContext.Provider>
  );
};
