import React from "react";

const App = () => {
    console.log("TestApp rendered")
    return <h1>Test App</h1>
}

export default App;

// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// export default function TestApp() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     console.log("TestApp mounted, navigate is available.");
//   }, []);

//   return (
//     <div>
//       <h1>Test App</h1>
//       <button onClick={() => navigate("/projects/Shufflefy")}>Go to Spotify App</button>
//     </div>
//   );
// }
