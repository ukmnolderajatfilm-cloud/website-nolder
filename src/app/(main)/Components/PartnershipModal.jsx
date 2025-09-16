'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PartnershipModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    namaOrganisasi: '',
    judulPartnership: '',
    isiPartnership: '',
    dokumen: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle file upload
  const handleFileChange = (file) => {
    if (file) {
      // Validate file type (PDF, DOC, DOCX, PNG, JPG, JPEG)
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/png',
        'image/jpeg',
        'image/jpg'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          dokumen: 'File type not supported. Please upload PDF, DOC, DOCX, PNG, JPG, or JPEG files.'
        }));
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          dokumen: 'File size too large. Maximum size is 10MB.'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        dokumen: file
      }));
      setErrors(prev => ({
        ...prev,
        dokumen: ''
      }));
    }
  };

  // Handle drag and drop
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, []);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.namaOrganisasi.trim()) {
      newErrors.namaOrganisasi = 'Nama organisasi wajib diisi';
    }
    
    if (!formData.judulPartnership.trim()) {
      newErrors.judulPartnership = 'Judul partnership wajib diisi';
    }
    
    if (!formData.isiPartnership.trim()) {
      newErrors.isiPartnership = 'Isi partnership wajib diisi';
    } else if (formData.isiPartnership.trim().length < 50) {
      newErrors.isiPartnership = 'Isi partnership minimal 50 karakter';
    }
    
    if (!formData.dokumen) {
      newErrors.dokumen = 'Dokumen pendukung wajib diupload';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send the form data to your backend
      console.log('Partnership Form Data:', formData);
      
      // Reset form
      setFormData({
        namaOrganisasi: '',
        judulPartnership: '',
        isiPartnership: '',
        dokumen: null
      });
      
      // Show success message (you could add a toast notification here)
      alert('Partnership inquiry submitted successfully! We will contact you soon.');
      
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      rotateX: -15,
      y: 100
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500,
        duration: 0.6
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      rotateX: 15,
      y: -100,
      transition: {
        duration: 0.3
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="partnership-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />
          
          {/* Cinematic Film Grain Background */}
          <div className="absolute inset-0 opacity-20">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 30%, rgba(255, 215, 0, 0.03) 2px, transparent 2px),
                  radial-gradient(circle at 80% 70%, rgba(255, 140, 0, 0.02) 1px, transparent 1px),
                  radial-gradient(circle at 40% 80%, rgba(139, 69, 19, 0.015) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px, 40px 40px, 80px 80px',
                animation: 'cinematicGrain 25s linear infinite'
              }}
            />
          </div>

          {/* Cinematic Light Rays */}
          <div className="absolute inset-0 overflow-hidden opacity-30">
            <div 
              className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-conic from-yellow-400/20 via-transparent to-transparent"
              style={{
                background: 'conic-gradient(from 45deg, rgba(255, 215, 0, 0.1) 0deg, transparent 60deg, transparent 300deg, rgba(255, 215, 0, 0.05) 360deg)',
                animation: 'cinematicRotate 30s linear infinite'
              }}
            />
            <div 
              className="absolute -bottom-20 -right-20 w-60 h-60 bg-gradient-conic from-orange-500/20 via-transparent to-transparent"
              style={{
                background: 'conic-gradient(from 225deg, rgba(255, 140, 0, 0.08) 0deg, transparent 90deg, transparent 270deg, rgba(255, 140, 0, 0.04) 360deg)',
                animation: 'cinematicRotate 40s linear infinite reverse'
              }}
            />
          </div>

          {/* Modal Container */}
          <motion.div
            key="modal-container"
            className="relative w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ perspective: 1000 }}
          >
            {/* Cinematic Border Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/30 via-orange-600/20 to-amber-600/30 rounded-3xl blur-2xl" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-500/5 to-transparent rounded-3xl" />
            
            {/* Main Modal - Cinematic Design */}
            <div className="relative bg-gradient-to-br from-black/98 via-gray-950/95 to-black/98 backdrop-blur-2xl border-2 border-yellow-600/30 rounded-3xl overflow-hidden shadow-2xl shadow-yellow-500/10">
              
              {/* Film Strip Decoration */}
              <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-yellow-600/20 via-yellow-500/30 to-yellow-600/20 flex items-center justify-center space-x-2">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="w-1 h-4 bg-yellow-400/40 rounded-full" />
                ))}
              </div>
              
              {/* Film Strip Bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-yellow-600/20 via-yellow-500/30 to-yellow-600/20 flex items-center justify-center space-x-2">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="w-1 h-4 bg-yellow-400/40 rounded-full" />
                ))}
              </div>
              
              {/* Header Section - Cinematic Style */}
              <div className="relative pt-12 pb-8 px-8 border-b border-yellow-600/20">
                {/* Cinematic Header Background */}
                <div className="absolute inset-0 opacity-10">
                  <div 
                    className="w-full h-full"
                    style={{
                      backgroundImage: `
                        linear-gradient(45deg, rgba(255, 215, 0, 0.1) 25%, transparent 25%),
                        linear-gradient(-45deg, rgba(255, 215, 0, 0.1) 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, rgba(255, 215, 0, 0.1) 75%),
                        linear-gradient(-45deg, transparent 75%, rgba(255, 215, 0, 0.1) 75%)
                      `,
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                    }}
                  />
                </div>
                
                {/* Cinematic Spotlight Effect */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-32 bg-gradient-radial from-yellow-400/20 to-transparent blur-3xl" />
                
                <div className="relative flex items-center justify-between">
                  <div className="flex-1">
                    <motion.div
                      className="flex items-center space-x-4 mb-4"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {/* Film Reel Icon */}
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30">
                        <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 5-5v10z"/>
                        </svg>
                      </div>
                      
                      <div>
                        <motion.h2 
                          className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-500 mb-1 font-serif tracking-wide"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                          style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.3)' }}
                        >
                          PARTNERSHIP INQUIRY
                        </motion.h2>
                        <motion.div 
                          className="h-0.5 w-32 bg-gradient-to-r from-yellow-400 to-orange-500 mb-2"
                          initial={{ width: 0 }}
                          animate={{ width: 128 }}
                          transition={{ delay: 0.5, duration: 0.8 }}
                        />
                      </div>
                    </motion.div>
                    
                    <motion.p 
                      className="text-gray-300 text-lg font-light italic max-w-2xl leading-relaxed"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      "Mari berkolaborasi untuk menciptakan karya sinematik yang menginspirasi dan mengubah dunia"
                    </motion.p>
                  </div>
                  
                  {/* Close Button */}
                  <motion.button
                    onClick={onClose}
                    className="group p-3 bg-gray-800/50 hover:bg-red-500/20 border border-gray-600 hover:border-red-500/50 rounded-xl transition-all duration-300"
                    whileHover={{ scale: 1.05, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <svg className="w-6 h-6 text-gray-400 group-hover:text-red-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
              </div>

              {/* Form Section - Cinematic Style */}
              <form onSubmit={handleSubmit} className="p-8 space-y-8 relative">
                {/* Cinematic Form Background */}
                <div className="absolute inset-0 opacity-5">
                  <div 
                    className="w-full h-full"
                    style={{
                      backgroundImage: `
                        repeating-linear-gradient(
                          90deg,
                          transparent,
                          transparent 2px,
                          rgba(255, 215, 0, 0.1) 2px,
                          rgba(255, 215, 0, 0.1) 4px
                        )
                      `,
                      backgroundSize: '100px 100px'
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Nama Organisasi */}
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-sm font-bold text-yellow-300 mb-3 uppercase tracking-wider flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50" />
                      <span>Nama Organisasi *</span>
                    </label>
                    <div className="relative group">
                      {/* Cinematic Input Border */}
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/30 via-orange-500/20 to-yellow-600/30 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                      
                      <input
                        type="text"
                        name="namaOrganisasi"
                        value={formData.namaOrganisasi}
                        onChange={handleInputChange}
                        className={`relative w-full px-6 py-4 bg-black/60 border-2 rounded-2xl text-white placeholder-gray-400 focus:outline-none transition-all duration-500 backdrop-blur-sm ${
                          errors.namaOrganisasi 
                            ? 'border-red-500/70 shadow-lg shadow-red-500/20' 
                            : 'border-yellow-600/40 focus:border-yellow-400/80 focus:shadow-lg focus:shadow-yellow-400/20'
                        }`}
                        placeholder="Masukkan nama organisasi Anda..."
                        style={{ 
                          fontFamily: 'serif',
                          textShadow: errors.namaOrganisasi ? 'none' : '0 0 10px rgba(255, 215, 0, 0.2)'
                        }}
                      />
                      
                      {/* Cinematic Scan Line Effect */}
                      <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 animate-pulse" />
                    </div>
                    {errors.namaOrganisasi && (
                      <motion.p 
                        className="text-red-400 text-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {errors.namaOrganisasi}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Judul Partnership */}
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label className="block text-sm font-semibold text-yellow-400 mb-2">
                      Judul Partnership *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="judulPartnership"
                        value={formData.judulPartnership}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                          errors.judulPartnership 
                            ? 'border-red-500 focus:ring-red-500/50' 
                            : 'border-gray-600 focus:border-yellow-400 focus:ring-yellow-400/50'
                        }`}
                        placeholder="Masukkan judul partnership"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/10 to-orange-400/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                    {errors.judulPartnership && (
                      <motion.p 
                        className="text-red-400 text-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {errors.judulPartnership}
                      </motion.p>
                    )}
                  </motion.div>
                </div>

                {/* Isi Partnership */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <label className="block text-sm font-semibold text-yellow-400 mb-2">
                    Isi Partnership *
                  </label>
                  <div className="relative">
                    <textarea
                      name="isiPartnership"
                      value={formData.isiPartnership}
                      onChange={handleInputChange}
                      rows={6}
                      className={`w-full px-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 resize-none ${
                        errors.isiPartnership 
                          ? 'border-red-500 focus:ring-red-500/50' 
                          : 'border-gray-600 focus:border-yellow-400 focus:ring-yellow-400/50'
                      }`}
                      placeholder="Deskripsikan detail partnership yang Anda inginkan, tujuan kolaborasi, timeline, dan ekspektasi hasil (minimal 50 karakter)"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/10 to-orange-400/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      {errors.isiPartnership && (
                        <motion.p 
                          className="text-red-400 text-sm"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {errors.isiPartnership}
                        </motion.p>
                      )}
                    </div>
                    <span className={`text-sm ${formData.isiPartnership.length >= 50 ? 'text-green-400' : 'text-gray-500'}`}>
                      {formData.isiPartnership.length}/50 minimum
                    </span>
                  </div>
                </motion.div>

                {/* Document Upload */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <label className="block text-sm font-semibold text-yellow-400 mb-2">
                    Dokumen Pendukung *
                  </label>
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                      dragActive 
                        ? 'border-yellow-400 bg-yellow-400/10' 
                        : errors.dokumen
                        ? 'border-red-500 bg-red-500/5'
                        : 'border-gray-600 hover:border-yellow-400/50 hover:bg-yellow-400/5'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={(e) => handleFileChange(e.target.files[0])}
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      className="hidden"
                    />
                    
                    {formData.dokumen ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center">
                          <div className="p-3 bg-green-500/20 rounded-full">
                            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <p className="text-white font-medium">{formData.dokumen.name}</p>
                          <p className="text-gray-400 text-sm">{(formData.dokumen.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, dokumen: null }))}
                          className="text-red-400 hover:text-red-300 text-sm underline"
                        >
                          Remove file
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center">
                          <div className="p-3 bg-yellow-400/20 rounded-full">
                            <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <p className="text-white font-medium">Drag & drop your file here</p>
                          <p className="text-gray-400 text-sm">or click to browse</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-6 py-2 bg-yellow-400/20 hover:bg-yellow-400/30 border border-yellow-400/50 hover:border-yellow-400 rounded-lg text-yellow-400 font-medium transition-all duration-300"
                        >
                          Choose File
                        </button>
                        <p className="text-gray-500 text-xs">
                          Supported formats: PDF, DOC, DOCX, PNG, JPG, JPEG (Max 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                  {errors.dokumen && (
                    <motion.p 
                      className="text-red-400 text-sm"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.dokumen}
                    </motion.p>
                  )}
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  className="pt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-300 ${
                      isSubmitting
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black hover:shadow-lg hover:shadow-yellow-500/25 transform hover:scale-[1.02]'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <motion.div
                          className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      'Submit Partnership Inquiry'
                    )}
                  </button>
                </motion.div>
              </form>
            </div>

            {/* Cinematic Corner Decorations */}
            <div className="absolute top-4 left-4 w-12 h-12">
              <div className="w-full h-full border-t-3 border-l-3 border-yellow-400/70 rounded-tl-3xl" />
              <div className="absolute top-1 left-1 w-2 h-2 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50" />
            </div>
            <div className="absolute top-4 right-4 w-12 h-12">
              <div className="w-full h-full border-t-3 border-r-3 border-orange-400/70 rounded-tr-3xl" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-orange-400 rounded-full shadow-lg shadow-orange-400/50" />
            </div>
            <div className="absolute bottom-4 left-4 w-12 h-12">
              <div className="w-full h-full border-b-3 border-l-3 border-yellow-400/70 rounded-bl-3xl" />
              <div className="absolute bottom-1 left-1 w-2 h-2 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50" />
            </div>
            <div className="absolute bottom-4 right-4 w-12 h-12">
              <div className="w-full h-full border-b-3 border-r-3 border-orange-400/70 rounded-br-3xl" />
              <div className="absolute bottom-1 right-1 w-2 h-2 bg-orange-400 rounded-full shadow-lg shadow-orange-400/50" />
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Additional CSS for Cinematic Animations */}
      <style jsx global>{`
        @keyframes cinematicGrain {
          0%, 100% { 
            transform: translate(0, 0) rotate(0deg); 
            opacity: 0.2;
          }
          25% { 
            transform: translate(-2%, -3%) rotate(0.5deg); 
            opacity: 0.25;
          }
          50% { 
            transform: translate(1%, -1%) rotate(-0.3deg); 
            opacity: 0.15;
          }
          75% { 
            transform: translate(-1%, 2%) rotate(0.2deg); 
            opacity: 0.3;
          }
        }
        
        @keyframes cinematicRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        /* Cinematic Border Utilities */
        .border-t-3 { border-top-width: 3px; }
        .border-l-3 { border-left-width: 3px; }
        .border-r-3 { border-right-width: 3px; }
        .border-b-3 { border-bottom-width: 3px; }
        .rounded-tl-3xl { border-top-left-radius: 1.5rem; }
        .rounded-tr-3xl { border-top-right-radius: 1.5rem; }
        .rounded-bl-3xl { border-bottom-left-radius: 1.5rem; }
        .rounded-br-3xl { border-bottom-right-radius: 1.5rem; }
      `}</style>
    </AnimatePresence>
  );
};

export default PartnershipModal;
