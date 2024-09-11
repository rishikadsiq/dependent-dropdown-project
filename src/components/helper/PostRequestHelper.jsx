

export const PostRequestHelper = async(endpoint, dataItem) => {
  const response = await fetch(`http://localhost:5000/${endpoint}`,{
    
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcyNjA4NzgyMCwianRpIjoiNDRiNGQ0MjAtMmJmNS00MWE3LWE5YTUtZDRhZjhjYjJmMzFlIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImZncmhobm5AZ21haWwuY29tIiwibmJmIjoxNzI2MDg3ODIwLCJjc3JmIjoiODE5MWUxYWEtMzczYS00NzZmLTgyYjEtN2Q2MmQ3YjZhZTFhIiwiZXhwIjoxNzI2MDg4NzIwLCJyb2xlIjoiQWRtaW4iLCJjb21wYW55X2lkIjoiMGE2ZGEwM2YtNTdmOS00ZjljLTg1ZWQtN2U0OWZiNzU4MzIxIiwidXNlcl9pZCI6IjU4YzM4MTc4LTU0MjAtNDllMi05ODg4LWZjODgwYTM1ZGY0YiJ9.UsozhqWzCvCcm0ZwMfE2RsQTbgeBHPQpet-EvZDzw8E`
    },
    body: JSON.stringify(dataItem)  // Send dataItem in request body
  });
  const data = await response.json();
  return data
}
