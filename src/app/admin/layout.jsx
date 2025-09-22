import './admin.css';

export const metadata = {
  title: 'Admin Panel - Nolder Rajat Film',
  description: 'Panel administrasi untuk Nolder Rajat Film',
  robots: 'noindex, nofollow', // Mencegah indexing oleh search engine
};

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      {children}
    </div>
  );
}
