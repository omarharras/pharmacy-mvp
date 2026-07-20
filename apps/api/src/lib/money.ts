export function formatPiasters(pricePiasters: number) {
  const amount = pricePiasters / 100;
  const formattedAmount = Number.isInteger(amount)
    ? amount.toString()
    : amount.toFixed(2).replace(/0$/, '');

  return {
    amount,
    currency: 'EGP',
    formatted: `${formattedAmount} EGP`,
  };
}
