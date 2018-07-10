window.onload = function () {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBwy0way-XvpLQTkY2EoKz5uSHhb23S3fo",
    authDomain: "pruebasalud-8632b.firebaseapp.com",
    databaseURL: "https://pruebasalud-8632b.firebaseio.com",
    projectId: "pruebasalud-8632b",
    storageBucket: "pruebasalud-8632b.appspot.com",
    messagingSenderId: "384943209525"
  };
  firebase.initializeApp(config);

  // get elements
  const txtEmail = document.getElementById('txtEmail');
  const txtPassword = document.getElementById('txtPassword');
  const btnLogin = document.getElementById('btnLogin');
  const btnSignUp = document.getElementById('btnSignUp');
  const btnLogOut = document.getElementById('btnLogOut');
  const emailUsers = document.getElementById('users-email');
  const passwordUsers = document.getElementById('users-password');
  const passwordTwoUsers = document.getElementById('users-passwordTwo');
  const btnLoginFacebook = document.getElementById('btnLoginFacebook');
  const btnLoginGoogle = document.getElementById('btnLoginGoogle');

  let refUsers;
  let tbodyTableUsers;
  let elementDeleteUser;
  let buttonR = document.getElementById('register');
  let lastNameUser = document.getElementById('users-last-name');
  let nameUser = document.getElementById('users-name');
  let userLogin;
  let emailValidate;
  let passwordValidate;
  //....................................................................... VALIDACION DE CORREO ELECTRONICO
  txtEmail.addEventListener('input', function () {
    campo = event.target;
    val = campo.value;
    emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    //Se muestra un texto a modo de ejemplo, luego va a ser un icono
    if (emailRegex.test(val)) {
      document.getElementById('icon-check').setAttribute('class', 'icon-checkmark');
    } else {
      document.getElementById('icon-check').setAttribute('class', 'icon-cross');
    }
  });
  emailUsers.addEventListener('input', function () {
    campo = event.target;
    val = campo.value;
    emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    //Se muestra un texto a modo de ejemplo, luego va a ser un icono
    if (emailRegex.test(val)) {
      emailValidate = 'emailValido';
      document.getElementById('icon-validate').setAttribute('class', 'icon-checkmark');
    } else {
      emailValidate = 'emailInvalido';
      document.getElementById('icon-validate').setAttribute('class', 'icon-cross');
    }
  });
  //....................................................................... VALIDACION DE PASSWORD REPETIDO
  passwordTwoUsers.addEventListener('input', function () {
    passwordTwo = event.target.value;
    passwordOne = passwordUsers.value;
    //Se muestra un texto a modo de ejemplo, luego va a ser un icono
    if (passwordTwo === passwordOne) {
      passwordValidate = 'passwordValido';
      document.getElementById('icon-validate-password').setAttribute('class', 'icon-checkmark');
    } else {
      passwordValidate = 'passwordInvalido';
      document.getElementById('icon-validate-password').setAttribute('class', 'icon-cross');
    }
  });
  //....................................................................... AUNTENTIFICACION CON CORREO Y CONTRASENIA
  btnSignUp.addEventListener('click', e => {
    document.getElementById('section-register-user').style.display = 'block';
    document.getElementById('section-login').style.display = 'none';

  });
  // add a realtime listener
  /*Esto me ayuda saber cada vez que cambie el estado de autentificacion
  - cuando el usuario entra a la web el parametro firebase(callback -> el usuario en firebase) tendra toda la informacion actual del usuario
  - cuando el usuario sale tendra un valor vacio, entonces verificamos si existe el usuario logueado  */
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {// si existe el usuario lo insertamos a firebase console
      userLogin = firebaseUser.displayName;
      console.log(firebaseUser);
      console.log('informacion del usuario logueado: ' + firebaseUser.displayName);// UTILIZO PARA LA BIENBENIDA
      document.getElementById('messageValide').innerHTML = '';//  limpio el elemento que notofica si es email y passwor correcto
      btnLogOut.style.display = 'block';
    } else {// si no mostramos un mensaje de no regstrado 
      console.log('No registrado');
      btnLogOut.style.display = 'none';
    }
  });
  // Iniciar Sesion
  btnLogin.addEventListener('click', e => {
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(txtEmail.value, txtPassword.value);// devuelve una promesa que permita identificar al usuario o para detectar cualquien error y registrarlos en firebase
    promise.catch(e => {
      console.log(e.message);
      return document.getElementById('messageValide').innerHTML = 'Email o contraseña incorrecta'
    });//Muestra un mensaje de email y pass invalido
    //DONE: validar si los datos son existentes 

  });
  // Cerrar Sesion
  btnLogOut.addEventListener('click', e => {
    firebase.auth().signOut();
    btnLogOut.style.display = 'none';// cerrar secion o cambiar el estado de autentificacion 
  });

  //...............................................................................AUTENTIFICACION CON GOOGLE
  btnLoginGoogle.addEventListener('click', e => {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/plus.login');//para el acceso a la API de google 
    // para una VENTANA EMERGENTE
    firebase.auth().signInWithPopup(provider).then(function (result) {// Autentica un cliente de Firebase usando un flujo de autenticación OAuth basado en ventanas emergentes.
      const token = result.credential.accessToken;
      const user = result.user;//info 
      userLogin = user.displayName;
      console.log('informacion del usuario logueado: ' + user.displayName);
    }).catch(error => {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;

      if (errorCode === 'auth/account-exists-with-different-credential') {
        alert('Es el mismo usuario');
      }
      console.log('Error: ' + errorCode + ' y ' + errorMessage + '\n El correo de la cuenta:' + email + '\n tipo de firebase que se uso: ' + credential);
    });
    // para REDIRECCIONAMIENTO SOBRE TODO EN APP
    //firebase.auth().signInWithRedirect(provider);// Si se desea agregar el token hacer la misma estructura del emergente
  });

  // .................................................................... ........AUTENTIFICACION CON FACEBOOK
  btnLoginFacebook.addEventListener('click', e => {
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('public_profile');//https://developers.facebook.com/docs/facebook-login/permissions/?translation
    //406755143185347 id app
    firebase.auth().signInWithPopup(provider).then(function (result) {
      var token = result.credential.accessToken;
      var user = result.user;// La información del usuario que inició sesión.
      Console.log(user);
      //console.log('Informacion del usuario logueado con facebok'+user);
    }).catch(error => {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
    });
  });
  //...................................................................................REGISTRO DE USUARIO

  /*Hace referente al hijo del modo raiz de la base de datos */
  refUsers = firebase.database().ref().child('Usuarios');
  //evento Registrar
  buttonR.addEventListener('click', event => {
      if (passwordValidate === 'passwordValido') {
        
          //Insertar utentificacion
          const auth = firebase.auth();
          const promise = auth.createUserWithEmailAndPassword(emailUsers.value, passwordUsers.value).then(function (user) {
            return user.updateProfile({ 'displayName': nameUser.value });
          }).catch(function (error) {
            console.log(error);
            var errorEmail=error.message;
            if(errorEmail === 'Password should be at least 6 characters'){
               document.getElementById('mensaggeRegisterValide').innerHTML = 'La contraseña debe ser mayor a 6';
            }
            if(errorEmail === 'The email address is badly formatted.'){
              document.getElementById('mensaggeRegisterValide').innerHTML = 'Ingrese un correo valido';
              }
          });
          promise.catch(e => console.log(e.message));
          //Insertar a la base de datos
          refUsers.push({
            usersEmail: emailUsers.value,
            usersLastName: lastNameUser.value,
            usersName: nameUser.value,
            usersPassword: passwordUsers.value,
          });
          //formUsers.reset();
          refUsers.on('value', function (snap) {
            let dataUsers = snap.val();
            console.log(dataUsers);
          });
        
      } else {
        document.getElementById('mensaggeRegisterValide').innerHTML = 'Las contraseñas deben ser iguales';
      }
    

  });
















}