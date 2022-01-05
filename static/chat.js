
    // Initialize Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyANDf7VSInfFn5utOa7mrXvanX7fMw0ag8",
        authDomain: "chat-app-3bcad.firebaseapp.com",
        databaseURL: "https://chat-app-3bcad-default-rtdb.firebaseio.com",
        projectId: "chat-app-3bcad",
        storageBucket: "chat-app-3bcad.appspot.com",
        messagingSenderId: "1080108558662",
        appId: "1:1080108558662:web:8cb25b9abf3b62e95ddd47",
        measurementId: "G-R0RPLB3S7G"
      };
      firebase.initializeApp(firebaseConfig);
 
    var myName = prompt("Enter your name");

     
    function sendMessage() {
        // get message
        var message = document.getElementById("message").value;
 
        // save in database
        firebase.database().ref("messages").push().set({
            "sender": myName,
            "message": message
        });
 
        // prevent form from submitting
        return false;
    }


    // listen for incoming messages
    firebase.database().ref("messages").on("child_added", function (snapshot) {
      var html = "";
      // give each message a unique ID
      html += "<li id='message-" + snapshot.key + "'>";
      // show delete button if message is sent by me
      if (snapshot.val().sender == myName) {
          html += "<button data-id='" + snapshot.key + "' onclick='deleteMessage(this);'>";
              html += "Delete";
          html += "</button>";
      }
      html += snapshot.val().sender + ": " + snapshot.val().message;
      html += "</li>";

      document.getElementById("messages").innerHTML += html;
  });

  //deleting messages
  function deleteMessage(self) {
    // get message ID
    var messageId = self.getAttribute("data-id");
 
    // delete message
    firebase.database().ref("messages").child(messageId).remove();
}
 
// attach listener for delete message
firebase.database().ref("messages").on("child_removed", function (snapshot) {
    // remove message node
    document.getElementById("message-" + snapshot.key).innerHTML = "This message has been removed";
});