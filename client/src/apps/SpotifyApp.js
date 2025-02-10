import React, { useEffect } from "react";

const SpotifyApp = () => {
    useEffect(() => {
        console.log("SpotifyApp rendered");
    }, []);
    return <h1>Spotify App</h1>;
};

export default SpotifyApp;
