/**
 * azarin.me 管理画面スクリプト (Admin Controller)
 */

(function () {
  'use strict';

  // 1. 設定データの取得（localStorage優先、なければdefault）
  let currentConfig = JSON.parse(JSON.stringify(window.SITE_CONFIG || window.DEFAULT_SITE_CONFIG));

  // DOM要素参照
  const authOverlay = document.getElementById('auth-overlay');
  const authInput = document.getElementById('auth-passcode');
  const authBtn = document.getElementById('auth-submit-btn');
  const authError = document.getElementById('auth-error');
  const previewIframe = document.getElementById('preview-iframe');

  // 2. 認証ゲート処理
  function initAuth() {
    const isAuthed = sessionStorage.getItem('AZARIN_ADMIN_AUTH') === 'true';
    if (isAuthed) {
      if (authOverlay) authOverlay.style.display = 'none';
      return;
    }

    if (!authBtn || !authInput) return;

    authBtn.addEventListener('click', verifyPasscode);
    authInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') verifyPasscode();
    });

    function verifyPasscode() {
      const entered = authInput.value.trim();
      const validPass = currentConfig.admin?.passcode || 'azarin2026';

      if (entered === validPass) {
        sessionStorage.setItem('AZARIN_ADMIN_AUTH', 'true');
        authOverlay.style.opacity = '0';
        setTimeout(() => {
          authOverlay.style.display = 'none';
        }, 300);
      } else {
        if (authError) {
          authError.style.display = 'block';
          authInput.classList.add('error');
        }
      }
    }
  }

  // 3. フォームへの初期値バインディング
  function populateForm() {
    // サイト基本情報
    setVal('input-site-title', currentConfig.site?.title);
    setVal('input-brand-name', currentConfig.site?.brandName);
    setVal('input-brand-sub', currentConfig.site?.brandSub);
    setVal('input-brand-avatar', currentConfig.site?.avatarInitial);
    setVal('input-tags', (currentConfig.site?.tags || []).join(', '));

    // 工事案内ステータス
    setChecked('check-maint-active', currentConfig.maintenance?.isActive);
    setVal('input-badge-text', currentConfig.maintenance?.badgeText);
    setVal('select-badge-type', currentConfig.maintenance?.badgeType || 'warning');
    setVal('input-hero-heading', currentConfig.maintenance?.heading);
    setVal('input-hero-desc', currentConfig.maintenance?.description);
    
    // 進捗
    setChecked('check-show-progress', currentConfig.maintenance?.showProgress);
    setVal('input-progress-val', currentConfig.maintenance?.progressPercent || 75);
    setVal('range-progress', currentConfig.maintenance?.progressPercent || 75);
    setVal('input-progress-label', currentConfig.maintenance?.progressLabel);

    // カウントダウン
    setChecked('check-countdown-enable', currentConfig.countdown?.enabled);
    setVal('input-countdown-label', currentConfig.countdown?.label);
    setVal('input-countdown-sublabel', currentConfig.countdown?.subLabel);
    
    // 日時ピッカー（YYYY-MM-DDTHH:mm に整形）
    if (currentConfig.countdown?.targetDate) {
      const d = new Date(currentConfig.countdown.targetDate);
      if (!isNaN(d.getTime())) {
        const iso = d.toISOString().slice(0, 16);
        setVal('input-countdown-date', iso);
      }
    }
    setVal('input-countdown-expired', currentConfig.countdown?.expiredMessage);

    // お問い合わせ
    setChecked('check-contact-enable', currentConfig.contact?.enabled);
    setVal('input-contact-title', currentConfig.contact?.title);
    setVal('input-contact-desc', currentConfig.contact?.description);
    setVal('input-contact-email', currentConfig.contact?.email);

    // セキュリティ
    setVal('input-new-passcode', currentConfig.admin?.passcode || 'azarin2026');

    // リンク一覧の描画
    renderLinkEditors();
  }

  function setVal(id, val) {
    const el = document.getElementById(id);
    if (el && val !== undefined) el.value = val;
  }

  function setChecked(id, val) {
    const el = document.getElementById(id);
    if (el) el.checked = !!val;
  }

  // 4. リンク編集項目の生成
  function renderLinkEditors() {
    const container = document.getElementById('links-editor-list');
    if (!container) return;

    container.innerHTML = '';
    const links = currentConfig.links || [];

    links.forEach((link, idx) => {
      const item = document.createElement('div');
      item.className = 'link-editor-item';
      item.dataset.index = idx;

      item.innerHTML = `
        <div class="link-editor-head">
          <span class="link-editor-title">
            <label class="switch" style="transform: scale(0.85); margin-right: 4px;">
              <input type="checkbox" class="link-enabled-toggle" ${link.enabled !== false ? 'checked' : ''}>
              <span class="slider"></span>
            </label>
            ${escapeHTML(link.title || '新しいリンク')}
          </span>
          <button type="button" class="btn-remove-link" title="削除">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            削除
          </button>
        </div>
        <div class="link-editor-grid">
          <div>
            <label class="form-label">タイトル</label>
            <input type="text" class="form-input link-field-title" value="${escapeHTML(link.title || '')}">
          </div>
          <div>
            <label class="form-label">URL / 相対パス</label>
            <input type="text" class="form-input link-field-url" value="${escapeHTML(link.url || '')}">
          </div>
          <div>
            <label class="form-label">説明文</label>
            <input type="text" class="form-input link-field-desc" value="${escapeHTML(link.desc || '')}">
          </div>
          <div>
            <label class="form-label">タグ / アイコン</label>
            <div style="display: flex; gap: 0.5rem;">
              <input type="text" class="form-input link-field-tag" style="flex: 1;" placeholder="タグ (YouTube等)" value="${escapeHTML(link.tag || '')}">
              <select class="form-select link-field-icon" style="width: 120px;">
                <option value="youtube" ${link.icon === 'youtube' ? 'selected' : ''}>YouTube</option>
                <option value="x" ${link.icon === 'x' ? 'selected' : ''}>X (Twitter)</option>
                <option value="instagram" ${link.icon === 'instagram' ? 'selected' : ''}>Instagram</option>
                <option value="note" ${link.icon === 'note' ? 'selected' : ''}>note</option>
                <option value="blog" ${link.icon === 'blog' ? 'selected' : ''}>ブログ</option>
                <option value="podcast" ${link.icon === 'podcast' ? 'selected' : ''}>ポッドキャスト</option>
                <option value="link" ${link.icon === 'link' ? 'selected' : ''}>その他</option>
              </select>
            </div>
          </div>
        </div>
      `;

      // 削除イベント
      item.querySelector('.btn-remove-link').addEventListener('click', () => {
        currentConfig.links.splice(idx, 1);
        renderLinkEditors();
        syncPreview();
      });

      // 編集イベント
      item.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', () => {
          collectFormData();
          syncPreview();
        });
      });

      container.appendChild(item);
    });
  }

  // 5. フォームから現在の設定データを吸い上げる
  function collectFormData() {
    // サイト基本
    currentConfig.site = currentConfig.site || {};
    currentConfig.site.title = getVal('input-site-title');
    currentConfig.site.brandName = getVal('input-brand-name');
    currentConfig.site.brandSub = getVal('input-brand-sub');
    currentConfig.site.avatarInitial = getVal('input-brand-avatar');
    currentConfig.site.tags = getVal('input-tags').split(',').map(s => s.trim()).filter(Boolean);

    // 工事案内ステータス
    currentConfig.maintenance = currentConfig.maintenance || {};
    currentConfig.maintenance.isActive = getChecked('check-maint-active');
    currentConfig.maintenance.badgeText = getVal('input-badge-text');
    currentConfig.maintenance.badgeType = getVal('select-badge-type');
    currentConfig.maintenance.heading = getVal('input-hero-heading');
    currentConfig.maintenance.description = getVal('input-hero-desc');
    currentConfig.maintenance.showProgress = getChecked('check-show-progress');
    currentConfig.maintenance.progressPercent = parseInt(getVal('input-progress-val'), 10) || 0;
    currentConfig.maintenance.progressLabel = getVal('input-progress-label');

    // カウントダウン
    currentConfig.countdown = currentConfig.countdown || {};
    currentConfig.countdown.enabled = getChecked('check-countdown-enable');
    currentConfig.countdown.label = getVal('input-countdown-label');
    currentConfig.countdown.subLabel = getVal('input-countdown-sublabel');
    const dateVal = getVal('input-countdown-date');
    if (dateVal) {
      currentConfig.countdown.targetDate = new Date(dateVal).toISOString();
    }
    currentConfig.countdown.expiredMessage = getVal('input-countdown-expired');

    // お問い合わせ
    currentConfig.contact = currentConfig.contact || {};
    currentConfig.contact.enabled = getChecked('check-contact-enable');
    currentConfig.contact.title = getVal('input-contact-title');
    currentConfig.contact.description = getVal('input-contact-desc');
    currentConfig.contact.email = getVal('input-contact-email');

    // セキュリティ
    currentConfig.admin = currentConfig.admin || {};
    const newPass = getVal('input-new-passcode');
    if (newPass) currentConfig.admin.passcode = newPass;

    // リンク一覧の吸い上げ
    const items = document.querySelectorAll('.link-editor-item');
    const updatedLinks = [];
    items.forEach((el, idx) => {
      const orig = currentConfig.links[idx] || {};
      updatedLinks.push({
        id: orig.id || `link_${Date.now()}_${idx}`,
        title: el.querySelector('.link-field-title').value,
        url: el.querySelector('.link-field-url').value,
        desc: el.querySelector('.link-field-desc').value,
        tag: el.querySelector('.link-field-tag').value,
        icon: el.querySelector('.link-field-icon').value,
        enabled: el.querySelector('.link-enabled-toggle').checked,
        featured: orig.featured || false
      });
    });
    currentConfig.links = updatedLinks;
  }

  function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
  }

  function getChecked(id) {
    const el = document.getElementById(id);
    return el ? el.checked : false;
  }

  // 6. プレビューのリアルタイム更新
  function syncPreview() {
    if (!previewIframe || !previewIframe.contentWindow) return;
    try {
      // プレビューのiframe内のSITE_CONFIGを更新してリロードまたは再描画
      previewIframe.contentWindow.SITE_CONFIG = JSON.parse(JSON.stringify(currentConfig));
      if (typeof previewIframe.contentWindow.location?.reload === 'function') {
        // 設定をiframeのローカルストレージにも渡す
        previewIframe.contentWindow.localStorage?.setItem('AZARIN_SITE_CONFIG', JSON.stringify(currentConfig));
        previewIframe.contentWindow.location.reload();
      }
    } catch (e) {
      console.warn('プレビュー更新エラー:', e);
    }
  }

  // 7. 保存 ＆ 書き出し（ファイルダウンロード）
  function initActions() {
    // スライダー連動
    const range = document.getElementById('range-progress');
    const num = document.getElementById('input-progress-val');
    if (range && num) {
      range.addEventListener('input', () => {
        num.value = range.value;
        collectFormData();
        syncPreview();
      });
      num.addEventListener('input', () => {
        range.value = num.value;
        collectFormData();
        syncPreview();
      });
    }

    // 全てのinput変更で自動同期
    document.querySelectorAll('.admin-editor input, .admin-editor textarea, .admin-editor select').forEach(el => {
      el.addEventListener('input', () => {
        collectFormData();
        syncPreview();
      });
    });

    // リンク追加ボタン
    const addLinkBtn = document.getElementById('btn-add-link');
    if (addLinkBtn) {
      addLinkBtn.addEventListener('click', () => {
        currentConfig.links.push({
          id: `link_${Date.now()}`,
          title: '新しいリンク',
          url: 'https://',
          desc: 'リンクの説明文',
          tag: 'Official',
          icon: 'link',
          enabled: true,
          featured: false
        });
        renderLinkEditors();
        syncPreview();
      });
    }

    // 「ブラウザに保存（即時反映）」
    const saveBtn = document.getElementById('btn-save-local');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        collectFormData();
        try {
          localStorage.setItem('AZARIN_SITE_CONFIG', JSON.stringify(currentConfig));
          showToast('設定をブラウザに保存しました！');
          syncPreview();
        } catch (e) {
          alert('保存に失敗しました: ' + e.message);
        }
      });
    }

    // 「config.js をダウンロード（本番反映用）」
    const downloadBtn = document.getElementById('btn-download-config');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        collectFormData();
        const fileContent = `/**
 * azarin.me 工事中案内 サイト設定ファイル (Exported Config)
 * 生成日時: ${new Date().toLocaleString('ja-JP')}
 */
window.DEFAULT_SITE_CONFIG = ${JSON.stringify(currentConfig, null, 2)};

(function() {
  try {
    const saved = localStorage.getItem("AZARIN_SITE_CONFIG");
    if (saved) {
      const parsed = JSON.parse(saved);
      window.SITE_CONFIG = Object.assign({}, window.DEFAULT_SITE_CONFIG, parsed);
      return;
    }
  } catch (e) {}
  window.SITE_CONFIG = JSON.parse(JSON.stringify(window.DEFAULT_SITE_CONFIG));
})();
`;
        const blob = new Blob([fileContent], { type: 'application/javascript;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'config.js';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('config.js をダウンロードしました！');
      });
    }

    // 「初期値にリセット」
    const resetBtn = document.getElementById('btn-reset-default');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (!confirm('全ての設定を初期状態に戻しますか？')) return;
        localStorage.removeItem('AZARIN_SITE_CONFIG');
        currentConfig = JSON.parse(JSON.stringify(window.DEFAULT_SITE_CONFIG));
        populateForm();
        syncPreview();
        showToast('初期設定にリセットしました');
      });
    }

    // デバイス切り替えボタン（PC / タブレット / スマホ）
    document.querySelectorAll('.device-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const device = btn.dataset.device;
        previewIframe.className = `preview-iframe device-${device}`;
      });
    });
  }

  function showToast(msg) {
    const toast = document.getElementById('admin-toast');
    const toastText = document.getElementById('admin-toast-text');
    if (!toast || !toastText) return;
    toastText.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // 初期化実行
  document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    populateForm();
    initActions();
  });

})();
