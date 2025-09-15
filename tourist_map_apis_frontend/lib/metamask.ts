// MetaMask wallet integration utilities
declare global {
  interface Window {
    ethereum?: any
  }
}

export interface WalletState {
  isConnected: boolean
  account: string | null
  chainId: string | null
  balance: string | null
}

export class MetaMaskService {
  private static instance: MetaMaskService

  private constructor() {}

  public static getInstance(): MetaMaskService {
    if (!MetaMaskService.instance) {
      MetaMaskService.instance = new MetaMaskService()
    }
    return MetaMaskService.instance
  }

  async isMetaMaskInstalled(): Promise<boolean> {
    return typeof window !== "undefined" && typeof window.ethereum !== "undefined"
  }

  async connectWallet(): Promise<WalletState> {
    if (!(await this.isMetaMaskInstalled())) {
      throw new Error("MetaMask is not installed")
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      })

      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      })

      return {
        isConnected: true,
        account: accounts[0],
        chainId,
        balance: this.formatBalance(balance),
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error)
      throw error
    }
  }

  async disconnectWallet(): Promise<void> {
    // MetaMask doesn't have a disconnect method, but we can clear local state
    if (typeof window !== "undefined") {
      localStorage.removeItem("wallet_connected")
    }
  }

  async getWalletState(): Promise<WalletState> {
    if (!(await this.isMetaMaskInstalled())) {
      return {
        isConnected: false,
        account: null,
        chainId: null,
        balance: null,
      }
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      })

      if (accounts.length === 0) {
        return {
          isConnected: false,
          account: null,
          chainId: null,
          balance: null,
        }
      }

      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      })

      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      })

      return {
        isConnected: true,
        account: accounts[0],
        chainId,
        balance: this.formatBalance(balance),
      }
    } catch (error) {
      console.error("Error getting wallet state:", error)
      return {
        isConnected: false,
        account: null,
        chainId: null,
        balance: null,
      }
    }
  }

  async switchToPolygon(): Promise<void> {
    if (!(await this.isMetaMaskInstalled())) {
      throw new Error("MetaMask is not installed")
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x89" }], // Polygon Mainnet
      })
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x89",
                chainName: "Polygon Mainnet",
                nativeCurrency: {
                  name: "MATIC",
                  symbol: "MATIC",
                  decimals: 18,
                },
                rpcUrls: ["https://polygon-rpc.com/"],
                blockExplorerUrls: ["https://polygonscan.com/"],
              },
            ],
          })
        } catch (addError) {
          console.error("Error adding Polygon network:", addError)
          throw addError
        }
      } else {
        console.error("Error switching to Polygon:", switchError)
        throw switchError
      }
    }
  }

  async signMessage(message: string): Promise<string> {
    if (!(await this.isMetaMaskInstalled())) {
      throw new Error("MetaMask is not installed")
    }

    const walletState = await this.getWalletState()
    if (!walletState.isConnected || !walletState.account) {
      throw new Error("Wallet not connected")
    }

    try {
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, walletState.account],
      })

      return signature
    } catch (error) {
      console.error("Error signing message:", error)
      throw error
    }
  }

  async sendTransaction(to: string, value: string, data?: string): Promise<string> {
    if (!(await this.isMetaMaskInstalled())) {
      throw new Error("MetaMask is not installed")
    }

    const walletState = await this.getWalletState()
    if (!walletState.isConnected || !walletState.account) {
      throw new Error("Wallet not connected")
    }

    try {
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: walletState.account,
            to,
            value: this.toHex(value),
            data: data || "0x",
          },
        ],
      })

      return txHash
    } catch (error) {
      console.error("Error sending transaction:", error)
      throw error
    }
  }

  private formatBalance(balance: string): string {
    const balanceInEth = Number.parseInt(balance, 16) / Math.pow(10, 18)
    return balanceInEth.toFixed(4)
  }

  private toHex(value: string): string {
    return "0x" + Number.parseInt(value).toString(16)
  }

  onAccountsChanged(callback: (accounts: string[]) => void): void {
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", callback)
    }
  }

  onChainChanged(callback: (chainId: string) => void): void {
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("chainChanged", callback)
    }
  }

  removeAllListeners(): void {
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.removeAllListeners("accountsChanged")
      window.ethereum.removeAllListeners("chainChanged")
    }
  }
}

export const metaMaskService = MetaMaskService.getInstance()
