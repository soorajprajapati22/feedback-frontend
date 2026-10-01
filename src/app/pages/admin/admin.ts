import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { errorMessage } from '../../http-error';
import { FeedbackItem } from '../../models';
import { FeedbackService } from '../../feedback.service';
import { SessionService } from '../../session.service';

type Panel = 'view' | 'edit' | null;

@Component({
  selector: 'app-admin',
  imports: [FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class AdminPage implements OnInit {
  private readonly feedbackApi = inject(FeedbackService);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);

  items: FeedbackItem[] = [];
  loaded = false;
  panel: Panel = null;
  active: FeedbackItem | null = null;
  editMessage = '';
  error = '';
  success = '';
  loading = false;

  ngOnInit(): void {
    this.load();
  }

  view(item: FeedbackItem): void {
    this.panel = 'view';
    this.active = item;
    this.error = '';
    this.success = '';
  }

  startEdit(item: FeedbackItem): void {
    this.panel = 'edit';
    this.active = item;
    this.editMessage = item.message;
    this.error = '';
    this.success = '';
  }

  closePanel(): void {
    this.panel = null;
    this.active = null;
    this.editMessage = '';
  }

  saveEdit(): void {
    if (!this.active) {
      return;
    }
    const text = this.editMessage.trim();
    if (!text) {
      this.error = 'Please write the feedback';
      return;
    }

    this.loading = true;
    this.error = '';
    this.feedbackApi.update(this.active.id, text).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Feedback updated';
        this.closePanel();
        this.load();
      },
      error: (error: unknown) => {
        this.loading = false;
        this.error = errorMessage(error, 'Could not update feedback');
      },
    });
  }

  remove(item: FeedbackItem): void {
    if (!confirm('Delete this feedback?')) {
      return;
    }
    this.error = '';
    this.success = '';
    this.feedbackApi.remove(item.id).subscribe({
      next: () => {
        if (this.active?.id === item.id) {
          this.closePanel();
        }
        this.success = 'Feedback deleted';
        this.load();
      },
      error: (error: unknown) => {
        this.error = errorMessage(error, 'Could not delete feedback');
      },
    });
  }

  logout(): void {
    this.session.clear();
    void this.router.navigate(['/login']);
  }

  private load(): void {
    this.feedbackApi.all().subscribe({
      next: (items) => {
        this.items = [...items].sort((a, b) => a.id - b.id);
        this.loaded = true;
      },
      error: (error: unknown) => {
        this.loaded = true;
        this.error = errorMessage(error, 'Could not load feedback');
      },
    });
  }
}
