const clientId = "410a67665b04443db7546c753f8d6b53";
const redirectUri = "http://" + window.location.host + "/Shufflefy"; // Redirects to the same page after login

console.log(redirectUri)

// Redirect user to Spotify login
document.getElementById("login-btn").addEventListener("click", () => {
    const scope = "user-read-playback-state user-modify-playback-state user-read-private";
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
    
    window.location.href = authUrl;
});

// Extract access token from URL after login
const hash = window.location.hash.substring(1);
const params = new URLSearchParams(hash);
const accessToken = params.get("access_token");

if (accessToken) {
    document.getElementById("play-btn").disabled = false;  // Enable play button
}


async function playRandomSong() {
    if (!accessToken) {
        alert("Please log in first.");
        return;
    }

    // Step 1: Get user's active Spotify devices
    let response = await fetch("https://api.spotify.com/v1/me/player/devices", {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    let data = await response.json();
    let devices = data.devices;

    if (devices.length === 0) {
        alert("No active Spotify devices found. Please open Spotify on your phone, desktop, or web player.");
        return;
    }

    // Pick the first available device
    let activeDeviceId = devices[0].id;

    // Step 2: Get user's playlists
    response = await fetch("https://api.spotify.com/v1/me/playlists", {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    data = await response.json();
    let playlists = data.items;

    if (playlists.length === 0) {
        alert("No playlists found.");
        return;
    }

    // Pick a random playlist
    let randomPlaylist = playlists[Math.floor(Math.random() * playlists.length)];
    
    // Step 3: Get songs from the playlist
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

    // Step 4: Play the song on the active device
    response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${activeDeviceId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ uris: [randomTrackUri] })
    });

    if (response.status != 204) {
        alert("Failed to play song. Try manually playing a song on Spotify first.");
    }
}


document.getElementById("play-btn").addEventListener("click", playRandomSong);