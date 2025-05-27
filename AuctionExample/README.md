# Car Auction DApp

이 프로젝트는 이더리움 블록체인을 기반으로 한 자동차 경매 분산 애플리케이션(DApp)입니다.

## 필수 요구사항

1. **Ganache**: 로컬 이더리움 블록체인 (포트 7545에서 실행)
2. **MetaMask**: 브라우저 지갑 확장 프로그램
3. **Node.js**: 웹 서버 실행용

## 설정 방법

### 1. Ganache 설정

- Ganache를 실행하고 포트 7545에서 실행되는지 확인
- 계정 주소들을 확인하고 기록

### 2. 스마트 컨트랙트 배포

- Remix IDE에서 `Auction.sol` 파일을 열기
- 컨트랙트명을 `MyAuction`으로 변경하여 컴파일
- Ganache 네트워크에 배포
- 배포된 컨트랙트 주소를 복사

### 3. 프론트엔드 설정

- `auction.js` 파일에서 다음 부분들을 수정:
  - `auctionContract.options.address`: 배포된 컨트랙트 주소로 변경
  - `userWalletAddress`: 사용할 지갑 주소로 변경

## 실행 방법

### 방법 1: HTTP 서버 사용 (권장)

```bash
npm start
```

또는

```bash
npx http-server . -p 3000 -o
```

### 방법 2: Live Server 사용 (개발용)

```bash
npm run dev
```

### 방법 3: Python 간단 서버

```bash
python -m http.server 3000
```

## 브라우저에서 접속

- http://localhost:3000 으로 접속
- MetaMask를 Ganache 네트워크에 연결
- 경매 참여 및 입찰 진행

## 주요 기능

- 자동차 경매 생성
- 입찰 참여
- 경매 취소 (소유자만)
- 자금 회수 (경매 종료 후)
- 실시간 이벤트 로그

## 문제 해결

- Web3 오류: 브라우저에서만 실행 가능, Node.js 직접 실행 불가
- 네트워크 오류: Ganache가 7545 포트에서 실행 중인지 확인
- 트랜잭션 오류: MetaMask 계정과 가스비 확인
