import { Metadata } from 'next';

export const metadata = {
  title: 'Film Gallery - Nol Derajat Film',
  description: 'Koleksi lengkap karya sinematik Nol Derajat Film',
};

export default function GalleryLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
}
