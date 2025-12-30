package com.hedera1.demo;


import com.hedera.hashgraph.sdk.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.util.Collections;
import java.util.Map;

@Slf4j
@Service
public class HederaService {

    @Value("${hedera.operator.id}") private String operatorId;
    @Value("${hedera.operator.key}") private String operatorKey;
    @Value("${hedera.contract.id}") private String contractId;

    public String registerImageOnBlockchain(String fileHash, long fileSize) throws Exception {
        Map<String, AccountId> network = Collections.singletonMap("127.0.0.1:50211", AccountId.fromString("0.0.3"));

        try (Client client = Client.forNetwork(network)) {
            client.setOperator(
                    AccountId.fromString(operatorId),
                    PrivateKey.fromString(operatorKey)
            );

            // ================= [정산 금액 계산 시작] =================
            // 임의로 제가 정한 정책: 1KB 당 1HBAR
            // 단위 변환: fileSize(byte) -> KB
            double fileSizeInKB = fileSize / 1024.0;

            // HBAR를 tinybar 단위로 변환 (1 HBAR = 100,000,000 tinybars)
            long hbarToTinybar = 100_000_000L;
            long calculatedReward = (long) (fileSizeInKB * hbarToTinybar);

            log.info("계산된 정산 금액: {} tinybars (용량: {} KB)", calculatedReward, fileSizeInKB);

            // 2. [실제 송금]
            if (calculatedReward > 0) {
                TransactionResponse transferResponse = new TransferTransaction()
                        // 보내는 사람
                        .addHbarTransfer(AccountId.fromString(operatorId), Hbar.fromTinybars(calculatedReward).negated())

                        // 받는 사람
                        .addHbarTransfer(AccountId.fromString("0.0.1002"), Hbar.fromTinybars(calculatedReward))

                        .setTransactionMemo("이미지 등록 보상 정산")
                        .execute(client);

                transferResponse.getReceipt(client); // 송금 완료 확인
                log.info("HBAR 송금 완료! 수신자: {}, 금액: {} tinybars", "0.0.1002", calculatedReward);
            }

            // 3. 스마트 컨트랙트에 기록
            ContractExecuteTransaction transaction = new ContractExecuteTransaction()
                    .setContractId(ContractId.fromString(contractId))
                    .setGas(300_000)
                    .setFunction("registerImage", new ContractFunctionParameters()
                            .addString(fileHash)
                            .addUint256(BigInteger.valueOf(fileSize))
                            .addUint256(BigInteger.valueOf(calculatedReward))
                    );

            TransactionResponse response = transaction.execute(client);
            TransactionReceipt receipt = response.getReceipt(client);

            log.info("블록체인 등록 성공, 상태: {}", receipt.status); //
            return receipt.status.toString();

        } catch (Exception e) {
            log.error("정산 중 오류 발생: ", e); //
            throw e;
        }
    }
}
