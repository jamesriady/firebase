(function() {

	// Get Elements
	const btnLogout = document.getElementById('btn-logout');
	const profileName = document.getElementsByClassName('profile-usertitle-name')[0];
	const btnVerifiedWrapper = document.getElementsByClassName('profile-userbuttons')[0];

	btnLogout.addEventListener('click', e => {
		firebase.auth().signOut();
	});
	sessionStorage.getItem('uid');
	firebase.auth().onAuthStateChanged(firebaseUser => {
	  	if (firebaseUser) {
			profileName.append(firebase.auth().currentUser.email)
	  		
	  		if (!firebase.auth().currentUser.emailVerified) {
	  			const btn = document.createElement('button');
	  			const verified = document.createTextNode('Verify');
	  			btn.className = 'btn btn-success btn-sm';
	  			btn.id = 'btn-verified'
	  			btn.appendChild(verified)
	  			btnVerifiedWrapper.appendChild(btn)
	  			btn.addEventListener('click', e => {
	  				firebase.auth().currentUser.sendEmailVerification();
	  			})
	  		} else {
	  			const label = document.createElement('label');
	  			const icon = document.createElement('img');
	  			const labelText = document.createTextNode('Verified!');
	  			label.style.color = '#FFF'
	  			label.appendChild(labelText)
	  			icon.setAttribute('src', 'icon/verified.png')
	  			icon.style.width = '15px'
	  			icon.style.height = '15px'
	  			icon.style.marginBottom = '5px'
	  			btnVerifiedWrapper.append(label)
	  			btnVerifiedWrapper.append(' ')
	  			btnVerifiedWrapper.append(icon)
	  		}
	  		return true;
	  	} else {
	  		window.location.href = 'firebase-auth.html'
	  	}
	});

}());