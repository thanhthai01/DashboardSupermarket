// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-analytics.js";
// import { getStorage } from "firebase/storage";
import {
   getStorage,
   ref as Sref,
   getDownloadURL,
   uploadBytesResumable,
   deleteObject,
   listAll,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js";
//import { getDatabase, ref, onValue, query, limitToLast } from "./firebase/database";
import {
   getDatabase,
   ref,
   onValue,
   query,
   limitToLast,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
   apiKey: "AIzaSyC65FMF1JCgCFjIQ96JkDBBx9uSjG9OJKE",
   authDomain: "my-project-ad64c.firebaseapp.com",
   databaseURL: "https://my-project-ad64c-default-rtdb.firebaseio.com",
   projectId: "my-project-ad64c",
   storageBucket: "my-project-ad64c.appspot.com",
   messagingSenderId: "412293666454",
   appId: "1:412293666454:web:a3df6af903662e897394b7",
   measurementId: "G-PLV59X8N8J",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const firebase = getStorage(app);
// const storageRef = firebase.storage().ref();
const dataAdv = query(ref(database, "Advertisement"), limitToLast(30));

function getAge(age) {
   if (age == "Adult") {
      return "<strong>Age: </strong> 25 - 40";
   } else if (age == "Child") {
      return "<strong>Age: </strong> 0 - 6";
   } else if (age == "Old") {
      return "<strong>Age: </strong> 60 - 100";
   } else if (age == "Senior") {
      return "<strong>Age: </strong> 42- 53";
   } else {
      return "<strong>Age: </strong> 8 - 20";
   }
}

var age_adv = [];
var gender_adv = [];
var video = [];
function hi(time) {
   setTimeout(() => {
      console.log("run");
   }, time);
}

onValue(dataAdv, (snapshot) => {
   snapshot.forEach((childSnapshot) => {
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val();
      // age_gender.push({ key: childKey, data: childData });
      for (let item in childData) {
         for (let key in childData[item]) {
            if (key == "Boolean") {
               if (childData[item][key] == true) {
                  age_adv.push(childKey);
                  gender_adv.push(item);
                  // console.log(childData[item].video);
                  // video.push(childData[item].video.Link);
                  for (let i in childData[item].video) {
                     // console.log(i);
                     video.push({ name: i, info: childData[item].video[i] });
                  }
               }
            }
         }
      }
   });

   var randomIndex = 0;
   var randomVideo = video[randomIndex];

   var videoName = "QuangCao/" + randomVideo.name + ".mp4";
   var videoInfo = randomVideo.info;

   var des = videoInfo.des;
   var title = videoInfo.title;

   document.querySelector("#title_adv").innerHTML =
      `<strong>Title: </strong>` + title;
   document.querySelector("#age_adv").innerHTML = getAge(age_adv[0]);
   document.querySelector("#gender_adv").innerHTML =
      "Intended for " + gender_adv[0];
   document.querySelector("#des_adv").innerHTML = des;

   var starsRef = Sref(firebase, videoName);
   var qc_video = document.querySelector(".qc-video");

   getDownloadURL(starsRef).then((url) => {
      qc_video.src = url;
      setTimeout(function () {
         var videoTime = Number(qc_video.duration) * 1000;
         console.log(videoTime);
         setInterval(function () {
            for (let i = 0; i < video.length; i++) {
               randomIndex = i;
               randomIndex = Math.floor(Math.random() * video.length);
               randomVideo = video[randomIndex];

               videoName = "QuangCao/" + randomVideo.name + ".mp4";
               videoInfo = randomVideo.info;

               des = videoInfo.des;
               title = videoInfo.title;

               document.querySelector("#title_adv").innerHTML =
                  `<strong>Title: </strong>` + title;
               document.querySelector("#age_adv").innerHTML = getAge(
                  age_adv[0]
               );
               document.querySelector("#gender_adv").innerHTML =
                  "Intended for " + gender_adv[0];
               document.querySelector("#des_adv").innerHTML = des;

               starsRef = Sref(firebase, videoName);

               getDownloadURL(starsRef).then((url) => {
                  qc_video.src = url;
               });
            }
         }, videoTime);
      }, 1000);
   });
});
