/**
 * BitForge — Main Application & Cyber Controller
 * Custom cursor, preloader, scroll progress, CoinGecko live prices, kinetic counters, FAQ, clipboard
 */

document.addEventListener('DOMContentLoaded', () => {
  // ═══════════════════════════════════════════
  // 1. PRELOADER ENGINE
  // ═══════════════════════════════════════════
  const preloader = document.getElementById('preloader');
  const preBar = document.getElementById('pre-bar');
  const preTxt = document.getElementById('pre-txt');

  if (preloader && preBar) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 18) + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        preBar.style.width = '100%';
        if (preTxt) preTxt.innerText = 'INITIALIZATION COMPLETE // SYSTEM READY';

        setTimeout(() => {
          preloader.classList.add('done');
          // Trigger entry sounds if enabled
          if (window.cyberAudio && window.cyberAudio.enabled) {
            window.cyberAudio.playSuccess();
          }
        }, 350);
      } else {
        preBar.style.width = `${progress}%`;
        if (preTxt) {
          if (progress > 30 && progress < 70) {
            preTxt.innerText = 'DERIVING CRYPTOGRAPHIC SECP256K1 & ED25519 RAILS...';
          } else if (progress >= 70) {
            preTxt.innerText = 'SYNCHRONIZING 45S ON-CHAIN DAEMON...';
          }
        }
      }
    }, 60);
  }

  // ═══════════════════════════════════════════
  // 2. CUSTOM GPU CURSOR
  // ═══════════════════════════════════════════
  const curD = document.getElementById('cur-d');
  const curR = document.getElementById('cur-r');

  if (curD && curR && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      curD.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });

    function animateCursorRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      curR.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      requestAnimationFrame(animateCursorRing);
    }
    requestAnimationFrame(animateCursorRing);

    // Hover state on interactive elements
    const interactiveEls = document.querySelectorAll('a, button, input, .preset-chip, .chain-card, .cmd-card, .faq-item');
    interactiveEls.forEach((el) => {
      el.addEventListener('mouseenter', () => curR.classList.add('hovering'));
      el.addEventListener('mouseleave', () => curR.classList.remove('hovering'));
    });
  }

  // ═══════════════════════════════════════════
  // 3. TOP SCROLL PROGRESS BAR
  // ═══════════════════════════════════════════
  const scrollProg = document.getElementById('scroll-prog');
  window.addEventListener('scroll', () => {
    if (scrollProg) {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (scrollTop / docHeight) * 100;
      scrollProg.style.width = `${Math.min(100, Math.max(0, scrolled))}%`;
    }
  }, { passive: true });

  // ═══════════════════════════════════════════
  // 4. REAL-TIME COINGECKO LIVE MARKET PRICES
  // ═══════════════════════════════════════════
  async function fetchLiveCryptoPrices() {
    try {
      const url = 'https://api.coingecko.com/api/v3/simple/price?ids=tether,solana,binancecoin,ethereum,bitcoin,litecoin&vs_currencies=usd&include_24hr_change=true';
      const res = await fetch(url);
      if (!res.ok) throw new Error('CoinGecko rate limited or unavailable');
      const data = await res.json();

      const updateCard = (tickerId, price, change) => {
        const priceEl = document.getElementById(`price-${tickerId}`);
        const changeEl = document.getElementById(`change-${tickerId}`);
        if (priceEl && price !== undefined) {
          priceEl.innerText = `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
        if (changeEl && change !== undefined) {
          const isUp = change >= 0;
          changeEl.innerText = `${isUp ? '▲ +' : '▼ '}${change.toFixed(2)}%`;
          changeEl.style.color = isUp ? 'var(--neon-green)' : 'var(--neon-crimson)';
        }
      };

      if (data.tether) updateCard('usdt', data.tether.usd, data.tether.usd_24h_change);
      if (data.solana) updateCard('sol', data.solana.usd, data.solana.usd_24h_change);
      if (data.binancecoin) updateCard('bnb', data.binancecoin.usd, data.binancecoin.usd_24h_change);
      if (data.ethereum) updateCard('eth', data.ethereum.usd, data.ethereum.usd_24h_change);
      if (data.bitcoin) updateCard('btc', data.bitcoin.usd, data.bitcoin.usd_24h_change);
      if (data.litecoin) updateCard('ltc', data.litecoin.usd, data.litecoin.usd_24h_change);
    } catch (e) {
      // Graceful offline simulated rate fallback
      console.log('Using local crypto telemetry');
    }
  }

  fetchLiveCryptoPrices();
  setInterval(fetchLiveCryptoPrices, 60000);

  // ═══════════════════════════════════════════
  // 5. KINETIC NUMBER COUNTER ANIMATIONS
  // ═══════════════════════════════════════════
  const counterEls = document.querySelectorAll('[data-target]');
  let countersAnimated = false;

  function runCounters() {
    if (countersAnimated) return;
    counterEls.forEach((counter) => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
      let count = 0;
      const duration = 1600;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(1, elapsed / duration);
        // Easing out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = count + (target - count) * ease;
        counter.innerText = `${prefix}${current.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.innerText = `${prefix}${target.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;
        }
      }
      requestAnimationFrame(update);
    });
    countersAnimated = true;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        runCounters();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('telemetry-stats');
  if (statsSection) observer.observe(statsSection);

  // ═══════════════════════════════════════════
  // 6. AUDIO & CRT TOGGLE CONTROLS
  // ═══════════════════════════════════════════
  const audioBtn = document.getElementById('audio-toggle-btn');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const isEnabled = window.cyberAudio.toggle();
      audioBtn.classList.toggle('active', isEnabled);
      const icon = audioBtn.querySelector('.audio-icon');
      if (icon) icon.textContent = isEnabled ? '🔊' : '🔇';
    });
  }

  const crtBtn = document.getElementById('crt-toggle-btn');
  if (crtBtn) {
    crtBtn.addEventListener('click', () => {
      document.body.classList.toggle('crt-active');
      crtBtn.classList.toggle('active', document.body.classList.contains('crt-active'));
      if (window.cyberAudio) window.cyberAudio.playClick();
    });
  }

  // ═══════════════════════════════════════════
  // 7. FAQ ACCORDION
  // ═══════════════════════════════════════════
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-question-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach((f) => f.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
          if (window.cyberAudio) window.cyberAudio.playClick();
        }
      });
    }
  });

  // ═══════════════════════════════════════════
  // 8. COMMAND TABS & SEARCH
  // ═══════════════════════════════════════════
  const cmdTabs = document.querySelectorAll('.cmd-tab-btn');
  const cmdCards = document.querySelectorAll('.cmd-card');
  const searchInput = document.getElementById('cmd-search-input');

  function filterCommands() {
    const activeTab = document.querySelector('.cmd-tab-btn.active');
    const category = activeTab ? activeTab.getAttribute('data-cat') : 'all';
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    cmdCards.forEach((card) => {
      const cardCat = card.getAttribute('data-cat');
      const text = card.textContent.toLowerCase();
      const matchesCat = (category === 'all' || cardCat === category);
      const matchesSearch = (!query || text.includes(query));

      if (matchesCat && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  cmdTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      cmdTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      if (window.cyberAudio) window.cyberAudio.playClick();
      filterCommands();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterCommands);
  }

  // ═══════════════════════════════════════════
  // 9. COPY TO CLIPBOARD
  // ═══════════════════════════════════════════
  const copyButtons = document.querySelectorAll('.copy-cmd-btn');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-copy');
      if (cmd) {
        navigator.clipboard.writeText(cmd).then(() => {
          const originalText = btn.innerHTML;
          btn.innerHTML = '<span>✓ Copied</span>';
          btn.style.borderColor = 'var(--neon-green)';
          btn.style.color = 'var(--neon-green)';

          if (window.cyberAudio) window.cyberAudio.playSuccess();

          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.borderColor = '';
            btn.style.color = '';
          }, 1400);
        });
      }
    });
  });

  // ═══════════════════════════════════════════
  // 10. MOBILE MENU TOGGLE
  // ═══════════════════════════════════════════
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });
  }
});
