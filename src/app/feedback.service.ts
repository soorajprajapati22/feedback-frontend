import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { FeedbackItem, MessageResponse } from './models';

const API_URL = 'http://localhost:8080/api';

interface FeedbackPayload {
  id: number;
  message: string;
  date: string | number[];
  username: string;
}

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private readonly http = inject(HttpClient);

  mine(): Observable<FeedbackItem[]> {
    return this.http.get<FeedbackPayload[]>(`${API_URL}/feedback/my`).pipe(map(normalizeList));
  }

  all(): Observable<FeedbackItem[]> {
    return this.http.get<FeedbackPayload[]>(`${API_URL}/feedback`).pipe(map(normalizeList));
  }

  add(message: string): Observable<FeedbackItem> {
    return this.http
      .post<FeedbackPayload>(`${API_URL}/feedback`, { message })
      .pipe(map(normalizeItem));
  }

  update(id: number, message: string): Observable<FeedbackItem> {
    return this.http
      .put<FeedbackPayload>(`${API_URL}/feedback/${id}`, { message })
      .pipe(map(normalizeItem));
  }

  remove(id: number): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${API_URL}/feedback/${id}`);
  }
}

function normalizeList(items: FeedbackPayload[]): FeedbackItem[] {
  return items.map(normalizeItem);
}

function normalizeItem(item: FeedbackPayload): FeedbackItem {
  return { ...item, date: formatDate(item.date) };
}

function formatDate(date: string | number[]): string {
  if (Array.isArray(date)) {
    const [year, month, day] = date;
    const monthText = String(month).padStart(2, '0');
    const dayText = String(day).padStart(2, '0');
    return `${year}-${monthText}-${dayText}`;
  }
  return date ?? '';
}
