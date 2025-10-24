import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { gsap } from 'gsap';
import Masonry from '../../../(main)/Components/Masonry/Masonry';

const ManageHeroSection = () => {
  const [heroImages, setHeroImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({
    imageUrl: '',
    imagePath: '',
    url: '',
    height: 400,
    order: 0,
    selectedFile: null
  });

  // Generate 13 slots for hero images with medium heights for masonry effect
  const generateSlots = () => {
    const slots = [];
    const heights = [280, 320, 360, 300, 340, 380, 260, 400, 320, 300, 360, 280, 340]; // 13 medium heights
    
    console.log('Admin: Current heroImages:', heroImages);
    console.log('Admin: Number of heroImages:', heroImages.length);
    
    for (let i = 1; i <= 13; i++) {
      const existingImage = heroImages.find(img => img.order === i);
      console.log(`Admin: Slot ${i} - Found image:`, existingImage ? 'YES' : 'NO', existingImage);
      slots.push({
        id: i,
        order: i,
        image: existingImage || null,
        height: heights[i - 1] || 400
      });
    }
    
    console.log('Admin: Generated slots:', slots.map(s => ({ id: s.id, order: s.order, hasImage: !!s.image })));
    return slots;
  };

  const slots = generateSlots();
  console.log('Generated slots:', slots.length, 'slots');

  // Convert slots to masonry items format
  const masonryItems = slots.map(slot => ({
    id: slot.id.toString(),
    img: slot.image ? (slot.image.image_path || slot.image.image_url || slot.image.img) : null,
    url: '#',
    height: slot.height,
    slot: slot // Keep reference to original slot data
  }));
  
  console.log('Masonry items:', masonryItems.length, 'items');

  // Fetch hero images
  const fetchHeroImages = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin-token');
      
      const response = await fetch('/api/admin/hero-images', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Admin: API Response:', result);
        console.log('Admin: HeroImages from API:', result.data.heroImages);
        setHeroImages(result.data.heroImages || []);
      } else {
        toast.error('Failed to fetch hero images');
      }
    } catch (error) {
      console.error('Error fetching hero images:', error);
      toast.error('Error fetching hero images');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHeroImages();
  }, [fetchHeroImages]);

  // Handle slot click for masonry items
  const handleMasonryItemClick = (item) => {
    const slot = item.slot;
    handleSlotClick(slot);
  };

  // Handle image upload
  const handleImageUpload = async (file, slotId) => {
    try {
      setUploading(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'hero-images');

      // Upload file
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      const uploadResult = await uploadResponse.json();
      
      // Check if upload was successful
      if (!uploadResult.success) {
        throw new Error('Upload failed: ' + (uploadResult.error || 'Unknown error'));
      }
      
      // Create hero image record
      const token = localStorage.getItem('admin-token');
      const createResponse = await fetch('/api/admin/hero-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          imageUrl: uploadResult.url,
          imagePath: uploadResult.url,
          url: '#',
          height: 400,
          order: slotId
        })
      });

      if (createResponse.ok) {
        const newImageData = await createResponse.json();
        // Update state immediately without reload
        setHeroImages(prev => [...prev, newImageData.data]);
        toast.success('Hero image uploaded successfully');
        setShowUploadModal(false);
        setSelectedSlot(null);
      } else {
        const errorData = await createResponse.json();
        console.error('Create hero image error:', errorData);
        throw new Error(`Failed to create hero image record: ${errorData.meta?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // Handle delete image
  const handleDeleteImage = async (imageId) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const token = localStorage.getItem('admin-token');
      console.log('Delete token:', token ? 'Present' : 'Missing');
      
      const response = await fetch(`/api/admin/hero-images/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Delete response status:', response.status);
      
      if (response.ok) {
        // Update state immediately without reload
        setHeroImages(prev => prev.filter(img => img.id !== imageId));
        toast.success('Hero image deleted successfully');
      } else {
        const errorData = await response.json();
        console.error('Delete error response:', errorData);
        toast.error(`Failed to delete hero image: ${errorData.meta?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Error deleting image');
    }
  };

  // Handle slot click
  const handleSlotClick = (slot) => {
    if (slot.image) {
      // If slot has image, show options
      setSelectedSlot(slot);
    } else {
      // If slot is empty, show upload modal
      setSelectedSlot(slot);
      setFormData({
        imageUrl: '',
        imagePath: '',
        url: '',
        height: 400,
        order: slot.order,
        selectedFile: null
      });
      setShowUploadModal(true);
    }
  };

  // Handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        selectedFile: file
      }));
    }
  };

  // Handle add image button click
  const handleAddImage = () => {
    if (formData.selectedFile) {
      handleImageUpload(formData.selectedFile, selectedSlot.order);
    } else {
      toast.error('Please select a file first');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Manage Hero Section</h2>
          <p className="text-gray-400 text-sm">
            Click on empty slots to add images, or click on existing images to manage them
          </p>
        </div>

        {/* Masonry Hero Images Grid */}
        <div className="relative min-h-[600px] bg-transparent">
          <Masonry
            items={masonryItems}
            ease="power3.out"
            duration={0.6}
            stagger={0.05}
            animateFrom="bottom"
            scaleOnHover={true}
            hoverScale={0.95}
            blurToFocus={true}
            colorShiftOnHover={false}
            onItemClick={handleMasonryItemClick}
            renderItem={(item) => {
              const slot = item.slot;
              return (
                <div className="relative w-full h-full group">
                  {slot.image ? (
                    // Existing image
                    <div className="relative w-full h-full rounded-[10px] shadow-[0px_10px_50px_-10px_rgba(0,0,0,0.2)] overflow-hidden">
                      <img
                        src={slot.image.image_path || slot.image.image_url}
                        alt={`Hero image ${slot.order}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteImage(slot.image.id);
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors duration-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        Slot {slot.order}
                      </div>
                    </div>
                  ) : (
                    // Empty slot
                    <div className="w-full h-full border-2 border-dashed border-gray-400 rounded-[10px] shadow-[0px_10px_50px_-10px_rgba(0,0,0,0.2)] flex items-center justify-center hover:border-white transition-colors duration-200 bg-gray-800/50">
                      <div className="text-center">
                        <div className="w-8 h-8 mx-auto mb-2 text-gray-400 hover:text-white transition-colors duration-200">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <p className="text-xs text-gray-400 hover:text-white transition-colors duration-200">
                          Add Image
                        </p>
                      </div>
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        Slot {slot.order}
                      </div>
                    </div>
                  )}
                </div>
              );
            }}
          />
        </div>

        
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-white mb-4">
              Upload Image for Slot {selectedSlot?.order}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData.selectedFile && (
                  <p className="text-sm text-green-400 mt-2">
                    Selected: {formData.selectedFile.name}
                  </p>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedSlot(null);
                    setFormData(prev => ({ ...prev, selectedFile: null }));
                  }}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddImage}
                  disabled={!formData.selectedFile || uploading}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-md transition-colors duration-200 flex items-center justify-center"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    'Add Image'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageHeroSection;