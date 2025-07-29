import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized-pag',
  imports: [],
  templateUrl: './unauthorized-pag.html',
  styleUrl: './unauthorized-pag.scss',
})
export class UnauthorizedPag {
  countdown = signal(5);

  constructor(private router: Router) {}

  ngOnInit(): void {
    const timer = setInterval(() => {
      this.countdown.update((c) => c - 1);

      if (this.countdown() === 0) {
        clearInterval(timer);
        this.router.navigate(['/']);
      }
    }, 1000);
  }
}
