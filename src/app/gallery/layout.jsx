import { Metadata } from 'next';

export const metadata = {
  title: 'Film Gallery - Nol Derajat Film',
  description: 'Koleksi lengkap karya sinematik Nol Derajat Film',
};

export default function GalleryLayout({ children }) {
  return (
    <>
      <link rel="preload" href="/Images/poster-film/TBFSP.jpg" as="image" />
      {children}
    </>
  );
}
