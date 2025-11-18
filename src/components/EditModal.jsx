import  { useState, useEffect } from "react";
import { assets } from "../assets/admin_assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { backendUrl } from "../App";

const EditBlogModal = ({ setOpenModal, selectedBlog, onUpdate }) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Strategic Analysis");
  const [loading, setLoading] = useState(false);

  // Images (max 4 slots)
  const [images, setImages] = useState([null, null, null, null]);

  const blogCategories = [
    "Strategic Analysis",
    'Market Intelligence',
    'Technical Implementation',
    'Authority Building',
    'Business Strategy',
  ];

  // Load blog data into state
  useEffect(() => {
    if (selectedBlog) {
      setTitle(selectedBlog.title || "");
      setSubtitle(selectedBlog.subtitle || "");
      setDescription(selectedBlog.description || "");
      setCategory(selectedBlog.category || "Technology");

      // Pre-fill images with blogData urls
      const filledImages = [null, null, null, null];
      (selectedBlog.images || []).forEach((img, index) => {
        if (index < 4) filledImages[index] = img.url;
      });
      setImages(filledImages);
    }
  }, [selectedBlog]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBlog?._id) {
      toast.error("Blog ID is missing");
      return;
    }

    if (!title.trim() || !subtitle.trim() || !description.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    // Prepare formData
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("description", description);
    formData.append("category", category);
    images.forEach((img) => {
      if (img) {
        if (typeof img === "string") {

          formData.append("existingImages", img);
        } else {

          formData.append("images", img);
        }
      }
    });

    setLoading(true);
    try {
      const response = await axios.put(
        `${backendUrl}/api/blogs/update/${selectedBlog._id}`,
        formData
      );

      if (response.data.success) {
        toast.success("Blog updated successfully!");
        onUpdate && onUpdate();
        setOpenModal(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update blog");
    } finally {
      setLoading(false);
    }
  };

  if (!selectedBlog) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-xl font-bold">Edit Blog</h2>
          <button
            onClick={() => setOpenModal(false)}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Uploads */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {images.map((img, index) => (
              <label key={index} className="cursor-pointer group relative">
                <div className="relative overflow-hidden rounded-lg border-2 border-dashed border-gray-300 group-hover:border-blue-400 transition-colors">
                  <img
                    src={
                      img
                        ? typeof img === "string"
                          ? img
                          : URL.createObjectURL(img)
                        : assets.upload_area
                    }
                    alt={`Upload ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                  {img && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        const newImgs = [...images];
                        newImgs[index] = null;
                        setImages(newImgs);
                      }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const newImgs = [...images];
                    newImgs[index] = e.target.files[0];
                    setImages(newImgs);
                  }}
                />
              </label>
            ))}
          </div>

          {/* Blog Title */}
          <input
            type="text"
            value={title}
            placeholder="Blog Title"
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          {/* Blog Subtitle */}
          <input
            type="text"
            value={subtitle}
            placeholder="Subtitle"
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            {blogCategories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>

          {/* Description */}
          <textarea
            value={description}
            placeholder="Blog description..."
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg min-h-[120px]"
            required
          />

          {/* Footer */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setOpenModal(false)}
              className="px-4 py-2 border rounded-lg"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              {loading ? "Updating..." : "Update Blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlogModal;
