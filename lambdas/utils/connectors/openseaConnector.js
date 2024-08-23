module.exports = (chainId) => {
  return { accept: 'application/json', 'X-API-KEY': chainId === 1 ? process.env.OPENSEA_API_KEY : '' }
}
