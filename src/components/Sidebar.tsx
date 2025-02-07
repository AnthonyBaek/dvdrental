"use client"; // 클라이언트 컴포넌트로 선언

import { Country } from '@/types/country';

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  country: Country | null;
};

export default function Sidebar({ isOpen, onClose, country }: SidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 w-1/3 h-full bg-white shadow-lg p-4 z-50">
      <h2 className="text-xl font-bold mb-4">Edit Country</h2>
      {country ? (
        <form>
          <label className="block mb-2">
            Country Name:
            <input type="text" defaultValue={country.country} className="border rounded p-2 w-full" />
          </label>
          <button type="submit" className="bg-green-500 text-white p-2 rounded">Save</button>
          <button type="button" onClick={onClose} className="ml-2 bg-gray-300 p-2 rounded">Close</button>
        </form>
      ) : (
        <p>No country selected</p>
      )}
    </div>
  );
} 