// 🚗 자동차 경매 DApp - 최종 버전
console.log("🎯 최종 경매 앱 시작! v2.0");

// Web3 연결
var web3 = new Web3("http://localhost:7545");
var userAccount = "0x360894E32A1Bb5cD958707D0aA0DA26EBBFE988b";

// 컨트랙트 ABI
var auctionABI = [
  {
    inputs: [],
    name: "bid",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "cancel_auction",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "auction_end",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "highestBid",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "highestBidder",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "bids",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "get_owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "Mycar",
    outputs: [
      { internalType: "string", name: "Brand", type: "string" },
      { internalType: "string", name: "Rnumber", type: "string" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "STATE",
    outputs: [
      { internalType: "enum MyAuction.auction_state", name: "", type: "uint8" },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// 컨트랙트 연결
var auctionContract = new web3.eth.Contract(
  auctionABI,
  "0x18Ed06253CA13628Db6885770B8e743B564F03Ef"
);

// 시작 함수
function init() {
  console.log("🎯 페이지 초기화 시작 - v2.0");
  console.log("⏰ 3초 후 정보를 불러옵니다...");

  // 3초 후에 정보 로드 (DOM 완전 준비 대기)
  setTimeout(function () {
    console.log("📊 정보 로딩 시작...");
    loadAuctionInfo();
  }, 3000);
}

// 경매 정보 불러오기
async function loadAuctionInfo() {
  try {
    console.log("🔄 컨트랙트에서 정보 가져오는 중...");

    // 경매 종료 시간
    const endTime = await auctionContract.methods.auction_end().call();
    const endElement = document.getElementById("auction_end");
    if (endElement) {
      endElement.innerHTML = endTime;
      console.log("⏰ 경매 종료 시간:", endTime);
    }

    // 최고 입찰 금액
    const highestBid = await auctionContract.methods.highestBid().call();
    const bidEth = web3.utils.fromWei(highestBid, "ether");
    const bidElement = document.getElementById("HighestBid");
    if (bidElement) {
      bidElement.innerHTML = bidEth;
      console.log("💰 최고 입찰:", bidEth, "ETH");
    }

    // 최고 입찰자
    const highestBidder = await auctionContract.methods.highestBidder().call();
    const bidderElement = document.getElementById("HighestBidder");
    if (bidderElement) {
      bidderElement.innerHTML = highestBidder;
      console.log("🏆 최고 입찰자:", highestBidder);
    }

    // 내 입찰 금액
    const myBid = await auctionContract.methods.bids(userAccount).call();
    const myBidEth = web3.utils.fromWei(myBid, "ether");
    const myBidElement = document.getElementById("MyBid");
    if (myBidElement) {
      myBidElement.innerHTML = myBidEth;
      console.log("💵 내 입찰:", myBidEth, "ETH");
    }

    // 차량 정보
    const carInfo = await auctionContract.methods.Mycar().call();
    const brandElement = document.getElementById("car_brand");
    const numberElement = document.getElementById("registration_number");
    if (brandElement && carInfo[0]) {
      brandElement.innerHTML = carInfo[0];
      console.log("🚗 차량 브랜드:", carInfo[0]);
    }
    if (numberElement && carInfo[1]) {
      numberElement.innerHTML = carInfo[1];
      console.log("🔢 차량 번호:", carInfo[1]);
    }

    // 경매 상태
    const auctionState = await auctionContract.methods.STATE().call();
    const stateElement = document.getElementById("STATE");
    if (stateElement) {
      stateElement.innerHTML = auctionState;
      console.log("📊 경매 상태:", auctionState);
    }

    // 계정 정보
    const balance = await web3.eth.getBalance(userAccount);
    const balanceEth = web3.utils.fromWei(balance, "ether");
    const accountElement = document.getElementById("current_account");
    const balanceElement = document.getElementById("account_balance");

    if (accountElement) {
      accountElement.innerHTML = userAccount;
    }
    if (balanceElement) {
      balanceElement.innerHTML = parseFloat(balanceEth).toFixed(2);
      console.log("💰 내 잔액:", parseFloat(balanceEth).toFixed(2), "ETH");
    }

    console.log("✅ 모든 정보 로드 완료!");

    // 상태 메시지 업데이트
    const statusElement = document.getElementById("biding_status");
    if (statusElement) {
      statusElement.innerHTML = "✅ 준비 완료! 입찰할 수 있습니다.";
    }
  } catch (error) {
    console.log("❌ 정보 로드 에러:", error);
    const statusElement = document.getElementById("biding_status");
    if (statusElement) {
      statusElement.innerHTML = "❌ 에러: " + error.message;
    }
  }
}

// 입찰하기
async function bid() {
  console.log("💰 입찰 시작...");

  try {
    const valueElement = document.getElementById("value");
    const statusElement = document.getElementById("biding_status");

    if (!valueElement) {
      console.log("❌ 입력 필드를 찾을 수 없습니다");
      return;
    }

    const amount = valueElement.value;
    console.log("💵 입찰 금액:", amount, "ETH");

    if (!amount || amount <= 0) {
      if (statusElement) {
        statusElement.innerHTML = "❌ 금액을 입력하세요!";
      }
      return;
    }

    // 현재 최고 입찰가와 내 기존 입찰 확인
    try {
      const currentHighestBid = await auctionContract.methods
        .highestBid()
        .call();
      const currentHighestBidEth = parseFloat(
        web3.utils.fromWei(currentHighestBid, "ether")
      );
      const currentHighestBidder = await auctionContract.methods
        .highestBidder()
        .call();
      const myCurrentBid = await auctionContract.methods
        .bids(userAccount)
        .call();
      const myCurrentBidEth = parseFloat(
        web3.utils.fromWei(myCurrentBid, "ether")
      );
      const newBidAmount = parseFloat(amount);
      const totalBidAmount = myCurrentBidEth + newBidAmount;

      // 디버깅: 주소 비교 정보 출력
      console.log("🔍 주소 비교 디버깅:");
      console.log("현재 최고 입찰자:", currentHighestBidder);
      console.log("내 계정:", userAccount);
      console.log("최고 입찰자 (소문자):", currentHighestBidder.toLowerCase());
      console.log("내 계정 (소문자):", userAccount.toLowerCase());
      console.log(
        "주소 일치 여부:",
        currentHighestBidder.toLowerCase() === userAccount.toLowerCase()
      );

      // 내가 이미 최고 입찰자인 경우 체크
      if (currentHighestBidder.toLowerCase() === userAccount.toLowerCase()) {
        if (statusElement) {
          statusElement.innerHTML = `❌ 이미 최고 입찰자입니다! (현재 ${currentHighestBidEth} ETH)`;
        }
        alert(
          `❌ 입찰 실패!\n이미 최고 입찰자입니다!\n\n현재 최고가: ${currentHighestBidEth} ETH\n다른 사람이 더 높은 금액으로 입찰할 때까지 기다려주세요.`
        );
        return;
      }

      if (totalBidAmount <= currentHighestBidEth) {
        if (statusElement) {
          statusElement.innerHTML = `❌ 총 입찰금액(${totalBidAmount} ETH)이 현재 최고가(${currentHighestBidEth} ETH)보다 높아야 합니다!`;
        }
        alert(
          `❌ 입찰 실패!\n현재 최고가: ${currentHighestBidEth} ETH\n내 기존 입찰: ${myCurrentBidEth} ETH\n새 입찰: ${newBidAmount} ETH\n총 입찰: ${totalBidAmount} ETH\n\n총 입찰금액이 현재 최고가보다 높아야 합니다.`
        );
        return;
      }

      console.log(
        `💡 입찰 정보: 기존 ${myCurrentBidEth} ETH + 새로운 ${newBidAmount} ETH = 총 ${totalBidAmount} ETH`
      );
    } catch (error) {
      console.log("최고가 확인 중 에러:", error);
    }

    if (statusElement) {
      statusElement.innerHTML = "⏳ 입찰 중... 잠시만 기다려주세요";
    }

    const result = await auctionContract.methods.bid().send({
      from: userAccount,
      value: web3.utils.toWei(amount, "ether"),
      gas: 300000,
    });

    if (statusElement) {
      statusElement.innerHTML = "✅ 입찰 성공! 3초 후 정보가 업데이트됩니다.";
    }
    console.log("✅ 입찰 성공:", result);
    alert("🎉 입찰 성공! 입찰이 완료되었습니다.");

    // 3초 후 정보 새로고침
    setTimeout(loadAuctionInfo, 3000);
  } catch (error) {
    console.log("❌ 입찰 에러:", error);
    const statusElement = document.getElementById("biding_status");
    if (statusElement) {
      statusElement.innerHTML = "❌ 입찰 실패: " + error.message;
    }
    // 스마트 컨트랙트에서 바로 한국어 메시지가 오므로 번역 불필요
    let msg = error.message;
    if (msg.includes("insufficient funds")) {
      msg = "잔액이 부족합니다. (입찰 금액 + 가스 비용)";
    } else if (msg.includes("gas")) {
      msg = "가스 부족 또는 가스 관련 오류입니다.";
    } else if (msg.includes("revert")) {
      msg = "거래가 실패했습니다. 조건을 확인해주세요.";
    }
    alert("❌ 입찰 실패!\n" + msg);
  }
}

// 경매 취소
async function cancel_auction() {
  console.log("🚫 경매 취소 시작...");

  try {
    const statusElement = document.getElementById("withdraw_status");
    if (statusElement) {
      statusElement.innerHTML = "⏳ 경매 취소 중...";
    }

    const result = await auctionContract.methods.cancel_auction().send({
      from: userAccount,
      gas: 300000,
    });

    if (statusElement) {
      statusElement.innerHTML = "✅ 경매 취소 성공!";
    }
    console.log("✅ 경매 취소 성공:", result);
    alert("🚫 경매 취소가 완료되었습니다.");

    setTimeout(loadAuctionInfo, 3000);
  } catch (error) {
    console.log("❌ 경매 취소 에러:", error);
    const statusElement = document.getElementById("withdraw_status");
    if (statusElement) {
      statusElement.innerHTML = "❌ 경매 취소 실패: " + error.message;
    }
    // 스마트 컨트랙트에서 바로 한국어 메시지가 오므로 번역 불필요
    let msg = error.message;
    if (msg.includes("gas")) {
      msg = "가스 부족 또는 가스 관련 오류입니다.";
    } else if (msg.includes("revert")) {
      msg = "거래가 실패했습니다. 권한을 확인해주세요.";
    }
    alert("❌ 경매 취소 실패!\n" + msg);
  }
}

// 출금하기
async function withdraw() {
  console.log("💸 출금 시작...");

  try {
    const statusElement = document.getElementById("withdraw_status");
    if (statusElement) {
      statusElement.innerHTML = "⏳ 출금 처리 중...";
    }

    const result = await auctionContract.methods.withdraw().send({
      from: userAccount,
      gas: 300000,
    });

    if (statusElement) {
      statusElement.innerHTML = "✅ 출금 성공!";
    }
    console.log("✅ 출금 성공:", result);
    alert("💸 출금이 완료되었습니다. 자금이 성공적으로 출금되었습니다.");

    setTimeout(loadAuctionInfo, 3000);
  } catch (error) {
    console.log("❌ 출금 에러:", error);
    const statusElement = document.getElementById("withdraw_status");
    if (statusElement) {
      statusElement.innerHTML = "❌ 출금 실패: " + error.message;
    }
    // 스마트 컨트랙트에서 바로 한국어 메시지가 오므로 번역 불필요
    let msg = error.message;
    if (msg.includes("gas")) {
      msg = "가스 부족 또는 가스 관련 오류입니다.";
    } else if (msg.includes("revert")) {
      msg = "거래가 실패했습니다. 출금 조건을 확인해주세요.";
    }
    alert("❌ 출금 실패!\n" + msg);
  }
}

// 낙찰금 출금 (소유자용)
async function withdrawWinningBid() {
  console.log("🏆 낙찰금 출금 시작...");

  try {
    const statusElement = document.getElementById("withdraw_status");
    if (statusElement) {
      statusElement.innerHTML = "⏳ 낙찰금 출금 중...";
    }

    const result = await auctionContract.methods.withdrawWinningBid().send({
      from: userAccount,
      gas: 300000,
    });

    if (statusElement) {
      statusElement.innerHTML = "✅ 낙찰금 출금 성공!";
    }
    console.log("✅ 낙찰금 출금 성공:", result);
    alert(
      "🏆 낙찰금 출금이 완료되었습니다. 낙찰금이 성공적으로 출금되었습니다."
    );

    setTimeout(loadAuctionInfo, 3000);
  } catch (error) {
    console.log("❌ 낙찰금 출금 에러:", error);
    const statusElement = document.getElementById("withdraw_status");
    if (statusElement) {
      statusElement.innerHTML = "❌ 낙찰금 출금 실패: " + error.message;
    }
    // 스마트 컨트랙트에서 바로 한국어 메시지가 오므로 번역 불필요
    let msg = error.message;
    if (msg.includes("is not a function")) {
      msg = "스마트 컨트랙트에 낙찰금 출금 함수가 없습니다.";
    } else if (msg.includes("gas")) {
      msg = "가스 부족 또는 가스 관련 오류입니다.";
    } else if (msg.includes("revert")) {
      msg = "거래가 실패했습니다. 낙찰금 출금 조건을 확인해주세요.";
    }
    alert("❌ 낙찰금 출금 실패!\n" + msg);
  }
}
