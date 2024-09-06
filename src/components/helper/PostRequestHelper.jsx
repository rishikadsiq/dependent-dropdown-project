

export const PostRequestHelper = async(endpoint, dataItem) => {
  const response = await fetch(`http://localhost:5000/${endpoint}`,{
    
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcyNTYyNDk0NywianRpIjoiZDU5ZTVmNjMtMmM0OC00NGM5LTlhNTAtOWVkZmU2NTQ4MmMyIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImZncmhobm5AZ21haWwuY29tIiwibmJmIjoxNzI1NjI0OTQ3LCJjc3JmIjoiYzI3ZDdlZGEtN2NmNS00OWVhLTg3ODYtMjEzZjRmZmM3ODc2IiwiZXhwIjoxNzI1NjI1ODQ3LCJ1c2VyX2lkIjoiZTMzMDYxNWUtZDg0ZS00YTk2LWFhNDQtOTRlNDUxMGQ3N2RiIiwiY29tcGFueV9pZCI6IjY0OWEzNzM5LTk0ZTUtNDc0Yy05MWZlLTE4YjA4MjI1MGI1ZCIsInJvbGUiOiJBZG1pbiJ9.cp7r_Kd7Re2xuWFDZFpXa1pTi_8NQaKAZ4pfoCDbEZ0`
    },
    body: JSON.stringify(dataItem)  // Send dataItem in request body
  });
  const data = await response.json();
  return data
}
