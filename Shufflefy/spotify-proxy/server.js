const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Spotify credentials
// const clientId = '410a67665b04443db7546c753f8d6b53';
const clientSecret = '4ff294095a94409880ded0c68b18bef8';
alert(clientId)


// To store the access token temporarily (you can improve this with a proper OAuth flow later)
let accessToken = '';

app.use(express.json());

// Route to authenticate and fetch the access token
app.post('/login', async (req, res) => {
    const { code } = req.body;

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', null, {
            params: {
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: 'http://127.0.0.1:8080/'
            },
            headers: {
                'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
            },
        });

        accessToken = response.data.access_token; // Store the access token for further use
        res.json({ message: 'Logged in successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to log in' });
    }
});

// Route to fetch playlists
app.get('/playlists', async (req, res) => {
    if (!accessToken) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
        const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch playlists' });
    }
});

// Route to fetch tracks from a playlist
app.get('/playlist-tracks/:playlistId', async (req, res) => {
    if (!accessToken) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    const { playlistId } = req.params;

    try {
        const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch playlist tracks' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
