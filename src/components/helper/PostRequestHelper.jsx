

export const PostRequestHelper = async(endpoint, dataItem) => {
  const response = await fetch(`http://localhost:5000/${endpoint}`,{
    
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcyNjIzMDY3MiwianRpIjoiMGY3MzJjZWMtNmJhOC00MTk0LWIzNWUtMmE0MTA3NTFmMzgyIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImZncmhobm5AZ21haWwuY29tIiwibmJmIjoxNzI2MjMwNjcyLCJjc3JmIjoiN2NlZmE4ZGQtYmYzMS00ZGYzLWFkNzMtMzQzMTk3NTRkZjA1IiwiZXhwIjoxNzI2MjM0MjcyLCJ1c2VyX25hbWUiOiJwcmVybmExMjQ2IiwidXNlcl9pZCI6Ijk1ZDQ4ZGQzLWYxODEtNDM5MC04MDM1LTIwMDgxMGNlNDUxMCIsImNvbXBhbnlfaWQiOiJjM2UwYThjOS1jNjQxLTRmOGUtYTA5Yy00MjA3MGVlMWZkYjUiLCJyb2xlIjoiQWRtaW4ifQ.OfuQ15pT5z6xF34b9XF91YFse8xSbf_sw3m9aqyBqKw`
    },
    body: JSON.stringify(dataItem)  // Send dataItem in request body
  });
  const data = await response.json();
  return data
}
