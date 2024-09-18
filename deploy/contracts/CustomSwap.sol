// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract CustomSwap is ERC20 {
    struct TokenPair {
        IERC20 token0;
        IERC20 token1;
        uint reserve0;
        uint reserve1;
    }

    // 用户的交易历史记录
    struct SwapHistory {
        address user;
        uint tokenPairId;
        uint amountIn;
        address tokenIn;
        uint amountOut;
        address tokenOut;
        uint timestamp;
    }

    SwapHistory[] public swapHistories;

    // 交易计数变量
    uint public swapCount = 10; // 默认拆分次数为10

    // 事件
    event Mint(
        address indexed sender,
        uint amount0,
        uint amount1,
        uint tokenPairId
    );
    event Burn(
        address indexed sender,
        uint amount0,
        uint amount1,
        uint tokenPairId
    );
    event Swap(
        address indexed sender,
        uint amountIn,
        address tokenIn,
        uint amountOut,
        address tokenOut,
        uint tokenPairId,
        uint timestamp
    );

    // 构造器，初始化合约名称和符号
    constructor() ERC20("LP", "LP") {}

    // 代币对的ID计数器
    uint public tokenPairCount = 1;

    // 存储代币对的映射
    mapping(uint => TokenPair) public tokenPairs;

    // 记录代币对的唯一性检查
    mapping(bytes32 => bool) public tokenPairExists;

    // 添加代币对
    function addTokenPair(
        IERC20 _token0,
        IERC20 _token1
    ) public returns (uint tokenPairId) {
        require(
            address(_token0) != address(0) && address(_token1) != address(0),
            "Invalid token addresses"
        );

        // 计算代币对的唯一哈希
        bytes32 pairHash = getPairHash(_token0, _token1);

        // 检查代币对是否已存在
        require(!tokenPairExists[pairHash], "Token pair already exists");

        // 标记代币对已存在
        tokenPairExists[pairHash] = true;

        // 添加新的代币对
        tokenPairId = tokenPairCount++;
        tokenPairs[tokenPairId] = TokenPair({
            token0: _token0,
            token1: _token1,
            reserve0: 0,
            reserve1: 0
        });
    }

    // 计算代币对的唯一哈希
    function getPairHash(
        IERC20 _token0,
        IERC20 _token1
    ) internal pure returns (bytes32) {
        // 为了确保代币对的唯一性，可以将地址按照大小排序
        return
            keccak256(
                abi.encodePacked(
                    _token0 < _token1 ? _token0 : _token1,
                    _token0 < _token1 ? _token1 : _token0
                )
            );
    }

    // 添加流动性，转进代币，铸造LP
    function addLiquidity(
        uint tokenPairId,
        uint amount0Desired,
        uint amount1Desired
    ) public returns (uint liquidity) {
        TokenPair storage pair = tokenPairs[tokenPairId];
        require(
            address(pair.token0) != address(0) &&
                address(pair.token1) != address(0),
            "Invalid token pair"
        );

        pair.token0.transferFrom(msg.sender, address(this), amount0Desired);
        pair.token1.transferFrom(msg.sender, address(this), amount1Desired);

        uint _totalSupply = totalSupply();
        if (_totalSupply == 0) {
            liquidity = sqrt(amount0Desired * amount1Desired);
        } else {
            liquidity = min(
                (amount0Desired * _totalSupply) / pair.reserve0,
                (amount1Desired * _totalSupply) / pair.reserve1
            );
        }

        require(liquidity > 0, "INSUFFICIENT_LIQUIDITY_MINTED");

        pair.reserve0 = pair.token0.balanceOf(address(this));
        pair.reserve1 = pair.token1.balanceOf(address(this));

        _mint(msg.sender, liquidity);
        emit Mint(msg.sender, amount0Desired, amount1Desired, tokenPairId);
    }

    // 移除流动性，销毁LP，转出代币
    function removeLiquidity(
        uint tokenPairId,
        uint liquidity
    ) external returns (uint amount0, uint amount1) {
        TokenPair storage pair = tokenPairs[tokenPairId];
        require(
            address(pair.token0) != address(0) &&
                address(pair.token1) != address(0),
            "Invalid token pair"
        );

        uint balance0 = pair.token0.balanceOf(address(this));
        uint balance1 = pair.token1.balanceOf(address(this));

        uint _totalSupply = totalSupply();
        amount0 = (liquidity * balance0) / _totalSupply;
        amount1 = (liquidity * balance1) / _totalSupply;
        require(amount0 > 0 && amount1 > 0, "INSUFFICIENT_LIQUIDITY_BURNED");

        _burn(msg.sender, liquidity);

        pair.token0.transfer(msg.sender, amount0);
        pair.token1.transfer(msg.sender, amount1);

        pair.reserve0 = pair.token0.balanceOf(address(this));
        pair.reserve1 = pair.token1.balanceOf(address(this));

        emit Burn(msg.sender, amount0, amount1, tokenPairId);
    }

    // 交换代币
    function swap(
        uint tokenPairId,
        uint amountIn,
        IERC20 tokenIn,
        uint amountOutMin
    ) external returns (uint amountOut, IERC20 tokenOut) {
        TokenPair storage pair = tokenPairs[tokenPairId];
        require(
            address(pair.token0) != address(0) &&
                address(pair.token1) != address(0),
            "Invalid token pair"
        );
        require(amountIn > 0, "INSUFFICIENT_OUTPUT_AMOUNT");
        require(
            tokenIn == pair.token0 || tokenIn == pair.token1,
            "INVALID_TOKEN"
        );

        uint balance0 = pair.token0.balanceOf(address(this));
        uint balance1 = pair.token1.balanceOf(address(this));

        if (tokenIn == pair.token0) {
            tokenOut = pair.token1;
            amountOut = getAmountOut(amountIn, balance0, balance1);
            require(amountOut > amountOutMin, "INSUFFICIENT_OUTPUT_AMOUNT");
            tokenIn.transferFrom(msg.sender, address(this), amountIn);
            tokenOut.transfer(msg.sender, amountOut);
        } else {
            tokenOut = pair.token0;
            amountOut = getAmountOut(amountIn, balance1, balance0);
            require(amountOut > amountOutMin, "INSUFFICIENT_OUTPUT_AMOUNT");
            tokenIn.transferFrom(msg.sender, address(this), amountIn);
            tokenOut.transfer(msg.sender, amountOut);
        }

        pair.reserve0 = pair.token0.balanceOf(address(this));
        pair.reserve1 = pair.token1.balanceOf(address(this));

        swapHistories.push(
            SwapHistory({
                user: msg.sender,
                tokenPairId: tokenPairId,
                amountIn: amountIn,
                tokenIn: address(tokenIn),
                amountOut: amountOut,
                tokenOut: address(tokenOut),
                timestamp: block.timestamp
            })
        );

        emit Swap(
            msg.sender,
            amountIn,
            address(tokenIn),
            amountOut,
            address(tokenOut),
            tokenPairId,
            block.timestamp
        );
    }

    // 获取交易历史记录
    function getSwapHistory(
        uint index
    ) external view returns (SwapHistory memory) {
        return swapHistories[index];
    }

    // 获取用户的代币余额
    function getUserTokenBalance(
        address user,
        IERC20 token
    ) external view returns (uint256) {
        return token.balanceOf(user);
    }

    // 工具函数：取两个数的最小值
    function min(uint x, uint y) internal pure returns (uint z) {
        z = x < y ? x : y;
    }

    // 工具函数：计算平方根
    function sqrt(uint y) internal pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    // 设置swapCount
    function setSwapCount(uint _swapCount) external {
        swapCount = _swapCount;
    }

    // 计算交换输出量的函数，拆分交易
    function getAmountOut(
        uint amountIn,
        uint reserveIn,
        uint reserveOut
    ) public view returns (uint amountOut) {
        require(amountIn > 0, "INSUFFICIENT_AMOUNT");
        require(reserveIn > 0 && reserveOut > 0, "INSUFFICIENT_LIQUIDITY");

        uint amountInPerSwap = amountIn / swapCount;
        uint totalAmountOut = 0;

        for (uint i = 0; i < swapCount; i++) {
            uint amountOutPerSwap = (amountInPerSwap * reserveOut) /
                (reserveIn + amountInPerSwap);
            totalAmountOut += amountOutPerSwap;

            // 更新储备量，模拟每次拆分后的储备量
            reserveIn += amountInPerSwap;
            reserveOut -= amountOutPerSwap;
        }

        amountOut = totalAmountOut;
    }
}
