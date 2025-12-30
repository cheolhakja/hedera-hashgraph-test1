const {
  Client,
  AccountId,
  PrivateKey,
  ContractExecuteTransaction,
  ContractFunctionParameters
} = require("@hashgraph/sdk");

async function main() {
  console.log("🔥 register.js started");

  const client = Client.forLocalNode();

  client.setOperator(
    AccountId.fromString("0.0.2"),
    PrivateKey.fromString(
      "302e020100300506032b65700422042091132178e72057a1d7528025956fe39b0b847f200ab59b2fdd367017f3087137"
    )
  );

  const contractId = "0.0.1013"; // 네가 방금 배포한 컨트랙트

  const tx = await new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(300_000)
    .setFunction(
      "registerImage",
      new ContractFunctionParameters()
        .addString("QmTestImageHash123")
        .addUint256(123456)   // fileSize
        .addUint256(1000)     // reward
    )
    .execute(client);

  const receipt = await tx.getReceipt(client);
  console.log("🎉 registerImage result:", receipt.status.toString());

  process.exit(0);
}

main().catch(err => {
  console.error("❌ ERROR:", err);
  process.exit(1);
});
