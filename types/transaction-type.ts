export interface GetTransactionHistoryResponse {
  code: number;
  result: Transaction[];
}

export interface Transaction {
  id: string;
  senderProfileId: string;
  receiverProfileId: string;
  receiverName: string | null;
  transactionDirection: 'SENT' | 'RECEIVED';
  amount: number;
  content: string;
  senderBalanceBefore: number;
  senderBalanceAfter: number;
  receiverBalanceBefore: number | null;
  receiverBalanceAfter: number | null;
  status: 'CONFIRMED' | 'DRAFT' | 'CANCELLED' | 'FAILED';
  type: 'TRANSFER';
  suggestedJarType: 'EDUCATION' | 'INVESTMENT' | 'NECESSITIES' | 'SAVINGS' | 'GIVING' | 'ENTERTAINMENT';
  actualJarType: 'EDUCATION' | 'INVESTMENT' | 'NECESSITIES' | 'SAVINGS' | 'GIVING' | 'ENTERTAINMENT' | null;
  createdAt: string;
  confirmedAt: string | null;
  updatedAt: string;
  transactionRef: string;
}

export interface SubmitTransactionRequest {
  receiverProfileId: string;
  amount: number;
  content: string;
}

export interface SubmitTransactionResponse {
  code: number;
  result: Transaction;
}

export interface ConfirmTransactionRequest {
  transactionId: string;
  actualJarType: string;
}

export interface ConfirmTransactionResponse {
  code: number;
  result: Transaction;
}