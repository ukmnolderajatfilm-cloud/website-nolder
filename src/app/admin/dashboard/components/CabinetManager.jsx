    'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCabinet } from '../hooks/useCabinet';
import { useDivisions } from '../hooks/useDivisions';
import CabinetForm from './CabinetForm';
import MemberForm from './MemberForm';
import CabinetList from './CabinetList';
import MemberList from './MemberList';

export default function CabinetManager() {
  const {
    cabinets,
    isLoading,
    error,
    fetchCabinets,
    createCabinet,
    updateCabinet,
    deleteCabinet,
    addMember,
    updateMember,
    deleteMember
  } = useCabinet();
  
  const { divisions } = useDivisions();

  // UI State
  const [showCabinetForm, setShowCabinetForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingCabinet, setEditingCabinet] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'date', 'status'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'inactive'
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    category: 'film'
  });


  const [showNameModal, setShowNameModal] = useState(false);
  const [tempName, setTempName] = useState('');
  
  // Member management state
  const [selectedCabinet, setSelectedCabinet] = useState(null);
  const [viewMode, setViewMode] = useState('structure'); // 'structure', 'cabinets', or 'members'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeCabinet, setActiveCabinet] = useState(null);

  // Cabinet handlers
  const handleCreateCabinet = async (cabinetData) => {
    setIsSubmitting(true);
    try {
      const result = await createCabinet(cabinetData);
      if (result.success) {
        // If new cabinet is active, ensure only one active cabinet
        if (cabinetData.status === 'active') {
          await ensureSingleActiveCabinet(result.cabinet.id);
        }
        setShowCabinetForm(false);
        setEditingCabinet(null);
        setFormData({
          name: '',
          description: '',
          status: 'active',
          category: 'film'
        });
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Error creating cabinet');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCabinet = (cabinet) => {
    setEditingCabinet(cabinet);
    setFormData({
      name: cabinet.name,
      description: cabinet.description || '',
      status: cabinet.status,
      category: cabinet.category || 'film'
    });
    setShowCabinetForm(true);
  };

  const handleUpdateCabinet = async (cabinetData, cabinetId = null) => {
    setIsSubmitting(true);
    try {
      const id = cabinetId || editingCabinet?.id;
      console.log('Updating cabinet:', id, cabinetData);
      
      if (!id) {
        throw new Error('Cabinet ID is required');
      }
      
      const result = await updateCabinet(id, cabinetData);
      console.log('Update result:', result);
      
      if (result.success) {
        // If cabinet is being set to active, ensure only one active cabinet
        if (cabinetData.status === 'active') {
          await ensureSingleActiveCabinet(id);
        }
        setShowCabinetForm(false);
        setEditingCabinet(null);
        setFormData({
          name: '',
          description: '',
          status: 'active',
          category: 'film'
        });
      } else {
        console.error('Update failed:', result.error);
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Error updating cabinet: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCabinet = async (cabinetId) => {
    if (confirm('Yakin ingin menghapus kabinet ini? Semua anggota akan ikut terhapus.')) {
      const result = await deleteCabinet(cabinetId);
      if (!result.success) {
        alert('Error: ' + result.error);
      }
    }
  };

  // Member handlers
  const handleManageMembers = (cabinet) => {
    setSelectedCabinet(cabinet);
    setViewMode('members');
  };

  const handleAddMember = () => {
    setEditingMember(null);
    setShowMemberForm(true);
  };

  const handleCreateMember = async (memberData) => {
    const cabinet = selectedCabinet || activeCabinet;
    if (!cabinet) {
      console.error('No cabinet selected');
      alert('No cabinet selected');
      return;
    }
    
    console.log('Creating member with data:', memberData);
    console.log('Cabinet ID:', cabinet.id);
    
    setIsSubmitting(true);
    try {
      const result = await addMember(cabinet.id, memberData);
      console.log('Add member result:', result);
      
      if (result.success) {
        console.log('Member created successfully');
        setShowMemberForm(false);
        setEditingMember(null);
        // Force refresh the cabinets data to ensure UI updates
        await fetchCabinets();
        console.log('Data refreshed after create member');
      } else {
        console.error('Add member failed:', result.error);
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating member:', error);
      console.error('Error details:', error.message, error.stack);
      alert('Error creating member: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    setShowMemberForm(true);
  };

  const handleUpdateMember = async (memberData) => {
    const cabinet = selectedCabinet || activeCabinet;
    if (!cabinet || !editingMember) return;
    
    console.log('Updating member with data:', memberData);
    console.log('Member ID:', editingMember.id, 'Cabinet ID:', cabinet.id);
    
    setIsSubmitting(true);
    try {
      const result = await updateMember(cabinet.id, editingMember.id, memberData);
      console.log('Update member result:', result);
      
      if (result.success) {
        console.log('Member updated successfully');
        setShowMemberForm(false);
        setEditingMember(null);
        // Force refresh the cabinets data to ensure UI updates
        await fetchCabinets();
        console.log('Data refreshed after update member');
      } else {
        console.error('Update member failed:', result.error);
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating member:', error);
      alert('Error updating member: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (confirm('Yakin ingin menghapus anggota ini?')) {
      const cabinet = selectedCabinet || activeCabinet;
      if (!cabinet) return;
      
      console.log('Deleting member:', memberId, 'from cabinet:', cabinet.id);
      const result = await deleteMember(cabinet.id, memberId);
      console.log('Delete result:', result);
      
      if (result.success) {
        console.log('Member deleted successfully, refreshing data...');
        // Force refresh the cabinets data to ensure UI updates
        await fetchCabinets();
        console.log('Data refreshed after delete member');
      } else {
        console.error('Delete member failed:', result.error);
        alert('Error: ' + result.error);
      }
    }
  };

  const handleBackToCabinets = () => {
    setViewMode('cabinets');
    setSelectedCabinet(null);
  };

  // Toggle view mode between cabinet structure and cabinet list
  const toggleViewMode = () => {
    setViewMode(viewMode === 'structure' ? 'cabinets' : 'structure');
  };

  // Get active cabinet (only return cabinet with status 'active')
  const getActiveCabinet = () => {
    const activeCabinets = cabinets.filter(cabinet => cabinet.status === 'active');
    
    // If multiple active cabinets, show warning and use the first one
    if (activeCabinets.length > 1) {
      console.warn('Multiple active cabinets found. Using the first one:', activeCabinets[0].name);
    }
    
    // Only return active cabinet, not fallback to first cabinet
    return activeCabinets.length > 0 ? activeCabinets[0] : null;
  };

  // Helper function to get division member data
  const getDivisionMember = (division, memberKey) => {
    const structure = getCabinetStructure(activeCabinet);
    return structure?.[division]?.[memberKey] || { name: '', image: '', description: '' };
  };

  // Get cabinet structure data from database
  const getCabinetStructure = (cabinet) => {
    if (!cabinet) return null;
    
    const members = cabinet.members || [];
    
    // Initialize structure with leadership positions
    const structure = {
      name: cabinet.name,
      description: cabinet.description,
      ketua: { name: 'Data Kosong', position: 'Ketua Umum', image: '', description: 'Data Kosong' },
      wakilKetua: { name: 'Data Kosong', position: 'Wakil Ketua Umum', image: '', description: 'Data Kosong' }
    };

    // Generate structure for each division dynamically
    divisions.forEach(division => {
      if (division.code === 'ketua_umum' || division.code === 'wakil_ketua_umum') {
        return; // Skip leadership divisions as they're handled above
      }

      // Define available positions for each division - all start as "Data Kosong"
      const positions = {
        ketua: { name: 'Data Kosong', position: `Ketua ${division.name}`, image: '', description: 'Data Kosong' },
        wakilKetua: { name: 'Data Kosong', position: `Wakil Ketua ${division.name}`, image: '', description: 'Data Kosong' },
        sekretaris: { name: 'Data Kosong', position: `Sekretaris ${division.name}`, image: '', description: 'Data Kosong' }
      };

      // Add bendahara for HUMI division
      if (division.code === 'humi') {
        positions.bendahara = { name: 'Data Kosong', position: `Bendahara ${division.name}`, image: '', description: 'Data Kosong' };
      }

      structure[division.code] = positions;
    });

    // Map members to structure
    members.forEach(member => {
      const divisionCode = member.division?.code || member.division;
      const position = member.position.toLowerCase();
      
      // Handle leadership positions (ketua_umum and wakil_ketua_umum)
      if (divisionCode === 'ketua_umum' || divisionCode === 'leadership') {
        if (position.includes('ketua') && !position.includes('wakil')) {
          structure.ketua = {
            name: member.name,
            position: member.position, // Use actual position from database
            image: member.image || '',
            description: member.description || 'Data Kosong'
          };
        }
      } else if (divisionCode === 'wakil_ketua_umum') {
        if (position.includes('wakil') && position.includes('ketua')) {
          structure.wakilKetua = {
            name: member.name,
            position: member.position, // Use actual position from database
            image: member.image || '',
            description: member.description || 'Data Kosong'
          };
        }
      } else if (structure[divisionCode]) {
        if (position.includes('ketua') && !position.includes('wakil')) {
          structure[divisionCode].ketua = {
            name: member.name,
            position: member.position, // Use actual position from database
            image: member.image || '',
            description: member.description || 'Data Kosong'
          };
        } else if (position.includes('wakil') && position.includes('ketua')) {
          structure[divisionCode].wakilKetua = {
            name: member.name,
            position: member.position, // Use actual position from database
            image: member.image || '',
            description: member.description || 'Data Kosong'
          };
        } else if (position.includes('sekretaris')) {
          structure[divisionCode].sekretaris = {
            name: member.name,
            position: member.position, // Use actual position from database
            image: member.image || '',
            description: member.description || 'Data Kosong'
          };
        } else if (position.includes('bendahara') && structure[divisionCode].bendahara) {
          structure[divisionCode].bendahara = {
            name: member.name,
            position: member.position, // Use actual position from database
            image: member.image || '',
            description: member.description || 'Data Kosong'
          };
        } else {
          // Handle other positions (like "Kabid HUMI") - assign to first available slot
          if (structure[divisionCode].ketua.name === 'Data Kosong') {
            structure[divisionCode].ketua = {
              name: member.name,
              position: member.position, // Use actual position from database
              image: member.image || '',
              description: member.description || 'Data Kosong'
            };
          } else if (structure[divisionCode].wakilKetua.name === 'Data Kosong') {
            structure[divisionCode].wakilKetua = {
              name: member.name,
              position: member.position, // Use actual position from database
              image: member.image || '',
              description: member.description || 'Data Kosong'
            };
          } else if (structure[divisionCode].sekretaris.name === 'Data Kosong') {
            structure[divisionCode].sekretaris = {
              name: member.name,
              position: member.position, // Use actual position from database
              image: member.image || '',
              description: member.description || 'Data Kosong'
            };
          } else if (structure[divisionCode].bendahara && structure[divisionCode].bendahara.name === 'Data Kosong') {
            structure[divisionCode].bendahara = {
              name: member.name,
              position: member.position, // Use actual position from database
              image: member.image || '',
              description: member.description || 'Data Kosong'
            };
          }
        }
      }
    });

    return structure;
  };


  // Update active cabinet and selected cabinet when cabinets change
  useEffect(() => {
    const active = getActiveCabinet();
    setActiveCabinet(active);
    
    // Update selected cabinet if it exists in the updated cabinets
    if (selectedCabinet) {
      const updatedSelectedCabinet = cabinets.find(cabinet => cabinet.id === selectedCabinet.id);
      if (updatedSelectedCabinet) {
        setSelectedCabinet(updatedSelectedCabinet);
      }
    }
  }, [cabinets, selectedCabinet]);

  // Function to ensure only one cabinet is active
  const ensureSingleActiveCabinet = async (newActiveCabinetId) => {
    try {
      // Set all other cabinets to inactive
      const otherActiveCabinets = cabinets.filter(cabinet => 
        cabinet.id !== newActiveCabinetId && cabinet.status === 'active'
      );
      
      for (const cabinet of otherActiveCabinets) {
        await updateCabinet(cabinet.id, {
          name: cabinet.name,
          description: cabinet.description,
          status: 'inactive'
        });
      }
    } catch (error) {
      console.error('Error ensuring single active cabinet:', error);
    }
  };

  // Filter and sort cabinets
  const filteredAndSortedCabinets = cabinets
    .filter(cabinet => {
      const searchMatch = cabinet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cabinet.description.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = filterStatus === 'all' || cabinet.status === filterStatus;
      return searchMatch && statusMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.lastUpdate) - new Date(a.lastUpdate);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });


  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Error</h3>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section - Nama Kabinet */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-4xl font-bold text-white">{activeCabinet?.name || 'Tidak ada kabinet aktif'}</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setTempName(activeCabinet?.name || '');
              setShowNameModal(true);
            }}
            className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
            </svg>
            Edit Nama
          </button>
        </div>
      </motion.div>

      {/* Navigation and Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {viewMode === 'cabinets' ? 'Manajemen Kabinet' : 
               viewMode === 'members' ? `Anggota ${(selectedCabinet || activeCabinet)?.name}` : 
               'Struktur Kabinet'}
            </h2>
            {viewMode === 'members' && (
              <p className="text-sm text-gray-400 mt-1">
                Kelola anggota kabinet
              </p>
            )}
            {viewMode === 'structure' && (
              <p className="text-sm text-gray-400 mt-1">
                Kelola struktur organisasi kabinet {activeCabinet?.name || 'Tidak ada kabinet aktif'}
              </p>
            )}
          </div>
          
          <div className="flex space-x-3">
            {/* View Mode Toggle */}
            <button
              onClick={toggleViewMode}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {viewMode === 'structure' ? 'Daftar Kabinet' : 'Struktur Kabinet'}
            </button>

            {viewMode === 'members' && (
              <button
                onClick={handleBackToCabinets}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                ← Kembali
              </button>
            )}
            
            {viewMode === 'cabinets' ? (
              <button
                onClick={() => setShowCabinetForm(true)}
                className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600 transition-colors"
              >
                + Tambah Kabinet
              </button>
            ) : viewMode === 'members' ? (
              <button
                onClick={handleAddMember}
                className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600 transition-colors"
              >
                + Tambah Anggota
              </button>
            ) : null}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center justify-between bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="text-sm text-gray-400">
              {viewMode === 'cabinets' 
                ? `${cabinets.length} kabinet` 
                : viewMode === 'members'
                ? `${(selectedCabinet || activeCabinet)?.members?.length || 0} anggota`
                : `${activeCabinet?.members?.length || 0} anggota`
              }
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content based on view mode */}
      {viewMode === 'cabinets' ? (
        <CabinetList
          cabinets={filteredAndSortedCabinets}
          onEdit={handleEditCabinet}
          onDelete={handleDeleteCabinet}
          onManageMembers={handleManageMembers}
          isLoading={isLoading}
        />
      ) : viewMode === 'members' ? (
        <MemberList
          members={(selectedCabinet || activeCabinet)?.members || []}
          onEdit={handleEditMember}
          onDelete={handleDeleteMember}
          isLoading={isLoading}
        />
      ) : (
        /* Structure View - Existing cabinet structure UI */
        !activeCabinet ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Belum ada kabinet yang sedang menjabat</h3>
            <p className="text-gray-400 mb-4">Silakan buat kabinet baru atau aktifkan kabinet yang sudah ada.</p>
            <button
              onClick={() => setViewMode('cabinets')}
              className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Kelola Kabinet
            </button>
          </div>
        ) : (
        <div className="space-y-8">
          {/* Section Ketua dan Wakil Ketua */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Ketua dan Wakil Ketua</h2>
          <hr className="border-gray-600 mb-6" />
        </div>

        {/* Grid Container untuk Ketua dan Wakil Ketua */}
        <div className="grid gap-4 sm:mt-8 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2">
          {/* Ketua Card */}
          <motion.div
            key="ketua"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative group"
          >
            <div className="absolute inset-px rounded-lg bg-white/5"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-200">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-300">
                    Ketua
                  </span>
                </div>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          // Find ketua member from active cabinet
                          const ketuaMember = activeCabinet?.members?.find(member => 
                            member.position.toLowerCase().includes('ketua') && 
                            !member.position.toLowerCase().includes('wakil') &&
                            member.division?.code === 'leadership'
                          );
                          if (ketuaMember) {
                            setEditingMember(ketuaMember);
                            setShowMemberForm(true);
                          } else {
                            // Create new ketua member
                            const leadershipDivision = divisions.find(d => d.code === 'leadership');
                            setEditingMember({
                              position: 'Ketua',
                              divisionId: leadershipDivision?.id
                            });
                            setShowMemberForm(true);
                          }
                        }}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Yakin ingin menghapus data ketua?')) {
                            const ketuaMember = activeCabinet?.members?.find(member => 
                              member.position.toLowerCase().includes('ketua') && 
                              !member.position.toLowerCase().includes('wakil') &&
                              member.division?.code === 'leadership'
                            );
                            if (ketuaMember) {
                              handleDeleteMember(ketuaMember.id);
                            }
                          }
                        }}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd"/>
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                        </svg>
                      </button>
                </div>
              </div>

              {/* Card Content - Centered */}
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                {/* Jabatan */}
                <h3 className="text-lg font-semibold text-white">Ketua Kabinet</h3>
                
                    {/* Foto */}
                    <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                      {(() => {
                        const structure = getCabinetStructure(activeCabinet);
                        return structure?.ketua?.image ? (
                          <img
                            src={structure.ketua.image}
                            alt="Ketua"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        );
                      })()}
                    </div>
                    
                    {/* Nama */}
                    <h4 className="text-xl font-bold text-white">
                      {(() => {
                        const structure = getCabinetStructure(activeCabinet);
                        return structure?.ketua?.name === 'Data Kosong' ? 'Data Kosong' : structure?.ketua?.name || 'Data Kosong';
                      })()}
                    </h4>
                    
                    {/* Deskripsi */}
                    <p className="text-gray-400 text-sm line-clamp-3">
                      {(() => {
                        const structure = getCabinetStructure(activeCabinet);
                        return structure?.ketua?.description === 'Data Kosong' ? 'Data Kosong' : structure?.ketua?.description || 'Data Kosong';
                      })()}
                    </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15"></div>
          </motion.div>

          {/* Wakil Ketua Card */}
          <motion.div
            key="wakilKetua"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative group"
          >
            <div className="absolute inset-px rounded-lg bg-white/5"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-200">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-300">
                    Wakil Ketua
                  </span>
                </div>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          // Find wakil ketua member from active cabinet
                          const wakilKetuaMember = activeCabinet?.members?.find(member => 
                            member.position.toLowerCase().includes('wakil') && 
                            member.position.toLowerCase().includes('ketua') &&
                            member.division?.code === 'leadership'
                          );
                          if (wakilKetuaMember) {
                            setEditingMember(wakilKetuaMember);
                            setShowMemberForm(true);
                          } else {
                            // Create new wakil ketua member
                            const leadershipDivision = divisions.find(d => d.code === 'leadership');
                            setEditingMember({
                              position: 'Wakil Ketua',
                              divisionId: leadershipDivision?.id
                            });
                            setShowMemberForm(true);
                          }
                        }}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Yakin ingin menghapus data wakil ketua?')) {
                            const wakilKetuaMember = activeCabinet?.members?.find(member => 
                              member.position.toLowerCase().includes('wakil') && 
                              member.position.toLowerCase().includes('ketua') &&
                              member.division?.code === 'leadership'
                            );
                            if (wakilKetuaMember) {
                              handleDeleteMember(wakilKetuaMember.id);
                            }
                          }
                        }}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd"/>
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                        </svg>
                      </button>
                </div>
              </div>

              {/* Card Content - Centered */}
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                {/* Jabatan */}
                <h3 className="text-lg font-semibold text-white">Wakil Ketua Kabinet</h3>
                
                    {/* Foto */}
                    <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                      {(() => {
                        const structure = getCabinetStructure(activeCabinet);
                        return structure?.wakilKetua?.image ? (
                          <img
                            src={structure.wakilKetua.image}
                            alt="Wakil Ketua"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        );
                      })()}
                    </div>
                    
                    {/* Nama */}
                    <h4 className="text-xl font-bold text-white">
                      {(() => {
                        const structure = getCabinetStructure(activeCabinet);
                        return structure?.wakilKetua?.name === 'Data Kosong' ? 'Data Kosong' : structure?.wakilKetua?.name || 'Data Kosong';
                      })()}
                    </h4>
                    
                    {/* Deskripsi */}
                    <p className="text-gray-400 text-sm line-clamp-3">
                      {(() => {
                        const structure = getCabinetStructure(activeCabinet);
                        return structure?.wakilKetua?.description === 'Data Kosong' ? 'Data Kosong' : structure?.wakilKetua?.description || 'Data Kosong';
                      })()}
                    </p>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15"></div>
          </motion.div>
        </div>
      </motion.div>

      {/* Dynamic Divisi Sections */}
      {divisions.filter(division => 
        division.code !== 'ketua_umum' && division.code !== 'wakil_ketua_umum'
      ).map((division, divisionIndex) => {
        const structure = getCabinetStructure(activeCabinet);
        const divisionData = structure?.[division.code] || {};
        
        // Define available positions for this division
        const positions = [
          { key: 'ketua', title: `Ketua ${division.name}`, color: 'purple' },
          { key: 'wakilKetua', title: `Wakil Ketua ${division.name}`, color: 'indigo' },
          { key: 'sekretaris', title: `Sekretaris ${division.name}`, color: 'blue' }
        ];

        // Add bendahara for HUMI division
        if (division.code === 'humi') {
          positions.push({ key: 'bendahara', title: `Bendahara ${division.name}`, color: 'violet' });
        }

        return (
          <motion.div
            key={division.code}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + divisionIndex * 0.4 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Divisi {division.name}</h2>
                <p className="text-sm text-gray-400 mb-2">{division.description}</p>
                <hr className="border-gray-600" />
              </div>
              <button
                onClick={() => {
                  setEditingMember(`${division.code}.new`);
                  setShowMemberForm(true);
                }}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
                </svg>
                Tambah Anggota
              </button>
            </div>

            <div className={`grid gap-4 sm:mt-8 ${
              division.code === 'humi' 
                ? 'lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4' 
                : 'lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3'
            }`}>
              {positions.map((member, index) => (
                <motion.div
                  key={member.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + divisionIndex * 0.4 + index * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute inset-px rounded-lg bg-white/5"></div>
                  <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 bg-${member.color}-500/20 rounded-lg flex items-center justify-center`}>
                          <svg className={`w-4 h-4 text-${member.color}-400`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-300">
                          {member.title}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            const memberData = divisionData[member.key];
                            if (memberData?.name) {
                              setEditingMember(memberData);
                              setShowMemberForm(true);
                            }
                          }}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Yakin ingin menghapus data ${member.title.toLowerCase()}?`)) {
                              // Find member from active cabinet
                              const memberToDelete = activeCabinet?.members?.find(m => 
                                m.position.toLowerCase().includes(member.key === 'wakilKetua' ? 'wakil' : member.key) && 
                                m.division?.code === division.code
                              );
                              if (memberToDelete) {
                                handleDeleteMember(memberToDelete.id);
                              }
                            }
                          }}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd"/>
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                      <h3 className="text-lg font-semibold text-white">{member.title}</h3>
                      
                      <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                        {divisionData[member.key]?.image ? (
                          <img
                            src={divisionData[member.key].image}
                            alt={member.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        )}
                      </div>
                      
                      <h4 className="text-xl font-bold text-white">
                        {divisionData[member.key]?.name === 'Data Kosong' ? 'Data Kosong' : divisionData[member.key]?.name || 'Data Kosong'}
                      </h4>
                      
                      <p className="text-gray-400 text-sm line-clamp-3">
                        {divisionData[member.key]?.description === 'Data Kosong' ? 'Data Kosong' : divisionData[member.key]?.description || 'Data Kosong'}
                      </p>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15"></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      })}










      {/* Modal Edit Nama Kabinet */}
      {showNameModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold text-white mb-4">Edit Nama Kabinet</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nama Kabinet
              </label>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Masukkan nama kabinet"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={async () => {
                  if (activeCabinet) {
                    await handleUpdateCabinet({
                      name: tempName,
                      description: activeCabinet.description,
                      status: activeCabinet.status
                    }, activeCabinet.id);
                  }
                  setShowNameModal(false);
                }}
                className="flex-1 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Simpan
              </button>
              <button
                onClick={() => setShowNameModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Batal
              </button>
            </div>
          </motion.div>
        </div>
      )}

        </div>
        )
      )}

      {/* Modals */}
      <CabinetForm
        isOpen={showCabinetForm}
        onClose={() => {
          setShowCabinetForm(false);
          setEditingCabinet(null);
        }}
        onSubmit={editingCabinet ? handleUpdateCabinet : handleCreateCabinet}
        editingCabinet={editingCabinet}
        isLoading={isSubmitting}
      />

      <MemberForm
        isOpen={showMemberForm}
        onClose={() => {
          setShowMemberForm(false);
          setEditingMember(null);
        }}
        onSubmit={editingMember ? handleUpdateMember : handleCreateMember}
        editingMember={editingMember}
        isLoading={isSubmitting}
        cabinetId={selectedCabinet?.id}
      />
    </div>
  );
}
