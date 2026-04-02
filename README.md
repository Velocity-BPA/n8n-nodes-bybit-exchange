# n8n-nodes-bybit-exchange

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides comprehensive integration with Bybit Exchange, one of the world's leading cryptocurrency derivatives trading platforms. It includes 6 core resources (Market, Trading, Position, Account, Asset, User) with full support for spot trading, derivatives, options, and account management operations.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Bybit API](https://img.shields.io/badge/Bybit-API%20v5-orange)
![Crypto Trading](https://img.shields.io/badge/Crypto-Trading-gold)
![Real Time](https://img.shields.io/badge/Real%20Time-Data-green)

## Features

- **Complete Market Data** - Access real-time and historical price data, orderbook, klines, and trading statistics
- **Advanced Trading Operations** - Execute spot, futures, and options trades with full order management capabilities
- **Position Management** - Monitor and manage open positions, leverage, and risk parameters across all trading categories
- **Account Operations** - Comprehensive account information, balances, transaction history, and settings management
- **Asset Management** - Handle deposits, withdrawals, transfers, and asset conversion operations
- **User Management** - Access user profile, API key management, and account security settings
- **Real-time Updates** - WebSocket support for live market data and account updates
- **Multi-category Support** - Full support for spot, linear, inverse, and options trading categories

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-bybit-exchange`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-bybit-exchange
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-bybit-exchange.git
cd n8n-nodes-bybit-exchange
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-bybit-exchange
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Bybit API key | Yes |
| API Secret | Your Bybit API secret | Yes |
| Environment | Trading environment (mainnet/testnet) | Yes |
| Passphrase | API key passphrase (if configured) | No |

## Resources & Operations

### 1. Market

| Operation | Description |
|-----------|-------------|
| Get Ticker | Retrieve 24hr ticker statistics for instruments |
| Get Orderbook | Get current orderbook data with bid/ask levels |
| Get Klines | Fetch historical candlestick/OHLCV data |
| Get Recent Trades | Get recent public trade executions |
| Get Instruments Info | Retrieve trading rules and instrument specifications |
| Get Server Time | Get current Bybit server timestamp |
| Get Risk Limit | Query risk limit information for derivatives |

### 2. Trading

| Operation | Description |
|-----------|-------------|
| Place Order | Submit new spot, futures, or options orders |
| Cancel Order | Cancel existing pending orders |
| Cancel All Orders | Cancel all pending orders for symbol/category |
| Modify Order | Update quantity, price, or other order parameters |
| Get Order History | Retrieve historical order data |
| Get Open Orders | Query current pending orders |
| Get Order Details | Get detailed information for specific orders |
| Batch Operations | Execute multiple trading operations in single request |

### 3. Position

| Operation | Description |
|-----------|-------------|
| Get Positions | Retrieve current open positions |
| Set Leverage | Adjust leverage for trading pairs |
| Switch Position Mode | Toggle between hedge/one-way position mode |
| Set Trading Stop | Configure stop-loss and take-profit levels |
| Set Risk Limit | Adjust position risk limits |
| Get Execution History | Query trade execution records |
| Get Closed PnL | Retrieve realized profit/loss history |

### 4. Account

| Operation | Description |
|-----------|-------------|
| Get Account Info | Retrieve account type and basic information |
| Get Wallet Balance | Query wallet balances across all account types |
| Get Transaction Log | Access detailed transaction history |
| Get Borrow History | Query margin borrowing/repayment records |
| Set Margin Mode | Switch between cross/isolated margin modes |
| Get Fee Rates | Retrieve current trading fee rates |
| Get Account Ratio | Query account health metrics and ratios |

### 5. Asset

| Operation | Description |
|-----------|-------------|
| Get Coin Info | Retrieve supported coin information |
| Get Deposit Address | Generate or query deposit addresses |
| Get Deposit Records | Access deposit transaction history |
| Withdraw | Submit withdrawal requests |
| Get Withdrawal Records | Query withdrawal transaction history |
| Internal Transfer | Transfer assets between account types |
| Get Transfer History | Retrieve internal transfer records |
| Get Exchange History | Query asset conversion records |

### 6. User

| Operation | Description |
|-----------|-------------|
| Get API Key Info | Query API key permissions and restrictions |
| Get User Info | Retrieve user profile and verification status |
| Get Announcement | Access platform announcements and updates |
| Get VIP Level | Query current VIP tier and benefits |
| Get Sub Users | Manage sub-account information (master accounts) |
| Create Sub API | Generate API keys for sub-accounts |
| Delete Sub API | Remove sub-account API keys |

## Usage Examples

```javascript
// Get real-time ticker data for BTCUSDT
{
  "resource": "market",
  "operation": "getTicker",
  "category": "spot",
  "symbol": "BTCUSDT"
}
```

```javascript
// Place a limit buy order
{
  "resource": "trading",
  "operation": "placeOrder",
  "category": "spot",
  "symbol": "BTCUSDT",
  "side": "Buy",
  "orderType": "Limit",
  "qty": "0.01",
  "price": "45000"
}
```

```javascript
// Check current wallet balances
{
  "resource": "account",
  "operation": "getWalletBalance",
  "accountType": "UNIFIED"
}
```

```javascript
// Get current open positions
{
  "resource": "position",
  "operation": "getPositions",
  "category": "linear",
  "symbol": "BTCUSDT"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 10001 | Invalid API key | Verify API credentials in node configuration |
| 10003 | API key expired | Generate new API key in Bybit account settings |
| 10004 | Invalid signature | Check API secret and ensure system time synchronization |
| 110001 | Order price out of range | Adjust order price within allowed trading range |
| 110017 | Insufficient balance | Ensure adequate balance for trading operations |
| 110025 | Order quantity too small | Increase order size to meet minimum requirements |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-bybit-exchange/issues)
- **Bybit API Documentation**: [Bybit API Docs](https://bybit-exchange.github.io/docs/)
- **Developer Community**: [Bybit API Telegram](https://t.me/Bybitapi)