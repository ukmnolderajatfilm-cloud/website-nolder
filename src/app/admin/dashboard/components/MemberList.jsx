'use client';

import { motion } from 'framer-motion';

export default function MemberList({ 
  members, 
  onEdit, 
  onDelete, 
  isLoading = false 
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">Belum ada anggota</h3>
        <p className="text-gray-400">Klik "Tambah Anggota" untuk menambahkan anggota pertama.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {members.map((member, index) => (
        <motion.div
          key={member.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative group"
        >
          <div className="absolute inset-px rounded-lg bg-white/5"></div>
          <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-200">
            {/* Card Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  member.division?.code === 'anf' ? 'bg-purple-500' :
                  member.division?.code === 'psdi' ? 'bg-emerald-500' :
                  member.division?.code === 'psdm' ? 'bg-orange-500' :
                  member.division?.code === 'produksi' ? 'bg-red-500' :
                  member.division?.code === 'humi' ? 'bg-violet-500' :
                  member.division?.code === 'dea' ? 'bg-lime-500' :
                  member.division?.code === 'ketua_umum' ? 'bg-yellow-500' :
                  member.division?.code === 'wakil_ketua_umum' ? 'bg-yellow-600' :
                  'bg-gray-500'
                }`}></div>
                <span className="text-sm font-medium text-gray-300">
                  {member.division?.name || 'N/A'}
                </span>
              </div>
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(member)}
                  className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20 rounded-lg transition-colors"
                  title="Edit"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(member.id)}
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

            {/* Card Content */}
            <div className="flex-1 flex flex-col items-center text-center space-y-4">
              {/* Photo */}
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              
              {/* Name */}
              <h3 className="text-lg font-semibold text-white line-clamp-2">
                {member.name}
              </h3>
              
              {/* Position */}
              <p className="text-sm text-yellow-400 font-medium">
                {member.position}
              </p>
              
              {/* Description */}
              {member.description && (
                <p className="text-gray-400 text-sm line-clamp-3">
                  {member.description}
                </p>
              )}
            </div>

            {/* Card Footer */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="text-xs text-gray-500 text-center">
                Bergabung: {new Date(member.createdAt).toLocaleDateString('id-ID')}
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15"></div>
        </motion.div>
      ))}
    </div>
  );
}
