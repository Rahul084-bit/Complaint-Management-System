import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ComplaintService } from './complaint.service';
import { Complaint, Status } from './complaint.model';

@Component({
  selector: 'app-root',
  imports: [FormsModule, DatePipe],
  template: `
    <div class="container">
      <h1>Complaint Management System</h1>

      <section class="card">
        <h2>Submit a complaint</h2>
        <form #f="ngForm" (ngSubmit)="submit(f)">
          <input name="name" [(ngModel)]="form.name" placeholder="Your name" required />
          <input name="email" [(ngModel)]="form.email" placeholder="Email" required email />
          <input name="title" [(ngModel)]="form.title" placeholder="Complaint title" required />
          <select name="category" [(ngModel)]="form.category">
            <option value="General">General</option>
            <option value="Hostel">Hostel</option>
            <option value="Academic">Academic</option>
            <option value="Technical">Technical</option>
          </select>
          <textarea name="description" [(ngModel)]="form.description"
                    placeholder="Describe your complaint" rows="3" required></textarea>
          <button type="submit" [disabled]="f.invalid">Submit</button>
        </form>
        @if (error()) { <p class="error">{{ error() }}</p> }
      </section>

      <section class="card">
        <div class="row">
          <h2>All complaints ({{ complaints().length }})</h2>
          <select [(ngModel)]="filter" (ngModelChange)="load()">
            <option value="">All</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>

        @if (complaints().length === 0) {
          <p>No complaints found.</p>
        } @else {
          <table>
            <thead>
              <tr>
                <th>#</th><th>Title</th><th>By</th><th>Category</th>
                <th>Date</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              @for (c of complaints(); track c.id) {
                <tr>
                  <td>{{ c.id }}</td>
                  <td>
                    <strong>{{ c.title }}</strong><br />
                    <small>{{ c.description }}</small>
                  </td>
                  <td>{{ c.name }}<br /><small>{{ c.email }}</small></td>
                  <td>{{ c.category }}</td>
                  <td>{{ c.createdAt | date: 'dd MMM yyyy' }}</td>
                  <td>
                    <select [value]="c.status" (change)="changeStatus(c, $any($event.target).value)">
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In progress</option>
                      <option value="RESOLVED">Resolved</option>
                    </select>
                  </td>
                  <td><button class="danger" (click)="remove(c)">Delete</button></td>
                </tr>
              }
            </tbody>
          </table>
        }
      </section>
    </div>
  `,
  styles: [`
    .container { max-width: 960px; margin: 30px auto; font-family: Arial, sans-serif; padding: 0 12px; }
    h1 { text-align: center; }
    .card { background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin-bottom: 20px; }
    form { display: grid; gap: 10px; }
    input, select, textarea { padding: 8px; border: 1px solid #bbb; border-radius: 4px; font-size: 14px; }
    button { padding: 8px 14px; border: none; border-radius: 4px; background: #1976d2; color: #fff; cursor: pointer; }
    button:disabled { background: #9bb8d6; cursor: not-allowed; }
    button.danger { background: #d32f2f; }
    .row { display: flex; justify-content: space-between; align-items: center; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border-bottom: 1px solid #eee; padding: 8px; text-align: left; vertical-align: top; }
    small { color: #666; }
    .error { color: #d32f2f; }
  `],
})
export class App implements OnInit {
  private service = inject(ComplaintService);

  complaints = signal<Complaint[]>([]);
  error = signal('');
  filter: Status | '' = '';

  form: Complaint = this.emptyForm();

  ngOnInit() {
    this.load();
  }

  emptyForm(): Complaint {
    return { name: '', email: '', title: '', category: 'General', description: '' };
  }

  load() {
    this.service.getAll(this.filter).subscribe({
      next: (data) => {
        this.error.set('');
        this.complaints.set(data);
      },
      error: () => this.error.set('Backend se connect nahi ho paya. Spring Boot chal raha hai?'),
    });
  }

  submit(f: NgForm) {
    if (f.invalid) return;
    this.service.create(this.form).subscribe({
      next: () => {
        this.error.set('');
        f.resetForm({ category: 'General' });
        this.form = this.emptyForm();
        this.load();
      },
      error: () => this.error.set('Complaint submit nahi hui. Fields check kar.'),
    });
  }

  changeStatus(c: Complaint, status: Status) {
    this.service.updateStatus(c.id!, status).subscribe(() => this.load());
  }

  remove(c: Complaint) {
    if (!confirm(`Delete complaint #${c.id}?`)) return;
    this.service.delete(c.id!).subscribe(() => this.load());
  }
}
