const { ethers } = require("ethers");
const axios = require("axios");
const { faker } = require("@faker-js/faker");
const { getUTCTime } = require("../utils/time");
const { CONFIG } = require("../config");

class PharosBot {
  constructor(privateKey) {
    this.headers = {
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.9",
      Origin: "https://testnet.pharosnetwork.xyz",
      Referer: "https://testnet.pharosnetwork.xyz/",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-site",
      "User-Agent": faker.internet.userAgent(),
    };

    this.provider = new ethers.providers.JsonRpcProvider(CONFIG.RPC_URL);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
  }

  async getBalance() {
    const balance = await this.provider.getBalance(this.wallet.address);
    console.log(
      `[${getUTCTime()}] Balance for ${this.wallet.address}: ${ethers.utils.formatEther(balance)} ETH`
    );
  }

  async claimDailyReward() {
    try {
      const res = await axios.post(`${CONFIG.BASE_API}/api/user/claim-reward`, {}, {
        headers: { ...this.headers, Authorization: this.wallet.address },
      });
      console.log(
        `[${getUTCTime()}] ✅ Successfully claimed daily reward for ${this.wallet.address}`
      );
    } catch (err) {
      console.log(
        `[${getUTCTime()}] ❌ Failed to claim reward for ${this.wallet.address}:`,
        err.response?.data || err.message
      );
    }
  }

  async swapUSDCtoWPHRS(amount) {
    console.log(
      `[${getUTCTime()}] Swapping USDC to WPHRS, amount: ${amount} USDC`
    );
  }
}

module.exports = { PharosBot };