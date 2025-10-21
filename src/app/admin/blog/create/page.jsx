'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import CategoryManager from '../components/CategoryManager';
import SimpleRichTextEditor from '../components/SimpleRichTextEditor';

export default function CreateArticlePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    content: '',
    bannerImage: '',
    categoryId: '',
    status: 'draft'
  });

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (formData.title || formData.content) {
      const autoSaveTimer = setTimeout(() => {
        // Auto-save as draft every 30 seconds
        if (formData.title.trim() && formData.content.trim()) {
          console.log('Auto-saving draft...');
          // You can implement auto-save API call here
        }
      }, 30000);

      return () => clearTimeout(autoSaveTimer);
    }
  }, [formData.title, formData.content]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setFormData(prev => ({
          ...prev,
          bannerImage: data.url
        }));
      } else {
        alert('Failed to upload image: ' + data.message);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    }
  };

  const handleContentChange = (e) => {
    setFormData(prev => ({
      ...prev,
      content: e.target.value
    }));
  };

  const handleCategoryAdded = (newCategory) => {
    setCategories(prev => [...prev, newCategory]);
    setFormData(prev => ({
      ...prev,
      categoryId: newCategory.id.toString()
    }));
  };

  const handleSaveDraft = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Title and content are required');
      return;
    }

    if (!formData.author.trim()) {
      alert('Author is required');
      return;
    }

    if (!formData.categoryId) {
      alert('Please select a category before saving');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          status: 'draft'
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Draft saved successfully!');
        router.push('/admin/dashboard?tab=blog');
      } else {
        alert('Error saving draft: ' + data.message);
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Error saving draft');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Title and content are required');
      return;
    }

    if (!formData.author.trim()) {
      alert('Author is required');
      return;
    }

    if (!formData.categoryId) {
      alert('Please select a category before publishing');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          status: 'published'
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Article published successfully!');
        router.push('/admin/dashboard?tab=blog');
      } else {
        alert('Error publishing article: ' + data.message);
      }
    } catch (error) {
      console.error('Error publishing article:', error);
      alert('Error publishing article');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/dashboard?tab=blog')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="text-sm text-gray-400">
                Draft in Admin
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Draft'}
              </button>
              
              <button
                onClick={handlePublish}
                disabled={isSaving}
                className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-full hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Publishing...' : 'Publish'}
              </button>
              
              <button className="p-2 text-gray-300 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Title Input */}
          <div>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Title"
              className="w-full text-4xl font-bold text-white placeholder-gray-400 border-none outline-none resize-none bg-transparent"
              style={{ minHeight: '60px' }}
            />
          </div>

          {/* Author Input */}
          <div>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              placeholder="Author Name"
              className="w-full text-lg text-gray-300 placeholder-gray-500 border-none outline-none resize-none bg-transparent"
              style={{ minHeight: '40px' }}
            />
          </div>


          {/* Content Editor */}
          <div className="relative">
            <SimpleRichTextEditor
              value={formData.content}
              onChange={(content) => setFormData(prev => ({ ...prev, content }))}
              placeholder="tulis ketikan mu disini"
            />
          </div>


          {/* Article Settings */}
          <div className="bg-gray-800 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Article Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCategoryManager(true)}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1 px-3 py-1 border border-dashed border-blue-400 hover:border-blue-300 rounded-md hover:bg-blue-400/10"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add Category</span>
                  </button>
                </div>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cover Banner (Banner Image) <span className="text-gray-500">(Optional)</span>
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    name="bannerImage"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                  {formData.bannerImage && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-400 mb-2">Preview:</p>
                      <div className="relative w-full h-48 bg-gray-800 rounded-lg overflow-hidden border border-gray-600">
                        <img
                          src={formData.bannerImage}
                          alt="Banner preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Category Manager Modal */}
      {showCategoryManager && (
        <CategoryManager
          onCategoryAdded={handleCategoryAdded}
          onClose={() => setShowCategoryManager(false)}
        />
      )}
    </div>
  );
}
