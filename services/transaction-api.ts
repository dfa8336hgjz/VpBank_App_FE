import {
  ConfirmTransactionRequest,
  ConfirmTransactionResponse,
  GetTransactionHistoryResponse,
  SubmitTransactionRequest,
  SubmitTransactionResponse
} from "../types/transaction-type";
import { BaseAPI } from "./base-api";

class TransactionAPI extends BaseAPI {
  constructor() {
    super("/transaction");
  }

  // Authentication endpoints
  async getTransactionHistory(): Promise<GetTransactionHistoryResponse> {
    return this.get("/transactions/history");
  }

  async submitTransaction(transactionData: SubmitTransactionRequest): Promise<SubmitTransactionResponse> {
    return this.post("/transactions/submit", transactionData);
  }

  async confirmTransaction(transactionData: ConfirmTransactionRequest): Promise<ConfirmTransactionResponse> {
    return this.post("/transactions/confirm", transactionData);
  }
}

export const transactionAPI = new TransactionAPI();
export default transactionAPI;