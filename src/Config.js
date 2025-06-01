import React, { useState, useEffect, useRef } from 'react';

const Config = () => {
  const auth = useRef({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!window.Twitch || !window.Twitch.ext) {
      return;
    }

    window.Twitch.ext.onAuthorized(async (_auth) => {
      auth.current = _auth;

      try {
        const response = await fetch(`${process.env.API_URL}/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: auth.current.token }),
        });

        const data = await response.json();

        if (data.message && data.message !== "Streamer already exists") {
          setError("Unknown error occurred, please try again later.");
        }
      } catch (error) {
        console.error('Error signing up:', error);
        setError("Unable to sign up, please try again later.");
      } finally {
        setIsLoading(false);
      }
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {!isLoading && error && (
        <h2 className="text-red-500">
          {error}
        </h2>
      )}

      {!isLoading && !error && (
        <>
          <h1>
            <span className="text-green-500 mr-2">
              ✓
            </span>
            Smash Factory is ready!
          </h1>
          <h2 className="text-gray-500">
            You can now close this window and start using Smash Factory!
          </h2>
        </>
      )}

      {isLoading && (
        <h1>Building Your Smash Factory, please wait...</h1>
      )}
    </div>
  );
};

export default Config; 