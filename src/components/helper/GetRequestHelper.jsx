

export const GetRequestHelper = async (endpoint) => {
    const response = await fetch(`http://localhost:5000/${endpoint}`,{
      
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcyNjE0MzA0NiwianRpIjoiYjJhZTIwYzAtZDdjYS00ZTczLTkzMjctOWQ1NzU0MjQ4ZjBmIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImZncmhobm5AZ21haWwuY29tIiwibmJmIjoxNzI2MTQzMDQ2LCJjc3JmIjoiNjljYmI0NTAtMmE1Mi00YTAxLWExYzUtOGU0OTgzYWJiOWUyIiwiZXhwIjoxNzI2MTQzOTQ2LCJyb2xlIjoiQWRtaW4iLCJjb21wYW55X2lkIjoiYzNlMGE4YzktYzY0MS00ZjhlLWEwOWMtNDIwNzBlZTFmZGI1IiwidXNlcl9pZCI6Ijk1ZDQ4ZGQzLWYxODEtNDM5MC04MDM1LTIwMDgxMGNlNDUxMCJ9.EYa-j24JJzAz698m2AbkaanxZDu6M5_nz_WkXcAo6Xs`
      },
    });
    console.log(response)
    const data = await response.json();
    console.log(data)
    return data
  }
  