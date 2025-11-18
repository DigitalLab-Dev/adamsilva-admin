import { useState } from 'react';
import { assets } from '../assets/admin_assets/assets'; // Corrected path
import { toast } from 'react-toastify';
import axios from 'axios';
import { backendUrl } from '../App'; // Corrected path

const Add = () => {
  const [images, setImages] = useState([null, null, null, null]); // Single state for 4 slots
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Strategic Analysis');
  const [impact, setImpact] = useState('HIGH'); // New state for impact

  const blogCategories = [
    'Strategic Analysis',
    'Market Intelligence',
    'Technical Implementation',
    'Authority Building',
    'Business Strategy',
  ];

  // New array for impact options
  const blogImpacts = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

  const handleImageChange = (index, file) => {
    const updated = [...images];
    updated[index] = file;
    setImages(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Validation

    if (!title.trim() || !excerpt.trim() || !content.trim() || !impact) {
      toast.error(
        'Please fill in all required fields (title, excerpt, content, impact)'
      );
      setLoading(false);
      return;
    }

    if (excerpt.length > 200) {
      toast.error('Excerpt must be under 200 characters');
      setLoading(false);
      return;
    }

    const selectedImages = images.filter(Boolean);
    if (selectedImages.length === 0) {
      toast.error('At least one image is required');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('excerpt', excerpt);
      formData.append('content', content);
      formData.append('category', category);
      formData.append('impact', impact); // ✅ Append new impact field

      selectedImages.forEach((image) => {
        formData.append('images', image);
      });

      const response = await axios.post(`${backendUrl}/api/blogs`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        toast.success('Blog post added successfully!'); // Reset form
        setTitle('');
        setExcerpt('');
        setContent('');
        setCategory('Technology');
        setImpact('HIGH'); // ✅ Reset impact state
        setImages([null, null, null, null]);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to add blog post');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    'w-full px-4 py-3 border-2 border-gray-700 bg-black/30 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-white placeholder-gray-400 appearance-none';
  const selectStyle =
    'w-full px-4 py-3 border-2 border-gray-700 bg-black/30 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-white';

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-orange-400 w-full p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-300 mb-2">
            Create New Blog Post
          </h1>
          <p className="text-gray-400">
            Share your thoughts and ideas with the world
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl shadow-xl p-8 space-y-8"
        >
          {/* Image Upload */}
          <div className="rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              Upload Images
            </h3>
            <p className="text-sm text-gray-400 mb-4">Add up to 4 images</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img, index) => (
                <label key={index} className="cursor-pointer group">
                  <div className="relative overflow-hidden rounded-lg border-2 border-dashed border-gray-300 group-hover:border-orange-400 transition-colors duration-200">
                    <img
                      className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-200"
                      src={img ? URL.createObjectURL(img) : assets.upload_area}
                      alt={`Upload ${index + 1}`}
                    />
                  </div>
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) =>
                      handleImageChange(index, e.target.files[0])
                    }
                  />
                </label>
              ))}
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Required: At least one image must be uploaded.
            </p>
          </div>
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-white">
                            Blog Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter an engaging title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`${inputStyle} text-lg`}
              required
            />
          </div>
          {/* Subtitle/Excerpt */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-white">
              Blog Excerpt
            </label>
            <input
              type="text"
              placeholder="Excerpt (max 200 characters)"
              value={excerpt}
              maxLength={200}
              onChange={(e) => setExcerpt(e.target.value)}
              className={inputStyle}
            />
            <p className="text-sm text-gray-400">{excerpt.length}/200</p>
          </div>
          {/* Category and Impact Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Category */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white">
                                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={selectStyle}
                required
              >
                {blogCategories.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                    className="bg-gray-800 text-white"
                  >
                                        {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Impact */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white">
                                Impact Level
                <span className="text-red-500">*</span>
              </label>
              <select
                value={impact}
                onChange={(e) => setImpact(e.target.value)}
                className={selectStyle}
                required
              >
                {blogImpacts.map((imp) => (
                  <option
                    key={imp}
                    value={imp}
                    className="bg-gray-800 text-white"
                  >
                                        {imp}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-white">
                            Blog Content <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Write your blog content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`${inputStyle} min-h-[200px] resize-y`}
              required
            />
            <p className="text-sm text-gray-400">{content.length} characters</p>
          </div>

          {/* Submit */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r cursor-pointer from-black to-orange-600 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>{loading ? 'Publishing...' : 'Publish Blog Post'}</span>
            </button>
          </div>
        </form>
      </div>
      {/* The extra brace was removed from here */}
    </div>
  );
};

export default Add;