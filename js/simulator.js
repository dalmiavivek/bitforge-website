/**
 * BitForge — Discord Playground Simulator
 * Interactive realistic Discord embed engine with typing indicators and live mock transactions
 */

(function () {
  const container = document.getElementById('discord-messages-container');
  const inputEl = document.getElementById('discord-chat-input');
  const sendBtn = document.getElementById('discord-send-btn');
  const presetChips = document.querySelectorAll('.preset-chip');

  if (!container || !inputEl) return;

  const BOT_AVATAR = 'assets/img/green-avatar.png';
  const USER_AVATAR = 'https://cdn.discordapp.com/embed/avatars/0.png';

  // Sample data states
  let userBalances = {
    USDT: 485.50,
    SOL: 2.45,
    ETH: 0.125,
    BTC: 0.015,
    LTC: 3.20
  };

  const COMMAND_RESPONSES = {
    balance: () => ({
      title: 'Vault Balances — Overview',
      color: '#00e676',
      description: 'Real-time multi-chain custodial ledger balances. Tips inside Discord are zero-gas and instant.',
      fields: [
        { name: 'Tether (Polygon)', value: `\`${userBalances.USDT.toFixed(2)} USDT\` ($${userBalances.USDT.toFixed(2)})` },
        { name: 'Solana (SPL)', value: `\`${userBalances.SOL.toFixed(3)} SOL\` (~$465.50)` },
        { name: 'Ethereum (ERC-20)', value: `\`${userBalances.ETH.toFixed(4)} ETH\` (~$412.50)` },
        { name: 'Bitcoin (Native)', value: `\`${userBalances.BTC.toFixed(4)} BTC\` (~$1,020.00)` },
        { name: 'Litecoin (LTC)', value: `\`${userBalances.LTC.toFixed(2)} LTC\` (~$240.00)` }
      ],
      footer: 'BitForge Multi-Chain Engine • Zero Gas Off-Chain Ledger',
      buttons: ['Deposit', 'Withdraw', 'Refresh', 'History']
    }),

    tip: (args) => {
      const match = args.match(/@(\w+)\s+([\d\.]+)\s*(\w+)?/i);
      const recipient = match ? match[1] : 'Alex';
      const amount = match ? parseFloat(match[2]) : 25;
      const token = match && match[3] ? match[3].toUpperCase() : 'USDT';

      userBalances[token] = Math.max(0, (userBalances[token] || 100) - amount);

      return {
        title: 'Instant Social Tip Dispatched',
        color: '#00e676',
        description: `Successfully transferred **${amount} ${token}** to <span style="color:#00a8fc">@${recipient}</span> directly through off-chain ledger settlement.`,
        fields: [
          { name: 'Recipient', value: `@${recipient}` },
          { name: 'Transferred', value: `\`${amount} ${token}\`` },
          { name: 'Gas Fee', value: '`$0.00 (Zero Gas)`' },
          { name: 'Settlement Latency', value: '`< 42ms (Instant)`' },
          { name: 'Remaining Balance', value: `\`${userBalances[token].toFixed(2)} ${token}\`` },
          { name: 'Idempotency Key', value: '`bf_tip_98a7cf2e`' }
        ],
        footer: 'BitForge Social Tip • Non-custodial recipient credit',
        buttons: ['Send Another Tip', 'View Ledger']
      };
    },

    deposit: (args) => {
      const token = (args.split(' ')[1] || 'SOL').toUpperCase();
      const mockAddresses = {
        USDT: '0x71C...38A94 (Polygon PoS)',
        SOL: '9WzDXw...B5XyK (Solana SPL)',
        ETH: '0x71C...38A94 (Ethereum)',
        BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh (BTC SegWit)',
        LTC: 'LTC_LhU9eZ4uXk3a98m7QxP2bV5n8Z1k2L4p (LTC P2PKH)'
      };

      const addr = mockAddresses[token] || mockAddresses.SOL;

      return {
        title: `Private Deposit Vault — ${token}`,
        color: '#00e676',
        description: `Your permanent cryptographic deposit address for **${token}** has been generated via pure EC derivation and encrypted under Fernet AES-256.`,
        fields: [
          { name: 'Network', value: token === 'USDT' ? 'Polygon PoS (Auto-Sweep)' : `${token} Native Chain` },
          { name: 'Deposit Address', value: `\`${addr}\`` },
          { name: 'Min. Deposit', value: '`0.001 ' + token + '`' },
          { name: 'RPC Poller Scan Interval', value: '`Every 45 seconds`' },
          { name: 'Gas Sponsorship', value: '`Active (Vault Sponsoring)`' },
          { name: 'Auto-Sweep', value: '`Enabled to Master Vault`' }
        ],
        footer: 'BitForge Vault Security • AES-256 at Rest • Sent to Private DM',
        buttons: ['Copy Address', 'Scan QR Code', 'Deposit Guide']
      };
    },

    withdraw: (args) => {
      return {
        title: 'Withdrawal Broadcast — Pre-Flight Verified',
        color: '#00e676',
        description: 'Zero-loss withdrawal guarantee checked. Balance reserved only upon valid blockchain broadcast.',
        fields: [
          { name: 'Target Chain', value: 'Litecoin Network (LTC)' },
          { name: 'Amount', value: '`0.50 LTC`' },
          { name: 'Network Mining Fee', value: '`0.001 LTC`' },
          { name: 'Pre-flight Balance Check', value: '`PASS (Verified)`' },
          { name: 'Broadcast Tx Hash', value: '`7c59a8...3b210f`' },
          { name: 'Status', value: '`Confirmed (Block #274819)`' }
        ],
        footer: 'BitForge Zero-Loss Protection • Irreversible Broadcast',
        buttons: ['View Explorer', 'Save Receipt']
      };
    },

    rain: () => {
      // Trigger rain particle animation
      triggerRainAnimation();
      return {
        title: 'Community Crypto Rain Dropped!',
        color: '#00e676',
        description: 'Crypto rain initiated! **100 USDT** split equally among 5 active community members.',
        fields: [
          { name: 'Pool Size', value: '`100.00 USDT`' },
          { name: 'Lucky Recipients', value: '`5 Active Members`' },
          { name: 'Reward Per User', value: '`20.00 USDT`' },
          { name: 'Total Gas Spent', value: '`$0.00 (Off-Chain)`' }
        ],
        footer: 'BitForge Community Engine • Instant Off-Chain Distribution',
        buttons: ['Catch Next Rain', 'Drop More Rain']
      };
    },

    stats: () => ({
      title: 'BitForge Network Global Telemetry',
      color: '#00e676',
      description: 'Real-time operational status and architectural configuration.',
      fields: [
        { name: 'Daemon Status', value: '`100% OPERATIONAL`' },
        { name: '45s Deposit Poller', value: '`ACTIVE (Every 45s)`' },
        { name: 'Vault Encryption', value: '`Fernet AES-256 (CBC)`' },
        { name: 'Supported Chains', value: '`5 Multi-Chain Rails`' },
        { name: 'Tip Gas Cost', value: '`$0.00 (Zero Gas)`' },
        { name: 'Zero-Loss Engine', value: '`ENFORCED`' }
      ],
      footer: 'BitForge Telemetry • Verified System Architecture',
      buttons: ['Add BitForge', 'Documentation']
    })
  };

  function triggerRainAnimation() {
    const parent = document.querySelector('.discord-simulator-container');
    if (!parent) return;

    for (let i = 0; i < 25; i++) {
      const drop = document.createElement('div');
      drop.className = 'rain-particle';
      drop.innerText = Math.random() > 0.5 ? '⚡' : '$';
      drop.style.left = `${Math.random() * 90 + 5}%`;
      drop.style.top = '-20px';
      drop.style.animationDuration = `${Math.random() * 0.8 + 0.6}s`;
      drop.style.animationDelay = `${Math.random() * 0.3}s`;
      parent.appendChild(drop);

      setTimeout(() => drop.remove(), 1500);
    }
  }

  function appendUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'discord-message';
    msg.innerHTML = `
      <img src="${USER_AVATAR}" class="discord-avatar" alt="User">
      <div class="discord-message-content">
        <div class="discord-meta">
          <span class="discord-author">Web_Commander</span>
          <span class="discord-timestamp">Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div class="discord-text"><span class="discord-command-bubble">${escapeHtml(text)}</span></div>
      </div>
    `;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
  }

  function appendTypingIndicator() {
    const typing = document.createElement('div');
    typing.className = 'discord-message typing-indicator-msg';
    typing.id = 'active-typing-indicator';
    typing.innerHTML = `
      <img src="${BOT_AVATAR}" class="discord-avatar" alt="BitForge">
      <div class="discord-message-content">
        <div class="discord-meta">
          <span class="discord-author">BitForge</span>
          <span class="discord-bot-tag forge">BOT</span>
        </div>
        <div class="discord-text" style="color: #949ba4; font-style: italic;">
          BitForge is thinking<span class="typing-dots">...</span>
        </div>
      </div>
    `;
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;
  }

  function removeTypingIndicator() {
    const el = document.getElementById('active-typing-indicator');
    if (el) el.remove();
  }

  function appendBotEmbed(data) {
    removeTypingIndicator();

    const msg = document.createElement('div');
    msg.className = 'discord-message';

    let fieldsHtml = '';
    if (data.fields && data.fields.length) {
      fieldsHtml = `<div class="embed-fields-grid">
        ${data.fields.map(f => `
          <div class="embed-field">
            <span class="field-name">${f.name}</span>
            <span class="field-value">${f.value}</span>
          </div>
        `).join('')}
      </div>`;
    }

    let buttonsHtml = '';
    if (data.buttons && data.buttons.length) {
      buttonsHtml = `<div class="discord-button-row">
        ${data.buttons.map((b, i) => {
          const isInvite = (b === 'Join Discord' || b === 'Add BitForge');
          const action = isInvite ? `window.open('https://discord.com/oauth2/authorize?client_id=1562395424684244994&permissions=137439071328&integration_type=0&scope=bot+applications.commands', '_blank');` : '';
          return `<button class="discord-btn ${i === 0 ? 'success' : ''}" onclick="window.cyberAudio && window.cyberAudio.playClick(); ${action}">${b}</button>`;
        }).join('')}
      </div>`;
    }

    msg.innerHTML = `
      <img src="${BOT_AVATAR}" class="discord-avatar" alt="BitForge">
      <div class="discord-message-content">
        <div class="discord-meta">
          <span class="discord-author" style="color:#00e676">BitForge</span>
          <span class="discord-bot-tag forge" style="background:#00e676; color:#05140b;">BOT</span>
          <span class="discord-timestamp">Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div class="discord-embed">
          <div class="embed-author">
            <img src="${BOT_AVATAR}" class="embed-author-icon" alt="BitForge">
            <span>BitForge Multi-Chain Core</span>
          </div>
          <div class="embed-title">${data.title}</div>
          <div class="embed-description">${data.description}</div>
          ${fieldsHtml}
          <div class="embed-footer">
            <span>${data.footer}</span>
          </div>
        </div>
        ${buttonsHtml}
      </div>
    `;

    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;

    if (window.cyberAudio) {
      window.cyberAudio.playSuccess();
    }
  }

  function handleCommand(rawCmd) {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    appendUserMessage(trimmed);

    if (window.cyberAudio) {
      window.cyberAudio.playCommand();
    }

    appendTypingIndicator();

    setTimeout(() => {
      const lower = trimmed.toLowerCase();
      let handler = COMMAND_RESPONSES.balance;

      if (lower.includes('tip')) {
        handler = () => COMMAND_RESPONSES.tip(trimmed);
      } else if (lower.includes('deposit')) {
        handler = () => COMMAND_RESPONSES.deposit(trimmed);
      } else if (lower.includes('withdraw')) {
        handler = () => COMMAND_RESPONSES.withdraw(trimmed);
      } else if (lower.includes('rain') || lower.includes('drop')) {
        handler = COMMAND_RESPONSES.rain;
      } else if (lower.includes('stat') || lower.includes('info')) {
        handler = COMMAND_RESPONSES.stats;
      }

      appendBotEmbed(handler());
    }, 450);
  }

  // Handle preset clicks
  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      presetChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const cmd = chip.getAttribute('data-cmd') || chip.innerText.trim();
      handleCommand(cmd);
    });
  });

  // Handle enter key in input
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = inputEl.value;
      if (val.trim()) {
        inputEl.value = '';
        handleCommand(val);
      }
    }
  });

  sendBtn.addEventListener('click', () => {
    const val = inputEl.value;
    if (val.trim()) {
      inputEl.value = '';
      handleCommand(val);
    }
  });

  function escapeHtml(string) {
    const div = document.createElement('div');
    div.innerText = string;
    return div.innerHTML;
  }
})();
