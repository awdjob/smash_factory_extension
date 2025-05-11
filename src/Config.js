import React, { useEffect, useState } from 'react';

const Config = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);

//   useEffect(() => {
//     // Initialize Twitch Extensions SDK
//     window.Twitch.ext.onAuthorized(function(auth) {
//       console.log('Config: Twitch Extensions SDK authorized:', auth);
//       setIsAuthorized(true);
//     });
//   }, []);

  return (
    <div className="twitch-config">
      <h1>Smash Factory Configuration</h1>
      {isAuthorized ? (
        <div>
          <p>Configure your Smash Factory extension settings here.</p>
          {/* Add configuration options here */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Config; 