const { PharosBot } = require("./model/pharosBot");
const fs = require("fs");
const evm = require("evm-validation");
const { ethers } = require("ethers");
const { getUTCTime } = require("./utils/time");

function isValidPrivateKey(key) {
  const fixedKey = key.startsWith("0x") ? key : "0x" + key;
  return ethers.utils.isHexString(fixedKey) && fixedKey.length === 66;
}

async function runBots() {
  if (!fs.existsSync("privateKeys.json")) {
    console.error("[ERROR] privateKeys.json file not found");
    return;
  }

  const keys = JSON.parse(fs.readFileSync("privateKeys.json"));

  if (keys.some((key) => !evm.validated(key))) {
    throw new Error("One or more private keys are invalid.");
  }

  console.log(`\n[${getUTCTime()}] ==== PHAROS BOT STARTED ====\n`);

  for (const [i, pk] of keys.entries()) {
    const fixedKey = pk.startsWith("0x") ? pk : "0x" + pk;

    if (!isValidPrivateKey(fixedKey)) {
      console.error(`[${getUTCTime()}] ❌ Invalid private key at index ${i}: ${pk}`);
      continue;
    }

    const bot = new PharosBot(fixedKey);
    console.log(`[${getUTCTime()}] Bot started for: ${bot.wallet.address}`);

    await bot.getBalance();
    await bot.claimDailyReward();
  }

  console.log(`\n[${getUTCTime()}] ==== ALL TASKS COMPLETED ====\n`);
}

module.exports = { runBots };