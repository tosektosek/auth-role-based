import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  getAllWith401Refresh(): any {
    return this.http.get('patients-with-fale-expired-refresh-token');
  }
  getPatientsWith401(): any {
    return this.http.get('patients-with-fale-expired-token');
  }

  constructor(private http: HttpClient) { }

  getPatients() {
    return this.http.get('patients');
  }
}
