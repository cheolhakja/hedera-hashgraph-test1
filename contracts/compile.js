const fs = require("fs");
const solc = require("solc");

// Solidity FILE READ
const source = fs.readFileSync("ImageRegistry.sol", "utf8");

// solc INPUT FORMAT
const input = {
  language: "Solidity",
  sources: {
    "ImageRegistry.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode"],
      },
    },
  },
};

// COMPILE
const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  for (const error of output.errors) {
    console.error(error.formattedMessage);
  }
}

// RESULT
const contract =
  output.contracts["ImageRegistry.sol"]["ImageRegistry"];

fs.writeFileSync(
  "ImageRegistry.bin",
  contract.evm.bytecode.object
);
fs.writeFileSync(
  "ImageRegistry.abi",
  JSON.stringify(contract.abi, null, 2)
);

console.log("✅ Compile complete");
