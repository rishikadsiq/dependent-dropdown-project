
export const GetRequestHelper = async (endpoint, navigate) => {

  const access_token = localStorage.getItem('access_token');
  const refresh_token = localStorage.getItem('refresh_token');

  // Check if both tokens are null
  if (!access_token || !refresh_token) {
    console.error("No access token or refresh token available. Redirecting to login.");
    navigate('/login'); // Navigate to the login page
    return;
  }

  const fetchWithToken = async () => {
    const response = await fetch(`http://localhost:5000/${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${access_token}`
      },
    });
    const data = response.json()
    return data
  };

  let response = await fetchWithToken();

  if (response?.message === 'Signature has expired') { // If the token has expired
    console.log("Access token expired. Attempting to refresh token...");

    const tokenRefreshResponse = await fetch(`http://localhost:5000/refreshtoken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // You might want to send the refresh token in the body or as a different header.
        'Authorization': `Bearer ${refresh_token}`,
      },
    });

    const tokenData = await tokenRefreshResponse.json();
    console.log(tokenData)

    if (tokenRefreshResponse.ok) {
      // Save the new access token to localStorage
      localStorage.setItem('access_token', tokenData.access_token);

      // Retry the original request with the new access token
      response = await fetchWithToken();
    } else {
      console.error("Unable to refresh token. Redirecting to login.");
      navigate('/login'); // Navigate to login page if refresh fails
      return;
    }
  }

  console.log(response);
  return response;
};
