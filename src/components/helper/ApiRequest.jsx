import { Helper } from "./Helper";

export const ApiRequest = async (data, method, endpoint, navigate) => {
    try {
      const res = await Helper(data, method, endpoint, navigate);
      if (!res) {
        navigate('/login');
      }
      else if ((res.status === 401 && res.message === "The token has expired.") || (res.status === 422 && res.message === "Invalid token.")) {
        console.log("refresh token........");
        const newRes = await Helper({}, "POST", "refresh-token", navigate);
        console.log("newRes", newRes)
        if (newRes.status === 403 || newRes.status === 422) {
          console.log("Refresh token is invalid. Logging out.", newRes.status)
          navigate('/login');
        } else {
          console.log("Refresh token updated in local storage.");
          const newAccessToken = newRes.access_token;
          localStorage.setItem("accessToken", newAccessToken);
          const res2 = await Helper(data, method, endpoint, navigate);
          if(res.message === 'Token has been revoked.' || res.message === "Invalid token." || res.message === "Missing token."){
            navigate('/login');
          }else{
            return res2;
          }
        }
      } else if (res.message === 'Token has been revoked.' || res.message === "Invalid token." || res.message === "Missing token.") {
        navigate('/login');
      }
      return res;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };
  