import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthStateService } from '../services/authStateService';

@Injectable({
	providedIn: 'root',
})
export class AuthGuardAdmin implements CanActivate {

	private isLoggedIn: boolean = false;
	private isAdmin: boolean = false;
	private currentUser: any = null;

	constructor(private router: Router) {
		this.loadUserState();
	}

	canActivate(): boolean {
		if (this.isLoggedIn && this.isAdmin) {
			return true;
		} else {
			this.router.navigate(['/404']);
			return false;
		}
	}

	loadUserState(){
		const user = localStorage.getItem('currentUser');
		if (user) {
			const userObj = JSON.parse(user);
			this.isLoggedIn = true;
			this.isAdmin = userObj.isAdmin === true || userObj.isAdmin === 'true';
			this.currentUser = userObj;
		} else {
			this.isLoggedIn = false;
			this.isAdmin = false;
			this.currentUser = null;
		}
	}
	
}
