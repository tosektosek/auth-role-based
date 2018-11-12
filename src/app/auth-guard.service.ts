import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable(
  { providedIn: 'root' }
)
export class AuthGuardService implements CanActivate {

  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    const role = route.data['role'];
    if (localStorage.getItem(role)) {
      return true;
    }
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url, role } });
    return false;
  }
}

