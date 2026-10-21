import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api, { BASE_URL } from '../api';
import { Search, Folder, User, Briefcase, FileText, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const SearchResults = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('q') || '';
    const [results, setResults] = useState({ projects: [], employees: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) return;
            setLoading(true);
            try {
                // Use dedicated search endpoint
                const { data: projects } = await api.get(`/projects/search?query=${encodeURIComponent(query)}`);

                let employees = [];
                // Only admins search for employees
                if (localStorage.getItem('userRole') === 'admin') {
                    try {
                        const empRes = await api.get('/admin/employees');
                        employees = empRes.data.filter(e =>
                            e.username.toLowerCase().includes(query.toLowerCase()) ||
                            e.department?.name?.toLowerCase().includes(query.toLowerCase())
                        );
                    } catch (e) {
                        console.error('Employee search error:', e);
                    }
                }

                setResults({
                    projects,
                    employees
                });
            } catch (err) {
                console.error('Search error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    if (!query) return <div className="p-8 text-center text-slate-500">Please enter a search query.</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold flex items-center space-x-4">
                    <Search className="h-8 w-8 text-indigo-500" />
                    <span>Search Results for "{query}"</span>
                </h1>
                <p className="text-slate-500 mt-2">
                    Found {results.projects.length} projects and {results.employees.length} employees.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">Searching...</div>
            ) : (
                <div className="space-y-12">
                    {/* Projects Results */}
                    {results.projects.length > 0 && (
                        <section className="space-y-6">
                            <h2 className="text-xl font-bold flex items-center space-x-2">
                                <Folder className="h-5 w-5 text-indigo-500" />
                                <span>Projects</span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {results.projects.map((project) => (
                                    <motion.div
                                        key={project._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all relative"
                                    >
                                        {project.thumbnail && (
                                            <div className="absolute inset-0 z-0">
                                                <img
                                                    src={`${BASE_URL}/uploads/${encodeURIComponent(project.thumbnail)}`}
                                                    alt=""
                                                    className="h-full w-full object-cover opacity-80"
                                                    onError={(e) => {
                                                        console.error('Search Thumbnail failed to load:', e.target.src);
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-white/20 to-transparent dark:from-slate-900/60 dark:via-slate-900/20 dark:to-transparent" />
                                            </div>
                                        )}
                                        <div className="p-6 relative z-10">
                                            <h3 className="font-bold text-lg mb-2 truncate">{project.title}</h3>
                                            <div className="flex items-center space-x-4 mb-4 text-xs text-slate-500">
                                                <div className="flex items-center space-x-1">
                                                    <User className="h-3 w-3" />
                                                    <span className="font-medium">@{project.employee?.username}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Briefcase className="h-3 w-3" />
                                                    <span>{project.department?.name || 'Global'}</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-400 line-clamp-2 mb-4 h-10">{project.description || 'No description provided.'}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Employees Results */}
                    {results.employees.length > 0 && (
                        <section className="space-y-6">
                            <h2 className="text-xl font-bold flex items-center space-x-2">
                                <User className="h-5 w-5 text-indigo-500" />
                                <span>Employees</span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {results.employees.map((emp) => (
                                    <div key={emp._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center space-x-4">
                                        <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center font-bold text-indigo-600">
                                            {emp.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">@{emp.username}</p>
                                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{emp.department?.name || 'Global'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {results.projects.length === 0 && results.employees.length === 0 && (
                        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem]">
                            <Search className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-400">No matches found</h3>
                            <p className="text-slate-500 mt-2">Try different keywords or check spelling.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchResults;
