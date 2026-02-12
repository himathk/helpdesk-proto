import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useModules } from '../../context/ModuleContext';
import DynamicIcon from '../../components/DynamicIcon';
import { 
  Plus, Edit, Trash2, Search, ArrowUpDown, 
  ChevronLeft, ChevronRight, Layers, LayoutGrid, List, ChevronRight as ChevronRightIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminModuleList = () => {
  const { modules, deleteModule } = useModules();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const itemsPerPage = viewMode === 'grid' ? 9 : 6;

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this module? This action cannot be undone.')) {
      deleteModule(id);
    }
  };

  // --- Filtering & Sorting ---
  const filteredAndSortedModules = useMemo(() => {
    let result = [...modules];

    // Filter
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(module => 
        module.title.toLowerCase().includes(lowerTerm) || 
        module.description?.toLowerCase().includes(lowerTerm)
      );
    }

    // Sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Specific handling for 'guides' count
        if (sortConfig.key === 'guides') {
           aValue = a.guides?.length || 0;
           bValue = b.guides?.length || 0;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [modules, searchTerm, sortConfig]);

  // --- Pagination ---
  const totalPages = Math.ceil(filteredAndSortedModules.length / itemsPerPage);
  const paginatedModules = filteredAndSortedModules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
      if (sortConfig.key !== key) return <ArrowUpDown className="h-3 w-3 opacity-30 ml-2" />;
      return <ArrowUpDown className={`h-3 w-3 ml-2 text-primary ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />;
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Modules</h1>
          <p className="text-slate-500">Manage and organize your support categories.</p>
        </div>
        
        <div className="flex items-center gap-3">
             {/* Search Bar */}
             <div className="relative group">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search Modules..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-64 shadow-sm transition-all"
                />
             </div>

             {/* View Toggle */}
             <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    title="List View"
                >
                    <List className="h-4 w-4" />
                </button>
                <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    title="Grid View"
                >
                    <LayoutGrid className="h-4 w-4" />
                </button>
             </div>
             
             <Link
              to="/admin/modules/new"
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
            >
              <Plus className="h-4 w-4" />
              <span>New Module</span>
            </Link>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'list' ? (
            /* --- List View (Table) --- */
            <motion.div
                key="list-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-[1.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden"
            >
                {/* Table Header */}
                <div className="grid grid-cols-12 px-6 py-5 border-b border-slate-100 bg-slate-50/30 text-xs font-bold text-slate-500 uppercase tracking-wide">
                    <div 
                        className="col-span-5 cursor-pointer hover:text-primary flex items-center"
                        onClick={() => handleSort('title')}
                    >
                        Module Name {getSortIcon('title')}
                    </div>
                    <div className="col-span-2">Status</div>
                    <div 
                        className="col-span-2 cursor-pointer hover:text-primary flex items-center"
                        onClick={() => handleSort('guides')}
                    >
                        Guides {getSortIcon('guides')}
                    </div>
                    <div className="col-span-3 text-right">Actions</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-slate-50 min-h-[300px]">
                    {paginatedModules.length > 0 ? (
                        paginatedModules.map((module) => (
                            <div 
                                key={module.id} 
                                className="grid grid-cols-12 items-center px-6 py-5 hover:bg-slate-50/50 transition-colors group cursor-pointer"
                            >
                                {/* Module Name & Icon */}
                                <div className="col-span-5">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-white border border-slate-100 rounded-xl shadow-sm text-primary group-hover:scale-105 group-hover:border-primary/30 transition-all duration-300">
                                            <DynamicIcon name={module.icon} className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0 pr-4">
                                            <h3 
                                                className="font-bold text-slate-900 text-sm mb-0.5 truncate group-hover:text-primary transition-colors"
                                                title={module.title}
                                            >
                                                {module.title}
                                            </h3>
                                            <p className="text-xs text-slate-500 line-clamp-1">{module.description}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Status */}
                                <div className="col-span-2">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
                                        Active
                                    </span>
                                </div>

                                {/* Guides Count */}
                                <div className="col-span-2">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-50 text-slate-600 text-xs font-medium border border-slate-100">
                                        {module.guides?.length || 0} Guides
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="col-span-3 text-right">
                                <div className="flex items-center justify-end gap-2 text-slate-400">
                                        <Link
                                        to={`/admin/modules/${module.id}`}
                                        className="p-2 hover:bg-white hover:text-primary hover:shadow-sm rounded-lg transition-all"
                                        title="Manage Guides"
                                        >
                                        <ChevronRightIcon className="h-4 w-4" />
                                        </Link>
                                        <Link
                                        to={`/admin/modules/edit/${module.id}`}
                                        className="p-2 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-lg transition-all"
                                        title="Edit Module"
                                        >
                                        <Edit className="h-4 w-4" />
                                        </Link>
                                        <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(module.id); }}
                                        className="p-2 hover:bg-white hover:text-red-500 hover:shadow-sm rounded-lg transition-all"
                                        title="Delete Module"
                                        >
                                        <Trash2 className="h-4 w-4" />
                                        </button>
                                </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <Layers className="h-8 w-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900">No modules found</h3>
                            <p className="text-slate-500 max-w-xs mx-auto mt-2 text-center text-sm">
                                {searchTerm ? `No matches for "${searchTerm}"` : "Get started by creating your first helpdesk module."}
                            </p>
                            {searchTerm ? (
                                <button 
                                    onClick={() => setSearchTerm('')}
                                    className="mt-4 text-primary text-sm hover:underline font-medium"
                                >
                                    Clear Search
                                </button>
                            ) : (
                                <Link
                                to="/admin/modules/new"
                                className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm shadow-lg shadow-primary/20"
                                >
                                Create Module
                                </Link>
                            )}
                        </div>
                    )}
                </div>

                {/* Pagination Internal (List View) */}
                {filteredAndSortedModules.length > 0 && (
                    <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 bg-slate-50/50">
                        <div className="text-xs text-slate-500 font-medium">
                            Showing <span className="text-slate-900 font-bold">{((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredAndSortedModules.length)}</span> of <span className="text-slate-900 font-bold">{filteredAndSortedModules.length}</span>
                        </div>
                        
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-7 h-7 rounded-md text-xs font-bold transition-colors ${
                                        currentPage === page
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        ) : (
            /* --- Grid View --- */
            <>
                <motion.div
                    key="grid-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {paginatedModules.length > 0 ? (
                        paginatedModules.map((module) => (
                            <div key={module.id} className="bg-white rounded-[1.5rem] border border-slate-100 shadow-lg shadow-slate-200/50 p-6 flex flex-col group hover:shadow-xl transition-all duration-300 hover:border-primary/20">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-slate-50 rounded-xl text-primary group-hover:bg-primary/10 transition-colors">
                                        <DynamicIcon name={module.icon} className="h-6 w-6" />
                                    </div>
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                                        Active
                                    </span>
                                </div>
                                
                                <h3 className="font-bold text-slate-900 text-lg mb-2">{module.title}</h3>
                                <p className="text-slate-500 text-sm line-clamp-2 mb-6 flex-1">{module.description}</p>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                    <span className="text-sm font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
                                        {module.guides?.length || 0} Guides
                                    </span>
                                    <div className="flex gap-2">
                                         <Link
                                            to={`/admin/modules/edit/${module.id}`}
                                            className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                        <Link
                                            to={`/admin/modules/${module.id}`}
                                            className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-primary transition-colors"
                                            title="Manage Guides"
                                        >
                                            <ChevronRightIcon className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center flex flex-col items-center justify-center text-slate-400">
                            <Layers className="h-10 w-10 mb-3 opacity-20" />
                            <p>No modules found</p>
                        </div>
                    )}
                </motion.div>

                {/* Pagination External (Grid View) */}
                {filteredAndSortedModules.length > 0 && (
                    <div className="flex items-center justify-between px-6 py-4 mt-6 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm">
                        <div className="text-xs text-slate-500 font-medium">
                            Showing <span className="text-slate-900 font-bold">{((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredAndSortedModules.length)}</span> of <span className="text-slate-900 font-bold">{filteredAndSortedModules.length}</span>
                        </div>
                        
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-7 h-7 rounded-md text-xs font-bold transition-colors ${
                                        currentPage === page
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminModuleList;
