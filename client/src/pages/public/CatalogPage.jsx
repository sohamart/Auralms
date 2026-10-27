import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { coursesApi } from '../../services/api';
import { CourseCard } from '../../components/course/CourseCard';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Search, BookOpen, Filter, X } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Software Engineering',
  'AI & Machine Learning',
  'UI/UX Design',
];

const LEVELS = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

export const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLevel, setSelectedLevel] = useState('All Levels');

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedLevel !== 'All Levels') params.level = selectedLevel;
      if (searchTerm) params.search = searchTerm;

      const res = await coursesApi.getPublic(params);
      if (res.success) {
        setCourses(res.courses);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory, selectedLevel]);

  // Debounced search trigger
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedLevel('All Levels');
    setSearchParams({});
  };

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Course Catalog
        </h1>
        <p className="text-sm text-slate-600">
          Explore our certified curriculum tracks covering systems design, scalable backends, machine learning, and interface craft.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md flex gap-2">
          <Input
            placeholder="Search by title, keywords or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
          <Button type="submit" variant="secondary" size="md">
            Search
          </Button>
        </form>

        {/* Category & Level Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}

          {/* Level Dropdown */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-xs rounded-xl px-3 py-2 outline-none cursor-pointer shadow-xs"
          >
            {LEVELS.map((lvl) => (
              <option key={lvl} value={lvl} className="bg-white text-slate-900">
                {lvl}
              </option>
            ))}
          </select>

          {(selectedCategory !== 'All' || selectedLevel !== 'All Levels' || searchTerm) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-600 hover:text-rose-700 transition-colors cursor-pointer font-medium"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-80 rounded-2xl bg-white border border-slate-200 animate-pulse shadow-xs"
            />
          ))}
        </div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center justify-center p-8 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <BookOpen className="w-12 h-12 text-slate-400 mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">
            No courses found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mb-4">
            We couldn't find any courses matching your search or filter parameters. Try adjusting your search query or reset filters.
          </p>
          <Button variant="secondary" size="sm" onClick={clearFilters}>
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};
