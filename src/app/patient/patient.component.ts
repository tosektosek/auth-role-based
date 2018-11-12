import { AuthService } from './../auth.service';
import { PatientService } from './patient.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {

  patients = [];
  constructor(private patientService: PatientService, private authService: AuthService) { }

  ngOnInit() {

  }

  getAll() {
    this.patientService.getPatients().subscribe((response: any[]) => {
      this.patients.push(... response);
    });
  }

  getAllWith401() {
    this.patientService.getPatientsWith401().subscribe((response: any[]) => {
      this.patients.push(... response);
    });
  }

  getAllWith401Refresh() {
    this.patientService.getAllWith401Refresh().subscribe();
  }

}
