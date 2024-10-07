
export const GetRequestHelper = async (endpoint, navigate) => {

  let access_token = localStorage.getItem('access_token');
  const refresh_token = localStorage.getItem('refresh_token');

  // Check if both tokens are null
  if (!access_token || !refresh_token) {
    console.error("No access token or refresh token available. Redirecting to login.");
    navigate('/login'); // Navigate to the login page
    return;
  }

  const fetchWithToken = async (access_token) => {
    const response = await fetch(`${domain}/${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${access_token}`
      },
    });
    const data = response.json()
    return data
  };

  let response = await fetchWithToken(access_token);

  if (response?.message === 'Signature has expired') { // If the token has expired
    
    const tokenRefreshResponse = await fetch(`${domain}/refreshtoken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // You might want to send the refresh token in the body or as a different header.
        'Authorization': `Bearer ${refresh_token}`,
      },
    });

    const tokenData = await tokenRefreshResponse.json();

    if (tokenRefreshResponse.ok) {
      // Save the new access token to localStorage
      localStorage.setItem('access_token', tokenData.access_token);
      access_token = localStorage.getItem('access_token'); // Update the access token for the next request

      // Retry the original request with the new access token
      response = await fetchWithToken(access_token);
    } else {
      console.error("Unable to refresh token. Redirecting to login.");
      navigate('/login'); // Navigate to login page if refresh fails
      return;
    }
  }

  return response;
};
