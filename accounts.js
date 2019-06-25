// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCrrcl0Qk0lbbLwURSemFTE499mmFSVbvM",
    authDomain: "project-01-704ce.firebaseapp.com",
    databaseURL: "https://project-01-704ce.firebaseio.com",
    projectId: "project-01-704ce",
    storageBucket: "",
    messagingSenderId: "638882612611",
    appId: "1:638882612611:web:2566b2b54d0668d4"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Create a variable to reference the database
var database = firebase.database();
// Link to Firebase Database for tracking users
var users = database.ref("/users");

// Function for signing up
$("#signup-submit").click(function(event) {
    event.preventDefault();
    var name = $("#name-input").val().trim();
    var email = $("#email-input").val().trim();
    var password = $("#password-input").val().trim();

    users.push({
        name,
        email,
        password
    });

    $("#name-input").val("");
    $("#email-input").val("");
    $("#password-input").val("");

});

// Function for logging in
$("#login-submit").click(function(event) {
    event.preventDefault();
    var email = $("#email-input").val().trim();
    var password = $("#password-input").val().trim();

    users.orderByChild("email").equalTo(email).on("child_added", function(snapshot) {
        if(snapshot.key) {
            if (password === snapshot.val().password) {
                $("body").html("Hello " + snapshot.val().name);
            }  
        }
    });

})