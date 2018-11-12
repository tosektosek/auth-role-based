import { AuthService } from './auth.service';
import { catchError, switchMap, finalize, filter, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpHandler, HttpRequest, HttpSentEvent,
  HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, of, BehaviorSubject, throwError } from 'rxjs';
import { Token } from './token.model';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {
  isRefreshingToken = false;
  tokenSubject: BehaviorSubject<Token> = new BehaviorSubject<Token>(null);

  constructor(private authService: AuthService) { }

  addToken(req: HttpRequest<any>, token: Token): HttpRequest<any> {
    if (token && token.access_token) {
      return req.clone({ setHeaders: { Authorization: 'Bearer ' + token.access_token } });
    }
    return req.clone({ setHeaders: { Authorization: 'Bearer ' + null } });
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent
    | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
    return next.handle(this.addToken(req, this.authService.getAuthToken())).pipe(
      catchError(error => {
          switch (error.error.status) {
            case 400:
              return this.handle400Error(error);
            case 401:
              return this.handle401Error(req, next);
          }
      })
    );
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;

      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      this.tokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((newToken: Token) => {
          if (newToken) {
            localStorage.removeItem('patient');
            localStorage.setItem('patient', JSON.stringify(newToken));
            console.log(newToken);
            this.tokenSubject.next(newToken);
            return next.handle(this.addToken(req, newToken));
          }
        }),
        catchError((e) => {
          console.log(e)
          // If there is an exception calling 'refreshToken', bad news so logout.
          this.authService.logout();
          return of(null);
        }),
        finalize(() => {
          this.isRefreshingToken = false;
        })
      );
    } else {
      return this.tokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => {
          return next.handle(this.addToken(req, token));
        })
      );
    }
  }

  handle400Error(error) {
    if (error && error.status === 400 && error.error && error.error.error === 'invalid_grant') {
        // If we get a 400 and the error message is 'invalid_grant', the token is no longer valid so logout.
        this.authService.logout();
        return of (null);
    }

    return throwError(error);
}
}
