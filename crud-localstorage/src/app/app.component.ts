import { Component, OnInit } from '@angular/core';
import { Employee } from '../models/employee';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  employeeForm!: FormGroup;
  employeeList: Employee[] = [];


  ngOnInit() {
    this.fetchEmployeeFromLocalStorage();
    this.createForm();
  }

  createForm() {
    this.employeeForm = new FormGroup({
      empId: new FormControl(0),
      name: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      pinCode: new FormControl('', Validators.required),
      department: new FormControl('', Validators.required)
    });
  }


  fetchEmployeeFromLocalStorage() {
    const cachedData = localStorage.getItem("EmpData");

    if (cachedData != null) {
      const parsedData = JSON.parse(cachedData);
      this.employeeList = [...parsedData];
      return parsedData;
    }
    else {
      return null;
    }
  }

  edit(employee: Employee) {
    this.employeeForm.patchValue(employee);
  }

  onSubmit() {
    const formValue = this.employeeForm.value;
    let cachedData = this.fetchEmployeeFromLocalStorage() || [];

    if (formValue.empId && formValue.empId > 0) {
      // Edit existing employee
      const index = cachedData.findIndex((e: Employee) => e.empId === formValue.empId);
      if (index !== -1) {
        cachedData[index] = { ...formValue };
      }
    } else {
      // Add new employee
      const newId = cachedData.length > 0 ? Math.max(...cachedData.map((e: Employee) => e.empId)) + 1 : 1;
      formValue.empId = newId;
      cachedData.push(formValue);
    } 

    this.employeeList = [...cachedData];
    localStorage.setItem('EmpData', JSON.stringify(this.employeeList));
    this.employeeForm.reset();
    // this.employeeForm.controls['empId'].setValue(0); // Reset empId
  }


  delete(empId: number) {
    const cachedData = this.fetchEmployeeFromLocalStorage();

    if (cachedData) {
      const updatedList = cachedData.filter((data: any) => data.empId !== empId);

      localStorage.setItem('EmpData', JSON.stringify(updatedList));
      this.employeeList = updatedList;
    }
  }
}
