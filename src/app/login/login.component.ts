import { ActivatedRouteSnapshot, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Token } from '../token.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  error: string;
  returnUrl: string;
  role: 'doctor' | 'patient';
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.role = this.route.snapshot.queryParams['role'];
  }

  get username(): AbstractControl {
    return this.loginForm.get('username');
  }
  get password() {
    return this.loginForm.get('password');
  }

  login() {
    this.authService.login(this.username.value, this.password.value, this.role).subscribe((token: Token) => {
      this.router.navigateByUrl(this.returnUrl);
    },
      err => {
        this.error = err.error;
      });
  }

}
