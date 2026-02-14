import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContentReminder from './ContentReminder';

// Mock fetch
global.fetch = jest.fn();

describe('ContentReminder Component', () => {
  const mockCSVData = `date,format,title_seed,cta
2026-10-26,Longform,행동의 불,댓글에 실행 한 줄
2026-10-27,Shorts,준비운동 시스템,쇼츠로 리메이크
2026-10-28,Podcast,15분 퍼블리시,뉴스레터 구독`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    fetch.mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<ContentReminder />);
    expect(screen.getByText(/콘텐츠 캘린더 로딩 중/i)).toBeInTheDocument();
  });

  test('renders error state when fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));
    
    render(<ContentReminder />);
    
    await waitFor(() => {
      expect(screen.getByText(/콘텐츠 캘린더를 불러올 수 없습니다/i)).toBeInTheDocument();
    });
  });

  test('renders empty state when no upcoming content', async () => {
    const pastCSV = `date,format,title_seed,cta
2024-01-01,Longform,Past,Test`;
    
    fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(pastCSV)
    });
    
    render(<ContentReminder />);
    
    await waitFor(() => {
      expect(screen.getByText(/예정된 콘텐츠가 없습니다/i)).toBeInTheDocument();
    });
  });

  test('renders upcoming content successfully', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockCSVData)
    });
    
    render(<ContentReminder />);
    
    await waitFor(() => {
      expect(screen.getByText(/콘텐츠 캘린더 리마인더/i)).toBeInTheDocument();
    });
    
    // Check if content items are rendered
    await waitFor(() => {
      expect(screen.getByText(/Longform/i)).toBeInTheDocument();
      expect(screen.getByText(/Shorts/i)).toBeInTheDocument();
    });
  });

  test('displays reminder tip in footer', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockCSVData)
    });
    
    render(<ContentReminder />);
    
    await waitFor(() => {
      expect(screen.getByText(/RUNBOOK\.md를 참고하여/i)).toBeInTheDocument();
    });
  });

  test('renders content with title_seed and CTA', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockCSVData)
    });
    
    render(<ContentReminder />);
    
    await waitFor(() => {
      expect(screen.getByText(/행동의 불/i)).toBeInTheDocument();
      expect(screen.getByText(/댓글에 실행 한 줄/i)).toBeInTheDocument();
    });
  });
});
