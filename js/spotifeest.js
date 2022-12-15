//let csharp_url = "https://yc2211aspotifeest.azurewebsites.net";
let csharp_url = "https://localhost:7003";
let python_url = "https://spotifeest-python-backend.azurewebsites.net";

function registerUser(){
    let UsernameInput = document.getElementById('UsernameInput').value;
    let EmailInput = document.getElementById('EmailInput').value;
    let PasswordInput = document.getElementById('PasswordInput').value
    
    let newUser = {
        Username: UsernameInput,
        Email: EmailInput,
        Password: PasswordInput,
        Token: "",
        Party: [],
        Preferences: []
    }

    fetch(csharp_url + "/createuser", {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(newUser)
    })
    .then((response) => response.json())
    .then(data => {
        console.log(data.token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.username);
        window.location.href = "index.html";
    })
    .catch(error => {
        console.log("EEN ERROR" + error);
    });
}

function checkIfTokenPresent() {
    if (localStorage.getItem("token") == null) {
        window.location.replace("index.html");
    }
}
function createParty() {
    let PartynameInput = document.getElementById('PartynameInput').value;
    
    let newParty = {
        FeestCode: "",
        FeestNaam: PartynameInput,
        FeestOwner: localStorage.getItem("token")
    }

    fetch(csharp_url + "/api/Party/createparty", {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(newParty)
    })
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.log(error);
    });
}

function loginUser(){
    let EmailInput = document.getElementById('EmailInput').value;
    let PasswordInput = document.getElementById('PasswordInput').value
    
    let newUser = {
        Username: "",
        Email: EmailInput,
        Password: PasswordInput,
        Token: "",
        Party: [],
        Preferences: []
    }

    fetch(csharp_url + "/loginuser", {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(newUser)
    })
    .then((response) => {
        if (response.status==204) {
            alert("user not found");
            window.location.replace("index.html");
        }
        else {
            response.json().then(data=> {
                console.log(data);
                // alert("user found");
                localStorage.setItem("token", data.token);
                localStorage.setItem("name", data.username);
                window.location.replace("home_new.html");
            });
        }
    })
    .catch(error => {
        console.log("EEN ERROR" + error);
    });
}

function getAllParties() {
    fetch(csharp_url +"/api/Party/")
    .then(a => a.json())
    .then(d=>toonAlleParties(d))
}
function toonAlleParties(feesten) {
    for (let x = 0; x < feesten.length; x++) {
        console.log(feesten[x]);
        document.getElementById("feesttabel").innerHTML += "<div>" + feesten[x].code + "</div>";
    }
}
let recommendedTracks = []
const inputPreference = []
let recmdTrack = {}


function getGenreRecommendation(){
    let recommendation = {};
    recommendation.limit = 1;
    recommendation.market = "NL"
    recommendation.seed_genres = document.getElementById("GenreInput").value;
    let jsonresponse = ""
    fetch(python_url + '/get_recommendations', {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json'
               },
               body: JSON.stringify(recommendation)
             })
    .then((response) => response.json())
    .then((tracks) => {
        document.getElementById("testbak").innerHTML = tracks.tracks[0].artists[0].name 
        + " - " +
        tracks.tracks[0].name;
        console.log(tracks);
        recmdTrack.artist = tracks.tracks[0].artists[0].name;
        recmdTrack.track = tracks.tracks[0].name;
        recommendedTracks.push(JSON.stringify(recmdTrack));
    })
    .catch(error => {
        console.log(error);
    });
}

function getTrackRecommendation(){
    let picked_track = {};
    picked_track.track1 = document.getElementById("TrackInput").value;
    let track_url = python_url + '/get_track_recommendations';
    fetch(track_url, {
        method: "POST", body: JSON.stringify(picked_track)
    })
    .then((response) => response.json())
    .then((tracks) => {
        document.getElementById("testbak").innerHTML = tracks.tracks[0].artists[0].name 
        + " - " +
        tracks.tracks[0].name;
        console.log(tracks);
        recmdTrack.artist = tracks.tracks[0].artists[0].name;
        recmdTrack.track = tracks.tracks[0].name;
        recommendedTracks.push(JSON.stringify(recmdTrack));
    })
    .catch(error => {
        console.log(error);
    })

}

function getArtistRecommendation(){
    let picked_artist = {};
    picked_artist.artist1 = document.getElementById("ArtistInput").value;
    let artist_url = python_url + '/get_artist_recommendations';
    fetch(artist_url, {
        method: "POST", body: JSON.stringify(picked_artist)
    })
    .then((response) => response.json())
    .then((tracks) => {
        document.getElementById("testbak").innerHTML = tracks.tracks[0].artists[0].name 
        + " - " +
        tracks.tracks[0].name;
        console.log(tracks);
        recmdTrack.artist = tracks.tracks[0].artists[0].name;
        recmdTrack.track = tracks.tracks[0].name;
        recommendedTracks.push(JSON.stringify(recmdTrack));
    })
    .catch(error => {
        console.log(error);
    })
}


function showRecommendedTracks(){
        document.getElementById("testbak2").innerHTML = recommendedTracks; 
        console.log(recommendedTracks.toString());
        console.log("test");
        console.log(JSON.stringify(recmdTrack))

}

function slaGroepOp(){
    var nwGroep = {};
    nwGroep.Code = document.getElementById("decodeinput").value;
    nwGroep.PartyName = document.getElementById("departynameinput").value;
    var nwGroepJSON = JSON.stringify(nwGroep);
    console.log(nwGroepJSON); 
    
    fetch('https://localhost:7003/api/Party/createparty', {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json'
               },
               body: nwGroepJSON
             })
}

function gaNaarBackend(){
    alert("Naar backend");
    fetch('https://localhost:7003/api/trein')
    .then(a => a.json())
    .then(d => tonenVanTreinen(d))
}
function tonenVanTreinen(treinArray){
    console.log("we gaan treinen tonen");
    for(var x= 0; x< treinArray.length; x++) {
        document.getElementById("uitvoer").innerHTML += "<br>-"+treinArray[x].thuisStation;
    }
}