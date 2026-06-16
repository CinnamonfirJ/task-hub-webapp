import * as StellarSdk from 'stellar-sdk';

const IS_TESTNET = process.env.NEXT_PUBLIC_STELLAR_NETWORK !== 'public';

export const NGNC_ISSUER_KEY =
  process.env.NEXT_PUBLIC_NGNC_ISSUER_KEY ||
  'GBBHOAIY435CR52ETRWOSRF44L4VIRADSKSW3Z4HTQTJJMQZQXDCRORG';

export const NETWORK_PASSPHRASE = IS_TESTNET
  ? StellarSdk.Networks.TESTNET
  : StellarSdk.Networks.PUBLIC;

export const HORIZON_URL =
  process.env.NEXT_PUBLIC_STELLAR_HORIZON_URL ||
  (IS_TESTNET
    ? 'https://horizon-testnet.stellar.org'
    : 'https://horizon.stellar.org');

export const server = new StellarSdk.Horizon.Server(HORIZON_URL);
export { IS_TESTNET };
