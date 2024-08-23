exports.handler = async (event) => {
  const queryParams = event.queryStringParameters
  // console.log(queryParams)
  const queryParamsArray = Object.keys(queryParams)
  const numberOfQueryParams = queryParamsArray.length
  let queryParamsURL = numberOfQueryParams > 0 ? '?' : ''
  queryParamsArray.forEach((param, index) => {
    queryParamsURL += `${param}=${queryParams[param]}${index === numberOfQueryParams - 1 ? '' : '&'}`
  })
  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + process.env.PINATA_AUTH_TOKEN
    }
  };
  const response = await fetch(`https://api.pinata.cloud/data/pinList${queryParamsURL}`, options)
    .catch(err => {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal Server Error" }),
        message: err.statusText
      };
    });
  if (response.status === 200) {
    const responseBody = await response.json()
    return {
      statusCode: 200,
      body: JSON.stringify({ ...responseBody }),
      message: "List of files for account",
    };
  } else {
    return {
      statusCode: response.status,
      message: response.statusText,
    };
  }
}