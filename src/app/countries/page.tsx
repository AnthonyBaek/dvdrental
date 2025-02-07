"use client"; // 클라이언트 컴포넌트로 선언

import { useEffect, useState } from 'react';
import { Country } from '@/types/country';
import Sidebar from '@/components/Sidebar'; // 사이드바 컴포넌트 임포트

// 컴포넌트 정의
// 1. 국가 목록을 표시하는 컴포넌트
// 2. 국가 추가, 수정, 삭제 기능 제공
// 3. 사이드바를 이용해 국가 정보 수정 가능

export default function CountriesPage() {

    // 상태 관리
    // 1. 국가 목록을 저장할 countries 상태
    // 2. 로딩 상태를 저장할 loading 상태
    // 3. 에러 메시지를 저장할 error 상태
    // 4. 선택된 국가를 저장할 selectedCountries 상태
    // 5. 사이드바 열림 상태를 저장할 isSidebarOpen 상태
    // 6. 현재 선택된 국가를 저장할 currentCountry 상태

  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountries, setSelectedCountries] = useState<number[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // 컴포넌트가 마운트될 때 국가 목록을 가져오는 useEffect
  // 1. API 엔드포인트(/api/countries)로 GET 요청을 보냄
  // 2. 응답이 성공적이면 데이터를 countries 상태에 저장
  // 3. 에러 발생 시 에러 메시지를 error 상태에 저장
  // 4. 로딩 상태를 false로 변경하여 로딩 완료를 표시

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('/api/countries');
        if (!response.ok) throw new Error('Failed to fetch countries');
        const data = await response.json();
        setCountries(data.data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();   // 국가 목록을 가져오는 함수 호출
  }, []);

  // 선택된 국가를 삭제하는 함수
  // 1. 선택된 국가가 없으면 아무것도 하지 않음
  // 2. 선택된 국가가 있으면 각 국가를 삭제하는 DELETE 요청을 보냄
  // 3. 삭제 요청이 성공하면 해당 국가를 countries 상태에서 제거
  // 4. 에러 발생 시 에러 메시지를 error 상태에 저장

  const handleDeleteSelected = async () => {
    if (selectedCountries.length === 0) return; // 선택된 국가가 없으면 아무것도 하지 않음

    try {
        // 선택된 국가를 삭제하는 요청을 보냄
      await Promise.all(
        selectedCountries.map(id => fetch(`/api/countries/${id}`, { method: 'DELETE' }))
      );
      // 삭제 요청이 성공하면 해당 국가를 countries 상태에서 제거
      setCountries(countries.filter(country => !selectedCountries.includes(country.country_id)));
      // 선택된 국가를 초기화
      setSelectedCountries([]);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  };

  const indexOfLastCountry = currentPage * itemsPerPage;
  const indexOfFirstCountry = indexOfLastCountry - itemsPerPage;
  const currentCountries = countries.slice(indexOfFirstCountry, indexOfLastCountry);
  const totalPages = Math.ceil(countries.length / itemsPerPage);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-[90%] mx-auto space-y-8">
        {/* 헤더 섹션 */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">국가 관리</h1>
          <p className="text-lg text-gray-600">
            전체 {countries.length}개 국가 데이터를 관리하고 있습니다
          </p>
        </div>

        {/* 버튼 섹션 */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => {
              setCurrentCountry(null);
              setIsSidebarOpen(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <span>새 국가 추가</span>
          </button>
          <button 
            onClick={handleDeleteSelected}
            disabled={selectedCountries.length === 0}
            className="btn-danger flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>선택 삭제 ({selectedCountries.length})</span>
          </button>
        </div>

        {/* 테이블 섹션 */}
        <div className="table-container bg-white">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <colgroup>
                <col className="w-[8%]" />
                <col className="w-[12%]" />
                <col className="w-[40%]" />
                <col className="w-[30%]" />
                <col className="w-[10%]" />
              </colgroup>
              <thead className="table-header">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={selectedCountries.length === currentCountries.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCountries(currentCountries.map(c => c.country_id));
                        } else {
                          setSelectedCountries([]);
                        }
                      }}
                    />
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    국가명
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    최종 수정일
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentCountries.map((country) => (
                  <tr 
                    key={country.country_id}
                    className="table-row"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={selectedCountries.includes(country.country_id)}
                        onChange={() => {
                          setSelectedCountries(prev =>
                            prev.includes(country.country_id)
                              ? prev.filter(id => id !== country.country_id)
                              : [...prev, country.country_id]
                          );
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {country.country_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {country.country}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(country.last_update).toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setCurrentCountry(country);
                          setIsSidebarOpen(true);
                        }}
                        className="text-primary-600 hover:text-primary-900 font-medium"
                      >
                        수정
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 페이지네이션 섹션 */}
        <div className="flex items-center justify-between bg-white px-6 py-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-700 font-medium">
            {indexOfFirstCountry + 1}-{Math.min(indexOfLastCountry, countries.length)} / 총 {countries.length}개
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>
            <span className="px-4 py-2 text-sm font-medium text-gray-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        </div>
      </div>

      {isSidebarOpen && (
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          country={currentCountry}
        />
      )}
    </div>
  );
} 