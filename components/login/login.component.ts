import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  regForm: FormGroup;

  // Predefined users with roles
  users = [
    { email: 'ranjith@gmail.com', password: 'password123', userId: '1', role: 'user' },
    { email: 'admin@gmail.com', password: 'admin123', userId: '2', role: 'admin' }
  ];

  roles = ['user', 'admin']; // Dropdown options

  constructor(private router: Router) {
    this.regForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
      role: new FormControl(null, Validators.required) // Role field
    });

    if (localStorage.getItem('jwtToken')) {
      const role = localStorage.getItem('role');
      if (role === 'admin') {
        this.router.navigate(['/admin-dashboard']);
      } else {
        this.router.navigate(['/home']);
      }
    }
  }

  onSubmit(): void {
    if (this.regForm.invalid) {
      window.alert('Please fill out all fields correctly.');
      return;
    }

    const { email, password, role } = this.regForm.value;
    const user = this.users.find(u => u.email === email && u.password === password && u.role === role);


    if (user) {
      // Simulate token and role storage
      localStorage.setItem('jwtToken', 'fake-jwt-token');
      localStorage.setItem('userId', user.userId);
      localStorage.setItem('role', user.role);

      if (user.role === 'admin') {
        window.alert('Admin Login Successfully!');
        this.router.navigate(['/admin-dashboard']);
      } else {
        window.alert('User Login Successfully!');
        this.router.navigate(['/home']);
      }
    } else {
      window.alert('Login failed! Email, Password, or Role is incorrect.');
    }
  }
}
