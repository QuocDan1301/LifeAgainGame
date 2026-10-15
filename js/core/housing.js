// Shared by story choices and the property shop. Legacy IDs remain readable.
export const HOME_TERMS = {
  'story-home': { price: 600_000_000, deposit: 120_000_000, years: 20, rate: 0.03 },
};

export function getHomeFinancing(id) {
  const homeId = id === 'story-small-home' ? 'story-home' : id;
  const terms = HOME_TERMS[homeId];
  if (!terms) return null;
  const principal = terms.price - terms.deposit;
  const total = Math.round(principal * (1 + terms.rate * terms.years));
  return { ...terms, id: homeId, principal, total, annualPayment: Math.ceil(total / terms.years) };
}

export function prepareHomePurchase(player, id, age, uid = `${id}-${age}`) {
  const terms = getHomeFinancing(id);
  if (!terms) throw new Error(`Unknown installment home: ${id}`);
  return {
    money: -terms.deposit,
    playerUpdates: {
      purchases: [...(player.purchases ?? []), { id: terms.id, uid, boughtAtAge: age, purchasePrice: terms.price }],
      homeLoans: [...(player.homeLoans ?? []), {
        id: uid, assetUid: uid, principal: terms.principal, outstanding: terms.total,
        annualPayment: terms.annualPayment, years: terms.years,
        startedAtAge: age, lastPaidAge: age, paymentsMade: 0,
      }],
    },
  };
}
