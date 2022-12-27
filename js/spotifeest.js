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
    .then((response) => response.json())
    .then(data => {
        console.log(data);
        localStorage.setItem("feestNaam", data.feestNaam);
        localStorage.setItem("feestCode", data.feestCode);
        localStorage.setItem("feestOwner", data.feestOwner);
        window.location.replace("voorkeurregistreren.html");
    })
    .catch(error => {
        console.log(error);
    });
}

function joinParty() {
    let PartynameInput = document.getElementById('PartynameInput').value;

    fetch(csharp_url + "/api/Party/" + PartynameInput + "/" + localStorage.getItem("token"))
    .then((response) => response.json())
    .then(data => {
        console.log(data);
        if (data.hasOwnProperty('Fout')) {
            console.log("FOUT GEVONDEN: " + data.Fout);
            document.getElementById("foutscherm").innerHTML = 
                "<div class=\"alert alert-danger\" role=\"alert\">" +
                data.Fout + 
                "</div>";
        }
        else {
            localStorage.setItem("feestNaam", data.FeestNaam);
            localStorage.setItem("feestCode", data.FeestCode);
            localStorage.setItem("feestOwner", data.FeestOwner);
            window.location.replace("voorkeurregistreren.html");
        }
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

function GetPlaylist(){
    fetch(csharp_url + "/groeprecs/" + localStorage.getItem("feestCode"))
    .then(t => t.json())
    .then(d => ShowPlaylist(d))
    .then(document.getElementById("partynaam").innerHTML = localStorage.getItem("feestNaam"))
    .then(document.getElementById("partycode").innerHTML = localStorage.getItem("feestCode"))
}
function ShowPlaylist(rhs){
    document.getElementById("resultaat").innerHTML = ""
    for(var x = 0; x < rhs.length; x++ ){
        document.getElementById("resultaat").innerHTML += `<br>${rhs[x].artist} - ${rhs[x].track}`;
    }
}

function logOut() {
    localStorage.clear();
    checkIfTokenPresent()
}

function haalGenreRecommendationOp(){
    var genre = document.getElementById("selectedGenre")
    var r = genre.value
    console.log(r)
    console.log("start");

    var genreSend = {}
    console.log(r)
    genreSend.seed_genres = r;
    var genreSendJSON = JSON.stringify(genreSend);
    fetch(python_url+'/get_recommendations',{
        method: "POST", body: genreSendJSON
    })
    .then(c => c.json())
    .then(d => {
        verwerkInformatie(d, r, "genre: ") 
        document.getElementById("genresubmitted").style="display:block";
        setTimeout(()=>{
            document.getElementById("genresubmitted").style="display:none";
        },2000)
    })
}

function haalTrackRecommendationOp(){
    console.log("start");
    var r = document.getElementById("trackrecommendation").value;
    var trackSend = {}
    trackSend.track1 = r;
    var genreSendJSON = JSON.stringify(trackSend);
    fetch(python_url + '/get_track_recommendations',{
        method: "POST", body: genreSendJSON
    })
    .then(c => c.json())
    .then(d => {
        verwerkInformatie(d, "trackrecommendation", "track: ");
        document.getElementById("tracksubmitted").style="display:block";
        setTimeout(()=>{
            document.getElementById("tracksubmitted").style="display:none";
        },2000)
    })
}

function haalArtistRecommendationOp(){
    console.log("start");
    var r = document.getElementById("artistrecommendation").value;
    var artistSend = {}
    artistSend.artist1 = r;
    var genreSendJSON = JSON.stringify(artistSend);
    fetch(python_url+'/get_artist_recommendations',{
        method: "POST", body: genreSendJSON
    })
    .then(c => c.json())
    .then(d => {
        verwerkInformatie(d, "artistrecommendation", "artist: " );
        document.getElementById("artistsubmitted").style="display:block";
        setTimeout(()=>{
            document.getElementById("artistsubmitted").style="display:none";
        },2000)
})
}

function verwerkInformatie(recommendation, invoer, type){
    var rh = {}
    rh.track = recommendation.tracks[0].name
    rh.spotifytrackid = recommendation.tracks[0].id
    rh.artist = recommendation.tracks[0].artists[0].name
    rh.keuze = type + invoer
    rh.jsonstring = 'abc'
    var rhJSON = JSON.stringify(rh)
    console.log(rhJSON)
    fetch(csharp_url+'/slarechisop/' + localStorage.getItem("token") + "/" + localStorage.getItem("feestCode"),{
        method: "POST", 
        headers: { 'Content-Type': 'application/json' },
        body: rhJSON
    })
    .then(c => console.log(c))

}
function haalAlleRecommendationHistoryOp(){
    fetch(csharp_url + "/userrecs/" + localStorage.getItem("token") + "/" + localStorage.getItem("feestCode"))
    .then(t => t.json())
    .then(d => toonAlleRecommendationHistory(d))
}
function toonAlleRecommendationHistory(rhs){
    document.getElementById("resultaat").innerHTML = ""
    for(var x = 0; x < rhs.length; x++ ){
        document.getElementById("resultaat").innerHTML += `<br>${rhs[x].artist} - ${rhs[x].track}`;
    }
}