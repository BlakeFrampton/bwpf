const clientId = "410a67665b04443db7546c753f8d6b53";
// const redirectUri = "http://" + window.location.host + "/Shufflefy"; // Redirects to the same page after login
const redirectUri = "https://bwpf.co.uk/Shufflefy/"

const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}
  
const codeVerifier  = generateRandomString(64);

const sha256 = async (plain) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return window.crypto.subtle.digest('SHA-256', data)
}

const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
}

const hashed = async codeVerifier => await sha256(codeVerifier)
const codeChallenge = base64encode(hashed);




// Redirect user to Spotify login
document.getElementById("login-btn").addEventListener("click", () => {
    const scope = "streaming user-read-playback-state user-modify-playback-state app-remote-control user-read-private";
    
    const authUrl = new URL("https://accounts.spotify.com/authorize")
    window.localStorage.setItem('code_verifier', codeVerifier)

    const params = {
        response_type: 'code', //was token
        client_id: clientId,
        scope,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: redirectUri
    }

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
});

// Extract access token from URL after login
const urlParams = new URLSearchParams(window.location.search);
let code = urlParams.get('code');

console.log("URL Parameters:", window.location.search);

if (code) {
    getToken(code);
}

const getToken = async code => {

    // stored in the previous step
    let codeVerifier = localStorage.getItem('code_verifier');
  
    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    }
  
    const body = await fetch(URL, payload);
    const response =await body.json();
  
    localStorage.setItem('access_token', response.access_token);
    initializeSpotifyPlayer(response.access_token);
  }

const accessToken = localStorage.getItem('access_token');

if (accessToken) {
    document.getElementById("play-btn").disabled = false;  // Enable play button
        initializeSpotifyPlayer(localStorage.getItem("access_token"));
} else{
    console.log("uh oh")
}

let player;
function initializeSpotifyPlayer(token) {
    window.onSpotifyWebPlaybackSDKReady = () => {
        player = new Spotify.Player({
            name: "Shufflefy Web Player",
            getOAuthToken: (cb) => { cb(token); },
            volume: 0.5
        });

        // Error handling
        player.on('initialization_error', ({ message }) => { console.error(message); });
        player.on('authentication_error', ({ message }) => { console.error(message); });
        player.on('account_error', ({ message }) => { console.error(message); });
        player.on('playback_error', ({ message }) => { console.error(message); });

        // Playback state updates
        player.on('player_state_changed', (state) => {
            if (!state) return;
            console.log(state);
        });

        // Ready to play
        player.on('ready', ({ device_id }) => {
            console.log("Spotify player ready with device ID", device_id);
        });

        // Connect to the player
        player.connect();
    };
}

// Play a random song
async function playRandomSong() {
    if (!accessToken) {
        alert("Please log in first.");
        return;
    }

    // Step 1: Get user's playlists
    console.log(accessToken);
    let response = await fetch("https://api.spotify.com/v1/me/playlists", {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    let data = await response.json();
    let playlists = data.items;

    if (playlists.length === 0) {
        alert("No playlists found.");
        return;
    }

    // Pick a random playlist
    let randomPlaylist = playlists[Math.floor(Math.random() * playlists.length)];
    
    // Step 2: Get songs from the playlist
    response = await fetch(`https://api.spotify.com/v1/playlists/${randomPlaylist.id}/tracks`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    data = await response.json();
    let tracks = data.items;

    if (tracks.length === 0) {
        alert("No songs found in the playlist.");
        return;
    }

    // Pick a random track
    let randomTrackUri = tracks[Math.floor(Math.random() * tracks.length)].track.uri;

    // Step 3: Use the API to play the song
    fetch("https://api.spotify.com/v1/me/player/play", {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            uris: [randomTrackUri] // The URI of the track to play
        })
    })
    .then(response => {
        if (response.status === 200) {
            console.log("Playing random song");
        } else {
            alert("Failed to play song.");
        }
    })
    .catch(error => {
        alert("Failed to play song. Try again.");
        console.error(error);
    });
}

document.getElementById("play-btn").addEventListener("click", playRandomSong);
