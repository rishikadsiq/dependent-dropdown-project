

export const PostRequestHelper = async(endpoint, dataItem) => {
  const response = await fetch(`http://localhost:5000/${endpoint}`,{
    
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcyNTg4NjQwNywianRpIjoiOTgwZGE0YTctZjJjOS00MjUzLWIzYzYtMTBhMmY1ODQ2ZGVhIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImZncmhobm5AZ21haWwuY29tIiwibmJmIjoxNzI1ODg2NDA3LCJjc3JmIjoiY2Y3ZGQ1OGQtMDNlMi00ZTQ2LWI3NTAtYzQyNTEwNzM1ZDc2IiwiZXhwIjoxNzI1ODg3MzA3LCJ1c2VyX2lkIjoiZTMzMDYxNWUtZDg0ZS00YTk2LWFhNDQtOTRlNDUxMGQ3N2RiIiwiY29tcGFueV9pZCI6IjY0OWEzNzM5LTk0ZTUtNDc0Yy05MWZlLTE4YjA4MjI1MGI1ZCIsInJvbGUiOiJBZG1pbiJ9.Kp2DInO_FZKU0OkWcZ61SstV0ghEaP7zH72oK3yLEvU`
    },
    body: JSON.stringify(dataItem)  // Send dataItem in request body
  });
  const data = await response.json();
  return data
}
