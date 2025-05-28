// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyAuction {
    address internal auction_owner;
    uint256 public auction_start;
    uint256 public auction_end;
    uint256 public highestBid;
    address public highestBidder;

    enum auction_state {
        CANCELLED, STARTED
    }

    struct car {
        string Brand;
        string Rnumber;
    }

    car public Mycar;
    address[] bidders;
    mapping(address => uint) public bids;
    auction_state public STATE;

    // 경매가 진행 중인지 확인하는 modifier
    modifier an_ongoing_auction() {
        require(block.timestamp <= auction_end, "Auction has ended");
        _;
    }

    // 경매 소유자만 호출할 수 있는 modifier
    modifier only_owner() {
        require(msg.sender == auction_owner, "Only auction owner can call this");
        _;
    }

    // 이벤트 선언
    event BidEvent(address indexed highestBidder, uint256 highestBid);
    event WithdrawalEvent(address withdrawer, uint256 amount);
    event CanceledEvent(uint message, uint256 time);
    event StateUpdated(auction_state newState);

    // 생성자
    constructor(uint _biddingTime, address _owner, string memory _brand, string memory _Rnumber) {
        auction_owner = _owner;
        auction_start = block.timestamp;
        auction_end = auction_start + _biddingTime * 1 hours;
        STATE = auction_state.STARTED;
        Mycar.Brand = _brand;
        Mycar.Rnumber = _Rnumber;
    }

    // 입찰 함수
    function bid() public payable an_ongoing_auction returns (bool) {
        require(bids[msg.sender] + msg.value > highestBid, "You can't bid, make a higher bid");
        
        // 입찰자가 처음 입찰하는 경우에만 bidders 배열에 추가
        if (bids[msg.sender] == 0) {
            bidders.push(msg.sender);
        }
        
        bids[msg.sender] = bids[msg.sender] + msg.value;
        highestBidder = msg.sender;
        highestBid = bids[msg.sender];
        
        emit BidEvent(highestBidder, highestBid);
        return true;
    }

    // 경매 취소
    function cancel_auction() external only_owner an_ongoing_auction returns (bool) {
        STATE = auction_state.CANCELLED;
        emit CanceledEvent(1, block.timestamp);
        return true;
    }

    // 경매 비활성화
    function deactivateAuction() external only_owner {
        require(block.timestamp > auction_end, "Auction is still ongoing");
        STATE = auction_state.CANCELLED;
        emit CanceledEvent(2, block.timestamp);
    }

    // 출금 함수 - 핵심 수정: 경매 종료 후 실패한 입찰자들도 회수 가능
    function withdraw() public returns (bool) {
        uint amount = bids[msg.sender];
        require(amount > 0, "No funds to withdraw");

        // 🔥 핵심 로직: 
        // 경매가 진행 중이면 → 누구나 회수 가능
        // 경매가 끝났으면 → 최고 입찰자가 아닌 사람만 회수 가능
        if (block.timestamp > auction_end) {
            require(msg.sender != highestBidder, "Highest bidder cannot withdraw after auction ends");
        }

        bids[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: amount}(""); 
        require(success, "Transfer failed");

        emit WithdrawalEvent(msg.sender, amount);
        return true;
    }

    // 경매 소유자가 최고 입찰 금액을 회수하는 함수
    function withdrawWinningBid() external only_owner {
        require(block.timestamp > auction_end, "Auction is still ongoing");
        require(highestBidder != address(0), "No bids were placed");
        
        uint amount = bids[highestBidder];
        require(amount > 0, "No winning bid to withdraw");
        
        bids[highestBidder] = 0;
        
        (bool success, ) = payable(auction_owner).call{value: amount}("");
        require(success, "Transfer failed");
        
        emit WithdrawalEvent(auction_owner, amount);
    }

    // 경매 소유자가 남은 자금을 회수하는 함수
    function withdrawRemainingFunds() external only_owner {
        uint balance = address(this).balance;
        require(balance > 0, "No funds left in the contract");

        (bool success, ) = payable(auction_owner).call{value: balance}("");
        require(success, "Transfer failed");
    }

    // 소유자 정보 반환 함수
    function get_owner() public view returns (address) {
        return auction_owner;
    }

    // 경매 상태를 업데이트하는 함수
    function updateAuctionState(auction_state newState) external only_owner {
        STATE = newState;
        emit StateUpdated(newState);
    }
}