import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { errorMessage } from '../../http-error';
import { FeedbackItem } from '../../models';
import { FeedbackService } from '../../feedback.service';
import { SessionService } from '../../session.service';

type FeedbackMode = 'add' | 'edit';

@Component({
  selector: 'app-feedback',
  imports: [FormsModule],
  templateUrl: './feedback.html',
  styleUrl: './feedback.css',
})
export class FeedbackPage implements OnInit {
  private readonly feedbackApi = inject(FeedbackService);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);

  mode: FeedbackMode = 'add';
  message = '';
  myFeedback: FeedbackItem[] = [];
  selectedId = '';
  error = '';
  success = '';
  loading = false;

  ngOnInit(): void {
    this.loadMine();
  }

  get selected(): FeedbackItem | null {
    return this.myFeedback.find((item) => String(item.id) === this.selectedId) ?? null;
  }

  setMode(mode: FeedbackMode): void {
    this.mode = mode;
    this.error = '';
    this.success = '';
    if (mode === 'add') {
      this.message = '';
      return;
    }
    this.applySelection();
  }

  onSelect(id: string): void {
    this.selectedId = id;
    this.message = this.selected?.message ?? '';
  }

  optionLabel(item: FeedbackItem): string {
    const text = item.message.replace(/\s+/g, ' ').trim();
    const short = text.length > 48 ? `${text.slice(0, 48)}...` : text;
    return `${short} (${item.date})`;
  }

  submit(): void {
    this.error = '';
    this.success = '';
    const text = this.message.trim();

    if (this.mode === 'edit' && !this.selected) {
      this.error = 'No feedback submitted yet';
      return;
    }
    if (!text) {
      this.error = 'Please write your feedback';
      return;
    }

    this.loading = true;
    const request =
      this.mode === 'add'
        ? this.feedbackApi.add(text)
        : this.feedbackApi.update(Number(this.selectedId), text);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.success = this.mode === 'add' ? 'Feedback submitted' : 'Feedback updated';
        if (this.mode === 'add') {
          this.message = '';
        }
        this.loadMine();
      },
      error: (error: unknown) => {
        this.loading = false;
        this.error = errorMessage(error, 'Could not save feedback');
      },
    });
  }

  logout(): void {
    this.session.clear();
    void this.router.navigate(['/login']);
  }

  private loadMine(): void {
    this.feedbackApi.mine().subscribe({
      next: (items) => {
        this.myFeedback = [...items].sort((a, b) => b.id - a.id);
        if (this.mode === 'edit') {
          this.applySelection();
        }
      },
      error: (error: unknown) => {
        this.error = errorMessage(error, 'Could not load feedback');
      },
    });
  }

  private applySelection(): void {
    if (this.myFeedback.length === 0) {
      this.selectedId = '';
      this.message = '';
      return;
    }
    const current = this.selected ?? this.myFeedback[0];
    this.selectedId = String(current.id);
    this.message = current.message;
  }
}
