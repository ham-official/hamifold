const { Network, Alchemy } = require('alchemy-sdk')

const alchemySDKConnector = (chainId) => {
  const settings = {
    apiKey: chainId === 1 ? process.env.ALCHEMY_API_KEY : process.env.ALCHEMY_API_KEY_GOERLI,
    network: chainId === 1 ? Network.ETH_MAINNET : Network.ETH_GOERLI,
    authToken: process.env.ALCHEMY_NOTIFY_AUTH_TOKEN,
  }

  return new Alchemy(settings)
}
const alchemyHTTPNotifyConnector = () => {
  return { accept: 'application/json', 'X-Alchemy-Token': process.env.ALCHEMY_NOTIFY_AUTH_TOKEN }
}

module.exports = { alchemySDKConnector, alchemyHTTPNotifyConnector }
