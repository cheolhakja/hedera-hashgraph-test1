const {
  Client,
  AccountId,
  PrivateKey,
  AccountBalanceQuery
} = require("@hashgraph/sdk");

async function main() {
  console.log("🔥 test started");

  const client = Client.forLocalNode();

  client.setOperator(
    AccountId.fromString("0.0.2"),
    PrivateKey.fromString(
      "302e020100300506032b65700422042091132178e72057a1d7528025956fe39b0b847f200ab59b2fdd367017f3087137"
    )
  );

  const balance = await new AccountBalanceQuery()
    .setAccountId("0.0.2")
    .execute(client);

  console.log("✅ balance:", balance.hbars.toString());

  process.exit(0);
}

main().catch(err => {
  console.error("❌ ERROR:", err);
  process.exit(1);
});

