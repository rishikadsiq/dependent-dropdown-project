

export const PostRequestHelper = async(endpoint, dataItem) => {
  const response = await fetch(`http://localhost:5000/${endpoint}`,{
    
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcyNjA1ODMxNywianRpIjoiN2I0ZTlkMGMtNmY1Zi00MTdhLWFkMGEtMTQ3YjE1M2FiYmQ0IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImZncmhobm5AZ21haWwuY29tIiwibmJmIjoxNzI2MDU4MzE3LCJjc3JmIjoiZGZiZDI1NDctMDYzOS00M2ZlLTk4MDgtNjBmYjY5NGE1ZGEyIiwiZXhwIjoxNzI2MDU5MjE3LCJ1c2VyX2lkIjoiZTMzMDYxNWUtZDg0ZS00YTk2LWFhNDQtOTRlNDUxMGQ3N2RiIiwiY29tcGFueV9pZCI6IjY0OWEzNzM5LTk0ZTUtNDc0Yy05MWZlLTE4YjA4MjI1MGI1ZCIsInJvbGUiOiJBZG1pbiJ9.RusaCo58wNPkspAFFtTaKpAKa_HBq31tCdEpdZe_EQc`
    },
    body: JSON.stringify(dataItem)  // Send dataItem in request body
  });
  const data = await response.json();
  return data
}
