import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { Token } from '../token.model';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const doctor = { id: 1, username: 'doctor', password: 'doctor', firstName: 'Test', lastName: 'User' };
        const patient = { id: 1, username: 'patient', password: 'patient', firstName: 'Test', lastName: 'User' };

        // wrap in delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {

            // authenticate
            if (request.url.endsWith('doctor/token') && request.method === 'POST') {

                if (request.body.username === doctor.username && request.body.password === doctor.password) {
                    // if login details are valid return 200 OK with a fake jwt token
                    const token: Token = {
                        access_token: 'fake-jwt-token',
                        refresh_token: 'fake-jwt-refresh-token'
                    };
                    return of(new HttpResponse({ status: 200, body: token }));
                } else {
                    // else return 400 bad request
                    return throwError({ error: { message: 'Username or password is incorrect' } });
                }
            }

            if (request.url.endsWith('patient/token') && request.method === 'POST') {
                if (request.body.username === patient.username && request.body.password === patient.password) {
                    // if login details are valid return 200 OK with a fake jwt token
                    const token: Token = {
                        access_token: 'fake-jwt-token',
                        refresh_token: 'fake-jwt-refresh-token'
                    };
                    return of(new HttpResponse({ status: 200, body: token }));
                } else {
                    // else return 400 bad request
                    return throwError({ error: { message: 'Username or password is incorrect' } });
                }
            }

            // get patients
            if (request.url.endsWith('patients') && request.method === 'GET') {
                // check for fake auth token in header and return users if valid,
                // this security is implemented server side in a real application

                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    return of(new HttpResponse({ status: 200, body: [patient] }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return throwError({ error: { status: 401, message: 'Unauthorised' } });
                }
            }

            if (request.url.endsWith('patients-with-fale-expired-token') && request.method === 'GET') {
                return throwError({ error: { status: 401, message: 'Unauthorised' } });
            }

            if (request.url.endsWith('refresh') && request.method === 'POST') {
                // if login details are valid return 200 OK with a fake jwt token
                const token: Token = {
                    access_token: 'fake-jwt-tokens',
                    refresh_token: 'fake-jwt-refresh-tokeny'
                };
                return of(new HttpResponse({ status: 200, body: token }));
            }

            // pass through any requests not handled above
            return next.handle(request);

        }))

            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
