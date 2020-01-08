import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AppService } from "../../app.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignUpComponent implements OnInit {
  Roles: any = ["Admin", "Author", "Reader"];
  email = new FormControl("", [Validators.required, Validators.email]);
  public countries: any[] = [];
  public countryCodes: string[];
  public allCountries: any;
  public mobileNumber: any;
  public countryCode: string;
  public countryName: string;
  public country: any;
  public firstName: any;
  public lastName: any;
  public password: any;

  constructor(
    public appService: AppService,
    public _route: ActivatedRoute,
    public router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getCountries();
    this.getCountryCodes();
  }

  public goToSignIn(): any {
    this.router.navigate(["/user/login"]);
  } 

  public getCountries() {
    this.appService.getCountryNames().subscribe(data => {
      this.allCountries = data;
      for (let i in data) {
        let singleCountry = {
          name: data[i],
          code: i
        };
        this.countries.push(singleCountry);
      }
      this.countries = this.countries.sort((first, second) => {
        return first.name.toUpperCase() < second.name.toUpperCase()
          ? -1
          : first.name.toUpperCase() > second.name.toUpperCase()
          ? 1
          : 0;
      }); 
    }); 
  } 

  public getCountryCodes() {
    this.appService.getCountryNumbers().subscribe(data => {
      this.countryCodes = data;
    }); 
  } 

  onCountryChange() {
    this.countryCode = this.countryCodes[this.country];
    this.countryName = this.country;
  }

  getErrorMessage() {
    return this.email.hasError("required")
      ? "You must enter a value"
      : this.email.hasError("email")
      ? "Not a valid email"
      : "";
  }

  public signupFunction(): any {
    if (!this.firstName) {
      this.toastr.warning("First Name is required", "Warning!");
    } else if (!this.lastName) {
      this.toastr.warning("Last Name is required", "Warning!");
    } else if (!this.mobileNumber) {
      this.toastr.warning("Mobile Number is required", "Warning!");
    } else if (!this.country) {
      this.toastr.warning("Country is required", "Warning!");
    } else if (!this.email.value) {
      this.toastr.warning("Email is required", "Warning!");
    } else if (!this.password) {
      this.toastr.warning("Password is required", "Warning!");
    } else if (this.email.hasError("email")) {
      this.toastr.warning("Not a valid email", "Warning!");
    } else {
      let data = {
        firstName: this.firstName,
        lastName: this.lastName,
        mobileNumber: `${this.countryCode} ${this.mobileNumber}`,
        email: this.email.value,
        password: this.password,
        countryName: this.countryName
      };
      this.appService.signUp(data).subscribe(
        apiResponse => {
        
          if (apiResponse.status == 200) {
            this.toastr.success(
              "Please check your email",
              "Registered with Todo"
            );
            setTimeout(() => {
              this.goToSignIn();
            }, 1000); //redirecting to signIn page
          } else {
            this.toastr.error(apiResponse.message, "Error!");
          }
        },
        error => {
          this.toastr.error("Some Error Occurred", "Error!");
          this.router.navigate(["/serverError"]);
        }
      ); //end calling signUpFunction
    }
  } //end signUp function
}
