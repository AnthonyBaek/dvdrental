import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { Country } from '@/types/country';

/**
 * 국가 관련 API 엔드포인트
 * 
 * GET /api/countries
 * - 모든 국가 목록을 조회
 * - 국가명 알파벳 순으로 정렬하여 반환
 * 
 * POST /api/countries 
 * - 새로운 국가 추가
 * - Request Body: { country: string }
 * - 추가된 국가 정보 반환
 */

export async function GET() {
  try {
    // 모든 국가 목록을 조회
    const result = await pool.query<Country>('SELECT * FROM country ORDER BY country');
    return NextResponse.json({ 
      success: true, 
      data: result.rows 
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );

  }

}

export async function POST(request: Request) {
  try {
    // 새로운 국가 추가
    const { country } = await request.json();
    const result = await pool.query<Country>(
      // 국가 테이블에 새로운 국가 추가
      'INSERT INTO country (country) VALUES ($1) RETURNING *',
      // 추가할 국가 이름   
      [country]
    );
    return NextResponse.json({
      success: true, 
      data: result.rows[0] 
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }

}
