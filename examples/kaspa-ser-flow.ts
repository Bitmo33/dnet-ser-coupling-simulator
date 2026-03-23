/**
 * kaspa-ser-flow.ts
 *
 * Illustrative reference example showing how the
 * SER (Settlement–Exchange–Record) coupling model
 * may be composed with Kaspa as one possible settlement layer.
 *
 * This file is provided for conceptual and explanatory purposes.
 * It does not represent production infrastructure or a full Kaspa integration.
 */

type ISO8601 = string;

interface KaspaSettlementContext {
  txId: string;
  kaspaSettlementTxId: string;
  fromAddress: string;
  toAddress: string;
  assetSold: "KAS";
  amountSold: number;
  settlementTimestamp: ISO8601;
}

interface ExchangeResult {
  exchangeId: string;
  assetBought: string;
  amountBought: number;
  exchangeRate: number;
  exchangeTimestamp: ISO8601;
}

interface RecordAnchor {
  recordId: string;
  txId: string;
  settlementReference: string;
  exchangeReference: string;
  assetSold: string;
  assetBought: string;
  amountSold: number;
  amountBought: number;
  acquisitionValue: number;
  disposalValue: number;
  capitalGain: number;
  anchorChain: string;
  anchorTimestamp: ISO8601;
}

interface KaspaSerFlowResult {
  settlement: KaspaSettlementContext;
  exchange: ExchangeResult;
  record: RecordAnchor;
}

function now(): ISO8601 {
  return new Date().toISOString();
}

function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

/**
 * Settlement (S)
 * Creates a Kaspa-based settlement reference.
 *
 * In a real environment, this stage would typically be backed by
 * wallet logic, transaction submission, and confirmation handling.
 */
function createKaspaSettlement(
  txId: string,
  fromAddress: string,
  toAddress: string,
  amountSold: number
): KaspaSettlementContext {
  return {
    txId,
    kaspaSettlementTxId: generateId("KAS-TX"),
    fromAddress,
    toAddress,
    assetSold: "KAS",
    amountSold,
    settlementTimestamp: now()
  };
}

/**
 * Exchange (E)
 * Resolves an exchanged output asset using the settlement context.
 *
 * In this simplified example, the exchange rate is fixed.
 * In practice, a rate source and timestamp provenance would be required.
 */
function resolveKaspaExchange(
  settlement: KaspaSettlementContext,
  assetBought: string
): ExchangeResult {
  const exchangeRate = 1.23;
  const amountBought = settlement.amountSold * exchangeRate;

  return {
    exchangeId: generateId("EX"),
    assetBought,
    amountBought,
    exchangeRate,
    exchangeTimestamp: now()
  };
}

/**
 * Record (R)
 * Generates a coupled record and models a record anchor associated
 * with the transaction lifecycle.
 *
 * In a practical deployment, this could correspond to an internal record,
 * a compliance-oriented log, or a chain-anchored reference.
 */
function generateKaspaRecord(
  settlement: KaspaSettlementContext,
  exchange: ExchangeResult
): RecordAnchor {
  const acquisitionValue = settlement.amountSold;
  const disposalValue = exchange.amountBought;
  const capitalGain = disposalValue - acquisitionValue;

  return {
    recordId: generateId("REC"),
    txId: settlement.txId,
    settlementReference: settlement.kaspaSettlementTxId,
    exchangeReference: exchange.exchangeId,
    assetSold: settlement.assetSold,
    assetBought: exchange.assetBought,
    amountSold: settlement.amountSold,
    amountBought: exchange.amountBought,
    acquisitionValue,
    disposalValue,
    capitalGain,
    anchorChain: "Kaspa",
    anchorTimestamp: now()
  };
}

/**
 * SER Flow using Kaspa as one possible settlement layer
 */
export function runKaspaSerFlow(
  fromAddress: string,
  toAddress: string,
  amountSold: number,
  assetBought: string
): KaspaSerFlowResult {
  const txId = generateId("TX");

  const settlement = createKaspaSettlement(txId, fromAddress, toAddress, amountSold);
  const exchange = resolveKaspaExchange(settlement, assetBought);
  const record = generateKaspaRecord(settlement, exchange);

  return {
    settlement,
    exchange,
    record
  };
}

/**
 * Example usage
 */
const example = runKaspaSerFlow(
  "kaspa:sender-address-example",
  "kaspa:merchant-address-example",
  1000,
  "JPY_STABLE_BALANCE"
);

console.log("Kaspa SER Flow Example");
console.log(JSON.stringify(example, null, 2));
