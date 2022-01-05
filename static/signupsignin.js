// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBZqxkT8afL2OWBif790MQ1tBfkXZIZgro",
    authDomain: "chatapp-ce0cf.firebaseapp.com",
    databaseURL: "https://chatapp-ce0cf-default-rtdb.firebaseio.com",
    projectId: "chatapp-ce0cf",
    storageBucket: "chatapp-ce0cf.appspot.com",
    messagingSenderId: "1012747706332",
    appId: "1:1012747706332:web:ef00369dceae6f0d99b919"
};
firebase.initializeApp(firebaseConfig);
//initialize variables
const auth = firebase.auth();
const database = firebase.database();

//set register fumnction
function register() {
    //get inputs
    firstname = document.getElementById('firstname').value
    lastname = document.getElementById('lastname').value
    age = document.getElementById('age').value
   // gender = document.getElementById('gender').value
    email = document.getElementById('email').value
    username = document.getElementById('username').value
    password = document.getElementById('password').value
    confirmPassword = document.getElementById('confirmPassword').value
   
    // validate input field
    if(validate_email(email) == false){
        alert('Please enter a valid email');
        return;
    } 
    if(validate_password(password) == false){
        alert('Please enter a valid password of more than 6 characters');
        return;
    }
    if(confirm_password(password,confirmPassword) == false) {
        alert('Confirm password do not match with your password');
        return;
    }
    if(validate_fields(firstname)==false||validate_fields(lastname)==false||validate_fields(age)==false||validate_fields(email)==false||validate_fields(username)==false||validate_fields(password)==false||validate_fields(confirmPassword)==false){
        alert('One or more fields are empty');
        return;
    }

    // do the authentication
    auth.createUserWithEmailAndPassword(email, password)
        .then(function(){
            // user variable
            var user = auth.currentUser

            //add this user to firebase database
            var database_ref = database.ref()

            //create User data
            var user_data = {
                email : email,
                username : username,
                firstname : firstname,
                lastname : lastname,
                age : age,
                last_login : Date.now()
            }
            database_ref.child('users/' + user.uid).set(user_data)
            alert('User created!!!')
        })
        .catch(function(error){
            // firebase will alert for any errors
            var error_code = error.code
            var error_message = error.message

            alert(error_message)
        })
}
// set for login
function signin(){
    email = document.getElementById('email').value
    password = document.getElementById('password').value

    //validate input fields
    if(validate_email(email)== false || validate_password(password) == false){
        alert('Email or password is not valid input')
        return
    }
    auth.signInWithEmailAndPassword(email, password)
    .then(function(){
        // user variable
        var user = auth.currentUser

        //add this user to firebase database
        var database_ref = database.ref()

        //create User data
        var user_data = {
            last_login : Date.now()
        }
        database_ref.child('users/' + user.uid).update(user_data)
        alert('User Logged In!!!');
        res.status(201).render('main');
    })
    .catch(function(error){
         // firebase will alert for any errors
         var error_code = error.code
         var error_message = error.message

         alert(error_message)
    })
}

//validate the email
function validate_email(email) {
    expression = /^[^@]+@\w+(\.\w+)+\w$/
    if(expression.test(email) == true) {
        return true; //email is valid
    }
    else{
        return false; //email is not valid
    }

}
// validate passowrd if its length is correct or nor according to Firebase
function validate_password(password) {
    if(password < 6){
        return false;
    }
    else{
        return true;
    }
}
//confirm the password
function confirm_password(password,confirmPassword) {
    if(password === confirmPassword){
        return true;
    }
    else{
        return false;
    }
}
// validate if some entry is missing
function validate_fields(field){
    if(field==null){
        return false;
    }
    if(field.length <= 0){
        return false;
    }
    else{
        return true;
    }
}