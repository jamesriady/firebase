(function() {

	// Get Elements]
	const employeeForm = document.getElementById('employee-form');
	const name = document.getElementById('name');
	const jobType = document.getElementById('job-type');
	const btnSave= document.getElementsByName('save-employee')[0];
	const btnUpdate = document.getElementsByName('update-employee')[0];
	const profileName = document.getElementsByClassName('profile-usertitle-name')[0];
	const btnVerifiedWrapper = document.getElementsByClassName('profile-userbuttons')[0];

	const tableBody = document.getElementsByTagName('tbody')[0]

	var keyID = ''

	function updateEmployee() {
		if (keyID !== '') {
			const resultUpdate = firebase.database().ref('users/' + keyID)
			if (name.value  !== '' && jobType.value !== '') {
				var data = {
					name: name.value,
					jobtype: jobType.value
				}
				resultUpdate.update(data).then(e => {
	  			employeeForm.reset();
				}).catch(e => console.log(e.message));
			} else {
				alert('please fill in the blank')
			}
		} else {
			alert('please choose the data first!');
		}
	}

	function deleteEmployee(key, employee) {
		if (key !== '') {
			const resultDelete = firebase.database().ref('users/' + key)
			resultDelete.remove().then(e => { alert(employee.name + ' has been deleted!')}).catch(e => { console.log(e.message)});
		}
	}

	function selectedRow (key, data) {
		name.value = data.name;
		jobType.value = data.jobtype;
		keyID = key || '';
	}

	function getData(data) {
		var items = data.val();
		console.log(items)
		var y = document.querySelectorAll(".employee-row");
		for (let x = 0; x < y.length; x++) {
			y[x].remove();
		}
		for (let key in items) {
			var tr = document.createElement('tr');
			for (let x in items[key]) {
				var td = document.createElement('td');
				var content = document.createTextNode(items[key][x])
				td.appendChild(content);
				tr.appendChild(td);
			}
			var td = document.createElement('td');
			var btnEdit = document.createElement('button');
			var btnEditText = document.createTextNode('Edit');
			btnEdit.className = 'btn btn-info btn-sm';
			btnEdit.style.margin = '5px';
			btnEdit.id = key;
			btnEdit.addEventListener('click', e => selectedRow(key, items[key]))
			btnEdit.appendChild(btnEditText);
			td.appendChild(btnEdit);
			var btnDelete = document.createElement('button');
			var btnDeleteText = document.createTextNode('Delete');
			btnDelete.className = 'btn btn-danger btn-sm';
			btnDelete.style.margin = '5px';
			btnDelete.id = key;
			btnDelete.addEventListener('click', e => deleteEmployee(key, items[key]))
			btnDelete.appendChild(btnDeleteText);
			td.appendChild(btnDelete);
			tr.appendChild(td);
			tr.className = "employee-row"
			tableBody.appendChild(tr);
		}
	}

	function errData(err) {
		console.log('error:', err)
	}

	const btnLogout = document.getElementById('btn-logout');
	btnLogout.addEventListener('click', e => {
		firebase.auth().signOut();
	});
	firebase.auth().onAuthStateChanged(firebaseUser => {
	  	if (firebaseUser) {
	  		profileName.append(firebase.auth().currentUser.email)
	  		const result = firebase.database().ref('users');
	  		result.on('value', getData, errData)
	  		if (firebase.auth().currentUser.emailVerified) {
		  		employeeForm.addEventListener('submit', e => {
		  			e.preventDefault();
		  			if (name.value  !== '' && jobType.value !== '') {
		  				var data = {
		  					name: name.value,
			  				jobtype: jobType.value
		  				}
			  			result.push(data).then(e => {
				  			employeeForm.reset();
			  			}).catch(e => console.log(e.message));
		  			} else {
		  				alert('please fill in the blank')
		  			}
		  		});

		  		btnUpdate.addEventListener('click', e => {
		  			e.preventDefault();
		  			updateEmployee();
		  		});

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
	  		} else {
	  			alert('please verify your email first!');
	  			name.setAttribute('disabled', true);
	  			jobType.setAttribute('disabled', true);
	  			btnSave.setAttribute('disabled', true);
	  			btnUpdate.setAttribute('disabled', true);
	  			const btn = document.createElement('button');
	  			const verified = document.createTextNode('Verify');
	  			btn.className = 'btn btn-success btn-sm';
	  			btn.id = 'btn-verified'
	  			btn.appendChild(verified)
	  			btnVerifiedWrapper.appendChild(btn)
	  			btn.addEventListener('click', e => {
	  				firebase.auth().currentUser.sendEmailVerification();
	  			})
	  		}
	  	} else {
	  		window.location.href = 'firebase-auth.html'
	  	}
	});
}());