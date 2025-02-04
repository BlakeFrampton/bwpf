const clientId = '410a67665b04443db7546c753f8d6b53';
const redirectUri = 'http://127.0.0.1:8080/';
console.log(redirectUri);

// Redirect user to Spotify login
document.getElementById('login-btn').addEventListener('click', () => {
    const scopes = 'user-read-playback-state user-modify-playback-state playlist-read-private';
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = authUrl;
});

// // Once redirected back, get the authorization code from URL
// const params = new URLSearchParams(window.location.search);
// const code = params.get('code');

// if (code) {
//     fetch('/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ code: code }),
//     }).then(response => response.json())
//       .then(data => console.log(data))
//       .catch(error => console.error('Error logging in:', error));
// }

// // Example of fetching playlists
// fetch('/playlists')
//     .then(response => response.json())
//     .then(data => console.log(data))
//     .catch(error => console.error('Error fetching playlists:', error));

// Extract access token from URL after login
const hash = window.location.hash.substring(1);
const params = new URLSearchParams(hash);
const accessToken = params.get("access_token");

if (accessToken) {
    localStorage.setItem("spotifyAccessToken", accessToken);  // Store the token
    document.getElementById("play-btn").disabled = false;  // Enable play button
    console.log("Successfully logged in");
} else {
    console.log("Failed to log in");
}
