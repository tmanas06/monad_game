# 🎮 Monad Gaming DApp - A Monad-Powered Gaming Platform

Monad Gaming DApp is a fun, fast-paced gaming platform built on the Monad Blockchain, where **every interaction is an on-chain transaction**. Experience a variety of exciting games with the security and transparency of blockchain technology.

This game showcases the **high throughput and low-latency capabilities of Monad**, making it the perfect playground for on-chain gaming.

---

## 🚀 Why Monad?

We built Monad Gaming DApp on [Monad](https://monad.xyz) to leverage:

- ⚡ **10,000+ TPS** & **300M gas/sec**: Ultra-fast processing for real-time games  
- 🧠 **EVM Compatibility**: Seamless integration with existing EVM-based tooling  
- 🕐 **1s Block Time with Single-Slot Finality**: Game moves as fast as you do  
- 💸 **Gas Efficiency**: Minimal cost per interaction, even at scale  
- 📈 **Gas Spike Resistance**: No slowdowns during peak activity

On Monad, every tap, bubble pop, or bomb click is recorded immutably on-chain — no cheating, no rewinds, just pure skill and reflexes.

---

## 🕹 Gameplay

- Tap 🎈 **Bubbles** → Gain Points  
- Tap 💣 **Bombs** → Lose Points  
- Every tap = one transaction on Monad  
- Scores are public, transparent, and stored on-chain  
- Compete on a **global leaderboard** updated in real-time  

---

## 📦 Tech Stack

- **Frontend**: React + Tailwind 
- **Smart Contracts**: Solidity, deployed on Monad
- **Wallet Integration**: MetaMask / Monad-native wallets
- **Backend (optional)**: Indexer or event listener for leaderboards
- **Leaderboard**: On-chain stats + frontend display

---

## 🛠 Installation

```bash
git clone https://github.com/Nakshatra05/monad-gaming-dapp.git
cd bubble-tap
npm install
npm run dev
````

---

## 🧠 Smart Contract Highlights

* `tapBubble()`: +1 score and emits a Tap event
* `tapBomb()`: -1 score and emits a Bomb event
* `getScore(address player)`: View current score
* `getTopPlayers()`: Return global leaderboard (indexed)

Contracts are deployed on the Monad Testnet. 
---

## ✨ Upcoming Features

* Multiplayer Battle Mode: Send "bombs" to opponents on bubble clears
* NFT Badges: On-chain rewards for high scores
* Seasonal Tournaments & Prizes
* Mobile Optimization

---

## 🧑‍💻 Contributing

Have ideas to improve the game or the contracts? PRs and issues are welcome!
Please open an issue first to discuss your proposal.

---

## 📝 License

MIT License. Do whatever you want. Just don't tap the bombs. 😉

---

## 💬 Final Word

Monad Gaming DApp is not just a game — it's a showcase of what high-speed, low-latency **on-chain interactivity** can look like on Monad. Let's bring fun and frictionless gaming to the blockchain world.
