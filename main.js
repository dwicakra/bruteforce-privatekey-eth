const fs = require("fs");
const { ethers } = require("ethers");
const bip39 = require("bip39");
const prompt = require("prompt-sync")({ sigint: true });
const readline = require("readline");

// Daftar opsi pilihan
const options = [
  { name: "12 Mnemonic kata", value: 128 },
  { name: "15 Mnemonic kata", value: 160 },
  { name: "18 Mnemonic kata", value: 192 },
  { name: "21 Mnemonic kata", value: 244 },
  { name: "24 Mnemonic kata", value: 256 },
];

// Save Jika Ada Kecocokan
function ketemuData(log) {
  fs.appendFileSync("database/Win.txt", log + "\n");
}

// Log Generates
// function logAddressFile(log) {
//   fs.appendFileSync("database/Address.txt", log + "\n");
// }

async function BruteForce(x) {
  try {
    // Generate mnemonic
    const mnemonic = bip39.generateMnemonic(x);
    const path = "m/44'/60'/0'/0/0";
    const wallet = ethers.Wallet.fromMnemonic(mnemonic, path);
    const pKey = wallet.privateKey;
    const ethAddress = wallet.address;

    // Ambil Wallet di database.json
    const data = fs.readFileSync("database/data.json");
    const dataBase = JSON.parse(data);

    const foundItems = dataBase.filter((item) => item === ethAddress);

    if (foundItems.length > 0) {
      ketemuData(`$ Mnemonic\t: ${mnemonic}`);
      ketemuData(`$ Private Key\t: ${pKey}`);
      ketemuData(`$ Wallet Address\t: ${foundItems}`);
      ketemuData(`$ Ether\t: https://etherscan.io/address/${foundItems}`);
      ketemuData(`$ Bsc\t: https://bscscan.io/address/${foundItems}`);
      ketemuData(`$ Polygon\t: https://polygonscan.io/address/${foundItems}`);
      ketemuData("");

      console.log(
        `\x1b[93m${ethAddress}\x1b[0m   :   \x1b[92mDitemukan Kecocokan\x1b[0m`
      );
    } else {
      console.log(
        `\x1b[96m${ethAddress}\x1b[0m   :   \x1b[91mBelum Ditemukan Kecocokan\x1b[0m`
      );
    }

    // Simpan ke AddressLog.txt
    logAddressFile(`${ethAddress},${pKey},${mnemonic}`);
  } catch (error) {
    console.error(`\x1b[91m Error : ${error} \x1b[0m`);
  }
}

async function MulaiPencarian() {
  console.log(
    "\x1b[96m===============BruteForce ETH by DwiCakraMedia===============\x1b[0m"
  );
  console.log("");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("\x1b[93mPilih jumlah Mnemonic kata:\x1b[0m");
  options.forEach((option, index) => {
    console.log(`${index + 1}. ${option.name}`);
  });

  rl.question("\x1b[96mAnda Memilih: \x1b[0m", (answer) => {
    const selectedIndex = parseInt(answer) - 1;
    if (selectedIndex >= 0 && selectedIndex < options.length) {
      const selectedOption = options[selectedIndex];
      const check = prompt("\x1b[93m Generate Berapa? : \x1b[0m");
      for (let i = 0; i < check; i++) {
        new Promise((resolve) => setTimeout(resolve, 0)); //setTimeout(resolve, 10)) 1 Detik Generate 5 Wallet
        BruteForce(selectedOption.value);
      }
    } else {
      console.log(`
        \x1b[91mYah Pilihan Salah, Ulangi ya.\x1b[0m
        `);
      MulaiPencarian();
    }
    rl.close();
  });
}

MulaiPencarian();
