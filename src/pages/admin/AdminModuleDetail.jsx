import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useModules } from '../../context/ModuleContext';
import { 
  Plus, Edit, Trash2, ArrowLeft, PlayCircle, Search, 
  FileText, ChevronLeft, ChevronRight, ArrowUpDown, LayoutGrid, List
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminModuleDetail = () => {
  const { moduleId } = useParams();
  const { modules, deleteGuide } = useModules();
  
  const module = modules.find(m => m.id === moduleId);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const itemsPerPage = viewMode === 'grid' ? 9 : 6;

  if (!module) {
    return <div>Module not found</div>;
  }

  const handleDelete = (guideId) => {
    if (confirm('Are you sure you want to delete this guide?')) {
      deleteGuide(moduleId, guideId);
    }
  };

  // --- Filtering & Sorting ---
  const filteredAndSortedGuides = useMemo(() => {
    let guides = [...(module.guides || [])];

    // Filter
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      guides = guides.filter(guide => 
        guide.title.toLowerCase().includes(lowerTerm) || 
        guide.description?.toLowerCase().includes(lowerTerm)
      );
    }

    // Sort
    if (sortConfig.key) {
      guides.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Specific handling for 'video' status (boolean existence)
        if (sortConfig.key === 'video') {
           aValue = !!a.videoUrl;
           bValue = !!b.videoUrl;
        }
        // Specific handling for 'steps' count
        if (sortConfig.key === 'steps') {
           aValue = a.steps?.length || 0;
           bValue = b.steps?.length || 0;
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

    return guides;
  }, [module.guides, searchTerm, sortConfig]);

  // --- Pagination ---
  const totalPages = Math.ceil(filteredAndSortedGuides.length / itemsPerPage);
  const paginatedGuides = filteredAndSortedGuides.slice(
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
      <div className="space-y-6">
         {/* Back Link */}
         <Link to="/admin/modules" className="inline-flex items-center text-slate-400 hover:text-slate-900 transition-colors font-medium group">
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back To Modules
         </Link>

         {/* Title & Controls */}
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
             <div>
                 <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">{module.title} Guides</h1>
                 <p className="text-slate-500">Manage Guides and videos for this Module</p>
             </div>

             <div className="flex items-center gap-3">
                 {/* Search Bar */}
                 <div className="relative group">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                     <input 
                        type="text" 
                        placeholder="Search Guides..." 
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

                 {/* Add Guide Button */}
                 <Link
                    to={`/admin/modules/${moduleId}/guides/new`}
                    className="px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Add Guide
                </Link>
             </div>
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
                        Guide Name {getSortIcon('title')}
                    </div>
                    <div className="col-span-2">Created Date</div>
                    <div 
                        className="col-span-2 cursor-pointer hover:text-primary flex items-center"
                        onClick={() => handleSort('video')}
                    >
                        Video {getSortIcon('video')}
                    </div>
                    <div 
                        className="col-span-1 cursor-pointer hover:text-primary flex items-center"
                        onClick={() => handleSort('steps')}
                    >
                        Steps {getSortIcon('steps')}
                    </div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-slate-50 min-h-[300px]">
                    {paginatedGuides.length > 0 ? (
                        paginatedGuides.map((guide) => (
                            <div 
                                key={guide.id}
                                className="grid grid-cols-12 px-6 py-5 items-center hover:bg-slate-50/50 transition-colors group"
                            >
                                {/* Guide Name */}
                                <div className="col-span-5 pr-4">
                                    <h3 className="font-bold text-slate-900 text-sm mb-1">{guide.title}</h3>
                                    <p className="text-xs text-slate-500 line-clamp-1">{guide.description}</p>
                                </div>

                                {/* Created Date */}
                                <div className="col-span-2 text-sm text-slate-500 font-medium">
                                    12-NOV-2025
                                </div>

                                {/* Video Status */}
                                <div className="col-span-2">
                                    {guide.videoUrl ? (
                                        <div className="inline-flex items-center gap-1.5 text-primary text-sm font-medium">
                                            <PlayCircle className="h-4 w-4 text-primary" />
                                            Has Video
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center gap-1.5 text-slate-400 text-sm font-medium">
                                            <PlayCircle className="h-4 w-4 text-slate-300" />
                                            No Video
                                        </div>
                                    )}
                                </div>

                                {/* Steps Count */}
                                <div className="col-span-1 text-sm text-slate-500 font-medium">
                                    {(guide.steps?.length || 0)} steps
                                </div>

                                {/* Actions */}
                                <div className="col-span-2 flex justify-end gap-2 text-slate-400">
                                    <Link
                                        to={`/admin/modules/${moduleId}/guides/edit/${guide.id}`}
                                        className="p-2 hover:bg-white hover:text-primary hover:shadow-sm rounded-lg transition-all"
                                        title="Edit"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(guide.id)}
                                        className="p-2 hover:bg-white hover:text-red-500 hover:shadow-sm rounded-lg transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <Search className="h-10 w-10 mb-3 opacity-20" />
                            <p>No guides found matching "{searchTerm}"</p>
                            {searchTerm && (
                                <button 
                                    onClick={() => setSearchTerm('')}
                                    className="mt-2 text-primary text-sm hover:underline"
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Pagination Internal (List View) */}
                {filteredAndSortedGuides.length > 0 && (
                    <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 bg-slate-50/50">
                        <div className="text-xs text-slate-500 font-medium">
                            Showing <span className="text-slate-900 font-bold">{((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredAndSortedGuides.length)}</span> of <span className="text-slate-900 font-bold">{filteredAndSortedGuides.length}</span>
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
                    {paginatedGuides.length > 0 ? (
                        paginatedGuides.map((guide) => (
                            <div key={guide.id} className="bg-white rounded-[1.5rem] border border-slate-100 shadow-lg shadow-slate-200/50 p-6 flex flex-col group hover:shadow-xl transition-all duration-300 hover:border-primary/20">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-slate-50 rounded-xl text-primary group-hover:bg-primary/10 transition-colors">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <div className="flex gap-2">
                                         <Link
                                            to={`/admin/modules/${moduleId}/guides/edit/${guide.id}`}
                                            className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(guide.id)}
                                            className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                
                                <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-1">{guide.title}</h3>
                                <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-1">{guide.description}</p>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                    {guide.videoUrl ? (
                                        <div className="inline-flex items-center gap-1.5 text-primary text-xs font-bold px-2 py-1 bg-blue-50 rounded-md">
                                            <PlayCircle className="h-3 w-3" />
                                            Video
                                        </div>
                                    ) : (
                                         <div className="inline-flex items-center gap-1.5 text-slate-400 text-xs font-medium px-2 py-1 bg-slate-50 rounded-md">
                                            No Video
                                        </div>
                                    )}
                                    <span className="text-xs font-medium text-slate-500">
                                        {(guide.steps?.length || 0)} steps
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center flex flex-col items-center justify-center text-slate-400">
                            <Search className="h-10 w-10 mb-3 opacity-20" />
                            <p>No guides found</p>
                        </div>
                    )}
                </motion.div>

                {/* Pagination External (Grid View) */}
                {filteredAndSortedGuides.length > 0 && (
                    <div className="flex items-center justify-between px-6 py-4 mt-6 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm">
                        <div className="text-xs text-slate-500 font-medium">
                            Showing <span className="text-slate-900 font-bold">{((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredAndSortedGuides.length)}</span> of <span className="text-slate-900 font-bold">{filteredAndSortedGuides.length}</span>
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

export default AdminModuleDetail;
