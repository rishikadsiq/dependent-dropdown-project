

export const PostRequestHelper = async(endpoint, dataItem) => {
  const response = await fetch(`http://localhost:5000/${endpoint}`,{
    
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcyNTk3MjY3NSwianRpIjoiYTEzZTc5MjUtMzgzYS00ODZmLThmOTItNGQwMGExNGNkZTc0IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImZncmhobm5AZ21haWwuY29tIiwibmJmIjoxNzI1OTcyNjc1LCJjc3JmIjoiNmIwMjMwOWQtZmNjNS00OGEwLWExZDUtZGI5NGZjMDI1ZmJmIiwiZXhwIjoxNzI1OTczNTc1LCJ1c2VyX2lkIjoiZTMzMDYxNWUtZDg0ZS00YTk2LWFhNDQtOTRlNDUxMGQ3N2RiIiwiY29tcGFueV9pZCI6IjY0OWEzNzM5LTk0ZTUtNDc0Yy05MWZlLTE4YjA4MjI1MGI1ZCIsInJvbGUiOiJBZG1pbiJ9.43PRX7wwZFof_wIWfRBQDKBfAA3CyCECtQPhFyHCScw`
    },
    body: JSON.stringify(dataItem)  // Send dataItem in request body
  });
  const data = await response.json();
  return data
}
