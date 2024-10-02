

export const PostRequestHelper = async (endpoint, dataItem, navigate) => {

  let access_token = localStorage.getItem('access_token');
  const refresh_token = localStorage.getItem('refresh_token');

  // Check if tokens are null and redirect to login if needed
  if (!access_token || !refresh_token) {
    console.error("No access token or refresh token available. Redirecting to login.");
    navigate('/login'); // Navigate to the login page
    return;
  }
  if(endpoint==='uploadprofile'){
    const fetchWithToken = async (token) => {
      const response = await fetch(`http://localhost:5000/${endpoint}`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body:dataItem, // Send dataItem in request body
      });
      const data = await response.json();
      return data;
    };
    let response = await fetchWithToken(access_token);
    return response;
  }

  // Helper function to perform the POST request
  const fetchWithToken = async (token) => {
    const response = await fetch(`http://localhost:5000/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dataItem), // Send dataItem in request body
    });
    const data = await response.json();
    return data;
  };

  // First attempt with the current access token
  let response = await fetchWithToken(access_token);

  if (response.message === 'Signature has expired') { 

    // Attempt to refresh the token
    const tokenRefreshResponse = await fetch(`http://localhost:5000/refreshtoken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Refresh token might be passed in body or header, adjust as needed
        'Authorization': `Bearer ${refresh_token}`,
      },
    });

    const tokenData = await tokenRefreshResponse.json();

    if (tokenRefreshResponse.ok) {
      // Save the new access token to localStorage
      localStorage.setItem('access_token', tokenData.access_token);
      access_token = localStorage.getItem('access_token');

      // Retry the original POST request with the new access token
      response = await fetchWithToken(access_token);
    } else {
      console.error("Unable to refresh token. Redirecting to login.");
      navigate('/login'); // Redirect to login if refresh fails
      return;
    }
  }

  // Parse and return the final response data
  return response
};
