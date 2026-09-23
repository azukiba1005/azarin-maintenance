/**
 * azarin.me 工事中案内サイト メインスクリプト
 */

(function () {
  'use strict';

  // SVG アイコン定義マップ
  const SVG_ICONS = {
    youtube: `<svg viewBox="0 0 24 24"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.04 0 12 0 12s0 3.96.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.96 24 12 24 12s0-3.96-.5-5.81zM9.75 15.5v-7l6.5 3.5-6.5 3.5z"/></svg>`,
    x: `<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>`,
    note: `<svg viewBox="0 0 20 22"><path d="M4.87829 1.90517C7.57364 1.85514 10.3765 1.80312 12.6293 1.86569C17.5908 1.98871 19.4565 4.14143 19.5385 9.49247C19.6 12.5063 19.5385 21.1582 19.5385 21.1582H14.167C14.167 17.9452 14.1743 15.8712 14.1797 14.3661C14.187 12.3278 14.1905 11.332 14.167 9.96402C14.1054 7.87281 13.5109 6.8682 11.8912 6.68368C10.169 6.47866 5.39206 6.64268 5.39206 6.64268V21.1582H0.0205078V1.9682C1.48206 1.9682 3.15828 1.93709 4.87829 1.90517Z"/></svg>`,
    blog: `<svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>`,
    podcast: `<svg viewBox="0 0 24 24"><path d="M12 1a9 9 0 0 0-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7a9 9 0 0 0-9-9z"/></svg>`,
    link: `<svg viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>`
  };

  // 1. 設定データの取得
  const config = window.SITE_CONFIG || window.DEFAULT_SITE_CONFIG || {};

  // 2. DOM構築・反映
  function renderSite() {
    // ページタイトル & メタ
    if (config.site?.title) {
      document.title = config.site.title;
    }

    // ブランド情報
    const brandNameEl = document.getElementById('brand-name');
    const brandSubEl = document.getElementById('brand-sub');
    const avatarEl = document.getElementById('brand-avatar');
    if (brandNameEl) brandNameEl.textContent = config.site?.brandName || 'AZARIN';
    if (brandSubEl) brandSubEl.textContent = config.site?.brandSub || '@azarin · YouTube Creator';
    if (avatarEl) avatarEl.textContent = config.site?.avatarInitial || 'あ';

    // タグ
    const tagListEl = document.getElementById('tag-list');
    if (tagListEl && config.site?.tags) {
      tagListEl.innerHTML = config.site.tags.map(t => `<span class="tag-pill">${escapeHTML(t)}</span>`).join('');
    }

    // メンテナンス情報
    const statusBadgeEl = document.getElementById('status-badge-text');
    const heroTitleEl = document.getElementById('hero-title');
    const heroDescEl = document.getElementById('hero-desc');
    if (statusBadgeEl) statusBadgeEl.textContent = config.maintenance?.badgeText || 'UNDER CONSTRUCTION';
    if (heroTitleEl) heroTitleEl.innerHTML = escapeHTML(config.maintenance?.heading || 'ただいまWEBサイトの\nリニューアル工事を行っています');
    if (heroDescEl) heroDescEl.innerHTML = escapeHTML(config.maintenance?.description || '');

    // 進捗バー
    const progressCard = document.getElementById('progress-card');
    if (progressCard) {
      if (config.maintenance?.showProgress) {
        progressCard.style.display = 'block';
        const fillEl = document.getElementById('progress-fill');
        const numEl = document.getElementById('progress-num');
        const labelEl = document.getElementById('progress-label-text');
        const percent = Math.min(100, Math.max(0, config.maintenance.progressPercent || 0));
        if (fillEl) fillEl.style.width = `${percent}%`;
        if (numEl) numEl.textContent = `${percent}%`;
        if (labelEl) labelEl.textContent = config.maintenance.progressLabel || 'リニューアル進捗';
      } else {
        progressCard.style.display = 'none';
      }
    }

    // カウントダウン
    initCountdown();

    // お問い合わせ
    const contactCard = document.getElementById('contact-card');
    if (contactCard) {
      if (config.contact?.enabled) {
        contactCard.style.display = 'flex';
        const titleEl = document.getElementById('contact-title');
        const descEl = document.getElementById('contact-desc');
        const emailEl = document.getElementById('contact-email');
        const emailBtn = document.getElementById('contact-email-btn');

        if (titleEl) titleEl.textContent = config.contact.title || 'お仕事・コラボ等のご連絡';
        if (descEl) descEl.textContent = config.contact.description || '';
        if (emailEl) emailEl.textContent = config.contact.email || 'azarin_official@yahoo.co.jp';
        if (emailBtn) emailBtn.href = `mailto:${config.contact.email || 'azarin_official@yahoo.co.jp'}`;
      } else {
        contactCard.style.display = 'none';
      }
    }

    // リンク一覧
    renderLinks();
  }

  // 3. リンク一覧描画
  function renderLinks() {
    const grid = document.getElementById('links-grid');
    if (!grid) return;

    const links = (config.links || []).filter(l => l.enabled !== false);
    grid.innerHTML = links.map(link => {
      const iconSvg = SVG_ICONS[link.icon] || SVG_ICONS.link;
      const isExternal = link.url.startsWith('http://') || link.url.startsWith('https://');
      const targetAttr = isExternal ? 'target="_blank" rel="noopener noreferrer"' : '';
      const featuredClass = link.featured ? 'featured' : '';

      return `
        <a href="${escapeHTML(link.url)}" class="link-card ${featuredClass}" ${targetAttr}>
          <div class="link-icon-wrap">
            ${iconSvg}
          </div>
          <div class="link-details">
            <div class="link-title-row">
              <span class="link-title">${escapeHTML(link.title)}</span>
              ${link.tag ? `<span class="link-tag">${escapeHTML(link.tag)}</span>` : ''}
            </div>
            <div class="link-desc">${escapeHTML(link.desc || '')}</div>
          </div>
          <div class="link-arrow">
            <svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
          </div>
        </a>
      `;
    }).join('');
  }

  // 4. カウントダウンタイマー処理
  let countdownInterval = null;
  function initCountdown() {
    const card = document.getElementById('countdown-card');
    if (!card) return;

    if (!config.countdown?.enabled || !config.countdown?.targetDate) {
      card.style.display = 'none';
      return;
    }

    card.style.display = 'block';
    const labelEl = document.getElementById('countdown-label');
    const subLabelEl = document.getElementById('countdown-sublabel');
    if (labelEl) labelEl.textContent = config.countdown.label || 'REOPENING COUNTDOWN';
    if (subLabelEl) subLabelEl.textContent = config.countdown.subLabel || 'リニューアル公開予定';

    const targetTime = new Date(config.countdown.targetDate).getTime();
    const daysEl = document.getElementById('time-days');
    const hoursEl = document.getElementById('time-hours');
    const minsEl = document.getElementById('time-minutes');
    const secsEl = document.getElementById('time-seconds');
    const timerGrid = document.getElementById('countdown-grid');
    const expiredEl = document.getElementById('countdown-expired');

    if (countdownInterval) clearInterval(countdownInterval);

    function update() {
      const now = new Date().getTime();
      const distance = targetTime - now;

      if (distance < 0) {
        if (timerGrid) timerGrid.style.display = 'none';
        if (expiredEl) {
          expiredEl.style.display = 'block';
          expiredEl.textContent = config.countdown.expiredMessage || 'まもなく公開予定です！';
        }
        clearInterval(countdownInterval);
        return;
      }

      if (timerGrid) timerGrid.style.display = 'grid';
      if (expiredEl) expiredEl.style.display = 'none';

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
      if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
    }

    update();
    countdownInterval = setInterval(update, 1000);
  }

  // 5. テーマ（ライト/ダーク）切り替え
  function initTheme() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (!themeBtn) return;

    themeBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      try {
        localStorage.setItem('theme', nextTheme);
      } catch (e) {
        console.warn(e);
      }
    });
  }

  // 6. メールアドレスのワンクリックコピー
  function initCopy() {
    const copyBtn = document.getElementById('copy-email-btn');
    const toast = document.getElementById('toast-msg');

    if (!copyBtn) return;

    copyBtn.addEventListener('click', () => {
      const email = config.contact?.email || 'azarin_official@yahoo.co.jp';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(showToast).catch(() => fallbackCopy(email));
      } else {
        fallbackCopy(email);
      }
    });

    function fallbackCopy(text) {
      const input = document.createElement('input');
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      showToast();
    }

    function showToast() {
      if (!toast) return;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 2500);
    }
  }

  // ユーティリティ: XSS対策エスケープ
  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/\n/g, '<br>');
  }

  // 実行
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderSite();
    initCopy();
  });

})();
