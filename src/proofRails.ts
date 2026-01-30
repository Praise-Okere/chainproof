/**
 * ProofRails ISO 20022 Record Generation
 * Generates PAIN, PACS, CAMT, REMT records for compliance
 */

export interface ProofRailsRecord {
  type: 'PAIN' | 'PACS' | 'CAMT' | 'REMT';
  version: string;
  createdAt: string;
  messageId: string;
  content: Record<string, unknown>;
}

export interface PaymentProof {
  proofId: string;
  txHash: string;
  amount: string;
  currency: string;
  sender: string;
  recipient: string;
  timestamp: string;
  flareAnchor: string;
  recordHash: string;
  status: string;
}

/**
 * Generate PAIN (Payment Initiation) record
 */
export const generatePAIN = (proof: PaymentProof): ProofRailsRecord => {
  return {
    type: 'PAIN',
    version: '008.003.02',
    createdAt: new Date().toISOString(),
    messageId: `PAIN-${proof.proofId}`,
    content: {
      messageHeader: {
        messageId: `PAIN-${proof.proofId}`,
        creationDateTime: proof.timestamp,
        instructionId: `INSTR-${proof.proofId}`,
      },
      payment: {
        paymentInformationId: `PAYINF-${proof.proofId}`,
        paymentMethod: 'ESCT', // Electronic payment
        paymentTypeCode: 'STD', // Standard
        instructionPriority: 'NORM',
        chargeBearer: 'SHAR',
        debtor: {
          name: 'Payment Initiator',
          identification: proof.sender,
        },
        debtorAccount: {
          identification: proof.sender,
          currency: proof.currency,
        },
        creditor: {
          name: 'Payment Recipient',
          identification: proof.recipient,
        },
        creditorAccount: {
          identification: proof.recipient,
          currency: proof.currency,
        },
        transactionAmount: proof.amount,
        currency: proof.currency,
        transactionHash: proof.txHash,
        flareAnchor: proof.flareAnchor,
        recordHash: proof.recordHash,
      },
      supplementaryData: {
        blockchain: {
          network: 'Flare Network',
          transactionHash: proof.txHash,
          blockAnchor: proof.flareAnchor,
          verificationStatus: proof.status,
        },
      },
    },
  };
};

/**
 * Generate PACS (Payment Status) record
 */
export const generatePACS = (proof: PaymentProof): ProofRailsRecord => {
  return {
    type: 'PACS',
    version: '008.003.02',
    createdAt: new Date().toISOString(),
    messageId: `PACS-${proof.proofId}`,
    content: {
      messageHeader: {
        messageId: `PACS-${proof.proofId}`,
        creationDateTime: new Date().toISOString(),
        originalMessageId: `PAIN-${proof.proofId}`,
      },
      transactionStatusReport: {
        reportId: `REPORT-${proof.proofId}`,
        origMessageReference: `PAIN-${proof.proofId}`,
        creationDateTime: proof.timestamp,
        reportingEntity: 'ChainProof',
        transactionStatuses: [
          {
            originalTransactionId: proof.txHash,
            transactionStatus: proof.status.toUpperCase(),
            statusCode: proof.status === 'verified' ? 'ACCC' : 'ACCP', // Accepted Clearing Channel / Accepted Customer Profile
            statusReasonCode: 'COMC', // Compliance
            statusReasonInformation: 'Payment verified on Flare Network',
            lastUpdateDateTime: new Date().toISOString(),
            flareVerification: {
              blockchainNetwork: 'Flare Network',
              transactionHash: proof.txHash,
              blockAnchor: proof.flareAnchor,
              verificationTimestamp: proof.timestamp,
            },
          },
        ],
      },
    },
  };
};

/**
 * Generate CAMT (Cash Management) record
 */
export const generateCAMT = (proof: PaymentProof): ProofRailsRecord => {
  return {
    type: 'CAMT',
    version: '053.002.02',
    createdAt: new Date().toISOString(),
    messageId: `CAMT-${proof.proofId}`,
    content: {
      messageHeader: {
        messageId: `CAMT-${proof.proofId}`,
        creationDateTime: new Date().toISOString(),
      },
      bankToCustomerStatement: {
        statementId: `STMT-${proof.proofId}`,
        statementFrequency: 'ONET', // One Time
        fromDate: proof.timestamp,
        toDate: new Date().toISOString(),
        account: {
          identification: proof.sender,
          currency: proof.currency,
        },
        transaction: {
          entryDate: proof.timestamp,
          valueDate: proof.timestamp,
          amount: proof.amount,
          currency: proof.currency,
          transactionType: 'DEBIT',
          description: `Payment to ${proof.recipient.substring(0, 10)}...`,
          counterparty: proof.recipient,
          transactionId: proof.txHash,
          blockchainReference: {
            network: 'Flare Network',
            anchor: proof.flareAnchor,
            recordHash: proof.recordHash,
          },
        },
        balance: {
          date: new Date().toISOString(),
          amount: proof.amount,
          currency: proof.currency,
          balanceType: 'XPCD', // Expected Credit
        },
      },
    },
  };
};

/**
 * Generate REMT (Remittance Advice) record
 */
export const generateREMT = (proof: PaymentProof): ProofRailsRecord => {
  return {
    type: 'REMT',
    version: '002.004.01',
    createdAt: new Date().toISOString(),
    messageId: `REMT-${proof.proofId}`,
    content: {
      messageHeader: {
        messageId: `REMT-${proof.proofId}`,
        creationDateTime: new Date().toISOString(),
      },
      remittanceAdvice: {
        remittanceId: `REM-${proof.proofId}`,
        relatedPaymentInstructionId: `PAIN-${proof.proofId}`,
        remitter: {
          name: 'Payment Sender',
          identification: proof.sender,
        },
        payee: {
          name: 'Payment Recipient',
          identification: proof.recipient,
        },
        remittanceInformation: {
          structured: {
            documentLineIdentification: `DOCLINE-${proof.proofId}`,
            documentNumber: proof.txHash,
            documentDate: proof.timestamp,
            documentType: 'PROOF',
            documentStatus: proof.status.toUpperCase(),
          },
          unstructured: [
            `ChainProof Payment Verification`,
            `Transaction Hash: ${proof.txHash}`,
            `Amount: ${proof.amount} ${proof.currency}`,
            `Flare Network Anchor: ${proof.flareAnchor}`,
            `Record Hash: ${proof.recordHash}`,
            `Verification Status: ${proof.status}`,
            `Generated: ${new Date().toLocaleString()}`,
          ],
        },
        invoices: [
          {
            invoiceNumber: proof.proofId,
            invoiceDate: proof.timestamp,
            invoiceAmount: proof.amount,
            invoiceCurrency: proof.currency,
            invoiceStatus: 'PAID',
            paymentReference: proof.txHash,
            blockchainReference: {
              network: 'Flare Network',
              transactionHash: proof.txHash,
              blockAnchor: proof.flareAnchor,
              verificationStatus: proof.status,
            },
          },
        ],
      },
    },
  };
};

/**
 * Generate all ISO-aligned records for a proof
 */
export const generateAllProofRailsRecords = (
  proof: PaymentProof
): Record<string, ProofRailsRecord> => {
  return {
    PAIN: generatePAIN(proof),
    PACS: generatePACS(proof),
    CAMT: generateCAMT(proof),
    REMT: generateREMT(proof),
  };
};

/**
 * Validate ProofRails record structure
 */
export const validateProofRailsRecord = (record: ProofRailsRecord): boolean => {
  return (
    ['PAIN', 'PACS', 'CAMT', 'REMT'].includes(record.type) &&
    !!record.version &&
    !!record.createdAt &&
    !!record.messageId &&
    !!record.content
  );
};
