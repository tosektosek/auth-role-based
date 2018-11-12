import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Token } from './token.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getAuthToken(): Token {
    let token = JSON.parse(localStorage.getItem('doctor'));
    if (!token) {
      token = JSON.parse(localStorage.getItem('patient'));
    }
    console.log(token)
    return token;
  }
  constructor(private http: HttpClient, private router: Router) { }

  login(username, password, role: string) {
    return this.http.post(`${role}/token`, { username, password }).pipe(
      map((token: Token) => {
        if (token && token.access_token) {
          localStorage.setItem(role, JSON.stringify(token));
        }
        return token;
      })
    );
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/');
  }

  refreshToken() {
    return this.http.post('refresh', {});
  }
}

const apirUrl = 'localhost:4200/';
