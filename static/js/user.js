'use strict';

function checkPassword(evt) {
  
  const password = $('#password').val();
  const confirm = $('#confirm').val();

  if (password !== confirm) {
    evt.preventDefault();
    alert('Passwords do not match');
  }
}

$('#sign-up-form').on('submit', checkPassword);