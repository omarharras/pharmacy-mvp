export function formatPiasters(pricePiasters: number) {
  return {
    amount: pricePiasters / 100,
    currency: 'EGP',
    formatted: `${(pricePiasters / 100).toFixed(2)} EGP`,
  };
}
