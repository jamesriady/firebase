(function() {

	// Get Elements
	const loginForm = document.getElementById('login-form');
	const txtEmailLogin = document.getElementById('email-login');
	const txtPasswordLogin = document.getElementById('password-login');
	const registerForm = document.getElementById('register-form');
	const txtEmailRegister = document.getElementById('email-register');
	const txtPasswordRegister = document.getElementById('password-register');
	const txtConfirmPasswordRegister = document.getElementById('confirm-password-register');

	loginForm.addEventListener('submit', e => {
		e.preventDefault();
		let email = txtEmailLogin.value;
		let password = txtPasswordLogin.value;
		let auth = firebase.auth();
		let promise = auth.signInWithEmailAndPassword(email, password);
		promise.catch(e => console.log(e.message));
	})

	registerForm.addEventListener('submit', e => {
		e.preventDefault();
		let email = txtEmailRegister.value;
		let password = txtPasswordRegister.value;
		let confirmPassword = txtConfirmPasswordRegister.value;
		if (password === confirmPassword) {
			let auth = firebase.auth();
			let promise = auth.createUserWithEmailAndPassword(email, password);
			promise.then(e => {
				registerForm.reset();
				alert('Your account has been registered, please check your email to verify the account first');
				e.sendEmailVerification();
			});
			promise.catch(e => console.log(e.message));
		} else {
			alert('Password does not match!');
		}
	})

	firebase.auth().onAuthStateChanged(firebaseUser => {
	  	if (firebaseUser) {
	  		sessionStorage.setItem('uid', firebase.auth().currentUser.uid);
	  		window.location.href = 'dashboard.html'
	  	} else {
	  		return false;
	  	}
	});
}());