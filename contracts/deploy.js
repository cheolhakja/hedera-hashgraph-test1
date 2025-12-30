console.log("🔥 deploy.js started");

const {
  Client,
  AccountId,
  PrivateKey,
  FileCreateTransaction,
  FileAppendTransaction,
  ContractCreateTransaction,
  Hbar
} = require("@hashgraph/sdk");
const fs = require("fs");

async function main() {
  const client = Client.forLocalNode();

  client.setOperator(
    AccountId.fromString("0.0.2"),
    PrivateKey.fromString(
      "302e020100300506032b65700422042091132178e72057a1d7528025956fe39b0b847f200ab59b2fdd367017f3087137"
    )
  );

  // 1️⃣ bytecode 읽기
  const bytecode = fs.readFileSync("./ImageRegistry.bin");
  console.log("📦 bytecode size:", bytecode.length);

  // 2️⃣ FileCreate
  const fileCreateTx = await new FileCreateTransaction()
    .setContents(bytecode)
    .setKeys([client.operatorPublicKey])
    .setMaxTransactionFee(new Hbar(10))
    .execute(client);

  const fileCreateReceipt = await fileCreateTx.getReceipt(client);
  const bytecodeFileId = fileCreateReceipt.fileId;

  console.log("📄 Bytecode File ID:", bytecodeFileId.toString());

  // 3️⃣ ContractCreate
  const contractTx = await new ContractCreateTransaction()
    .setBytecodeFileId(bytecodeFileId)
    .setGas(2_000_000)
    .setMaxTransactionFee(new Hbar(20))
    .execute(client);

  const contractReceipt = await contractTx.getReceipt(client);

  console.log("🎉 Contract ID:", contractReceipt.contractId.toString());

  process.exit(0);
}

main().catch(err => {
  console.error("❌ ERROR:", err);
  process.exit(1);
});

