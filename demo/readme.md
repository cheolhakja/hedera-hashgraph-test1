### 폴더의 구조

### 실행방법
* 공식 repo 클론
```
git clone https://github.com/hashgraph/hedera-local-node.git
cd hedera-local-node
docker compose up -d
```

```angular2html 
cd my-hedera/app-db
docker compose up -d
// 이미지 및 사용자 정보 DB.. (구현 예정)
```
```
cd my-hedera/contracts //(전지윤)은 안해도됨
npm init -y
npm install @hashgraph/sdk ethers
```

```
cd my-hedera/contracts
node compile.js
node deploy.js

/*테스트로 무작위 값을 넣어, 거래가 잘 등록되는지 확인해보기*/
node register.js
```
* expected output
```
✅ Compile complete

🔥 deploy.js started
📦 bytecode size: 5690
📄 Bytecode File ID: 0.0.1001

🔥 register.js started
🎉 registerImage result: SUCCESS

```


### javascript 파일 설명
> ImageRegister.sol
> 
> 거래의 포맷을 지정함 struct Image

> compile.js 
> 
> 스마트 컨트랙트 인스턴스를 해쉬그래프에 등록하기 위해, solidity 파일을 컴파일하는 스크립트 작성
> fileID생성

> deploy.js
> 
> 컴파일된 sol 파일을 해쉬그래프에 스마트 컨트랙트 인스턴스로 등록
> fileID를 이용해서 ContractID생성

> register.js
> 
> 스마트 컨트랙트 인스턴스를 활용하여 해쉬그래프에 거래 해보는 파일 (값은 아무거나 집어넣었습니다). 해쉬그래프에 트랜잭션이 잘 등록되는지 확인해보려함이었습니다.
> 이때 contractID활용

### 기타 설정들
* 잔액
```angular2html
node test.js //테스트용 로컬 헤데라 해쉬그래프의 operator지갑 잔액. 
```

* 계정(전자지갑) 정보
> user wallet id, operator id, operator key
> hedera-local-node의 readme 참조 (테스트용 id, key인것 같습니다.)
