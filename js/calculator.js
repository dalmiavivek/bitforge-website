/**
 * BitForge — Gas Savings & Tip ROI Calculator
 * Computes live blockchain gas saved by utilizing BitForge off-chain tipping
 */

(function () {
  const tipsSlider = document.getElementById('tips-slider');
  const amountSlider = document.getElementById('amount-slider');
  const tipsDisplay = document.getElementById('tips-count-display');
  const amountDisplay = document.getElementById('tip-amount-display');

  const savingsTotalEl = document.getElementById('calc-total-savings');
  const txSpeedEl = document.getElementById('calc-tx-speed');
  const onchainCostEl = document.getElementById('calc-onchain-cost');
  const membersBenefitedEl = document.getElementById('calc-members-benefited');

  if (!tipsSlider || !amountSlider) return;

  // Average gas cost per on-chain transfer across typical weighted mix:
  // EVM / USDT Polygon ($0.03), Solana ($0.005), ETH ($2.50)
  // Blended average on-chain fee for micro-transfers: ~$0.45
  const BLENDED_ONCHAIN_GAS_USD = 0.45;

  function updateCalculator() {
    const tipsPerMonth = parseInt(tipsSlider.value, 10);
    const avgTipUsd = parseFloat(amountSlider.value);

    tipsDisplay.innerText = `${tipsPerMonth.toLocaleString()} tips / mo`;
    amountDisplay.innerText = `$${avgTipUsd.toFixed(2)}`;

    // Calculations
    const gasSaved = tipsPerMonth * BLENDED_ONCHAIN_GAS_USD;
    const estMembers = Math.round(tipsPerMonth * 0.42);

    savingsTotalEl.innerText = `$${Math.round(gasSaved).toLocaleString()}`;
    if (onchainCostEl) {
      onchainCostEl.innerText = `$${Math.round(gasSaved).toLocaleString()}`;
    }
    if (membersBenefitedEl) {
      membersBenefitedEl.innerText = `~${estMembers.toLocaleString()}`;
    }

    if (window.cyberAudio && Math.random() > 0.8) {
      window.cyberAudio.playClick();
    }
  }

  tipsSlider.addEventListener('input', updateCalculator);
  amountSlider.addEventListener('input', updateCalculator);

  updateCalculator();
})();
