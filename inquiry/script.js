document.addEventListener('DOMContentLoaded', () => {
    // ── 要素の取得 ──
    const form = document.getElementById('inquiry-form');
    const confirmModal = document.getElementById('confirm-modal');
    if (!form || !confirmModal) return;

    // カテゴリスイッチ関連
    const categoryInput = document.getElementById('inquiry-category-input');
    const tabBusiness = document.getElementById('tab-business');
    const tabPersonal = document.getElementById('tab-personal');
    const liquidIndicator = document.getElementById('liquid-indicator');
    const liquidDock = liquidIndicator ? liquidIndicator.parentElement : null;
    const dotBusiness = document.getElementById('dot-business');
    const dotPersonal = document.getElementById('dot-personal');
    const viewport = document.getElementById('inquiry-viewport');
    const panelBusiness = document.getElementById('panel-business');
    const panelPersonal = document.getElementById('panel-personal');
    const switchToPersonal = document.getElementById('switch-to-personal');
    const switchToBusiness = document.getElementById('switch-to-business');

    // 企業・法人用入力要素
    const bizCompany = document.getElementById('biz-company');
    const bizName = document.getElementById('biz-name');
    const bizEmail = document.getElementById('biz-email');
    const bizType = document.getElementById('biz-type');
    const bizUrl = document.getElementById('biz-url');
    const bizBudget = document.getElementById('biz-budget');
    const bizMessage = document.getElementById('biz-message');
    const bizAgree = document.getElementById('biz-agree');

    // 個人向け入力要素
    const persName = document.getElementById('pers-name');
    const persEmail = document.getElementById('pers-email');
    const persType = document.getElementById('pers-type');
    const persUrl = document.getElementById('pers-url');
    const persMessage = document.getElementById('pers-message');
    const persAgree = document.getElementById('pers-agree');

    // 送信確認モーダルプレビュー要素
    const previewCategory = document.getElementById('preview-category');
    const previewBizCompanyRow = document.getElementById('preview-biz-company-row');
    const previewBizCompany = document.getElementById('preview-biz-company');
    const previewNameRow = document.getElementById('preview-name-row');
    const previewNameLabel = document.getElementById('preview-name-label');
    const previewName = document.getElementById('preview-name');
    const previewEmail = document.getElementById('preview-email');
    const previewType = document.getElementById('preview-type');
    const previewUrlRow = document.getElementById('preview-url-row');
    const previewUrlLabel = document.getElementById('preview-url-label');
    const previewUrl = document.getElementById('preview-url');
    const previewBizBudgetRow = document.getElementById('preview-biz-budget-row');
    const previewBizBudget = document.getElementById('preview-biz-budget');
    const previewMessage = document.getElementById('preview-message');

    // モーダル操作ボタン
    const cancelBtn = document.getElementById('confirm-cancel');
    const submitBtn = document.getElementById('confirm-submit');
    const closeBtn = document.getElementById('confirm-close');

    // 現在のアクティブ区分 ('business' | 'personal')
    let currentCategory = 'business';

    // ── LIQUID GLASS タブ & スクロール同期 ──
    /**
     * インジケーターの位置と幅を滑らかに更新
     */
    function updateLiquidIndicator(progress) {
        if (!liquidIndicator || !tabBusiness || !tabPersonal || !liquidDock) return;

        const dockRect = liquidDock.getBoundingClientRect();
        const bizRect = tabBusiness.getBoundingClientRect();
        const persRect = tabPersonal.getBoundingClientRect();

        const bizLeft = bizRect.left - dockRect.left;
        const persLeft = persRect.left - dockRect.left;
        const bizWidth = bizRect.width;
        const persWidth = persRect.width;

        // progress (0: business, 1: personal) に応じた線形補間
        const currentLeft = bizLeft + (persLeft - bizLeft) * progress;
        const currentWidth = bizWidth + (persWidth - bizWidth) * progress;

        liquidIndicator.style.transform = `translateX(${currentLeft - 5}px)`;
        liquidIndicator.style.width = `${currentWidth}px`;
    }

    /**
     * アクティブなカテゴリ（企業 or 個人）を設定し、非アクティブなフィールドをdisabled化
     */
    function setCategory(category, syncScroll = false) {
        currentCategory = category;

        if (category === 'business') {
            tabBusiness.classList.add('active');
            tabBusiness.setAttribute('aria-selected', 'true');
            tabPersonal.classList.remove('active');
            tabPersonal.setAttribute('aria-selected', 'false');

            if (dotBusiness) dotBusiness.classList.add('active');
            if (dotPersonal) dotPersonal.classList.remove('active');

            if (categoryInput) categoryInput.value = '企業・法人様';

            // 企業用入力を有効化、個人用入力を無効化（誤バリデーション＆二重送信を防止）
            togglePanelInputs(panelBusiness, true);
            togglePanelInputs(panelPersonal, false);

            if (syncScroll && viewport) {
                viewport.scrollTo({ left: 0, behavior: 'smooth' });
            }
        } else {
            tabPersonal.classList.add('active');
            tabPersonal.setAttribute('aria-selected', 'true');
            tabBusiness.classList.remove('active');
            tabBusiness.setAttribute('aria-selected', 'false');

            if (dotPersonal) dotPersonal.classList.add('active');
            if (dotBusiness) dotBusiness.classList.remove('active');

            if (categoryInput) categoryInput.value = '個人のお客様';

            // 個人用入力を有効化、企業用入力を無効化
            togglePanelInputs(panelPersonal, true);
            togglePanelInputs(panelBusiness, false);

            if (syncScroll && viewport && panelPersonal) {
                viewport.scrollTo({ left: panelPersonal.offsetLeft, behavior: 'smooth' });
            }
        }

        // インジケーターを直接スナップ
        updateLiquidIndicator(category === 'business' ? 0 : 1);
    }

    /**
     * パネル内のフォーム入力要素の disabled 属性を切り替え
     */
    function togglePanelInputs(panel, enabled) {
        if (!panel) return;
        const inputs = panel.querySelectorAll('input, select, textarea, button[type="submit"]');
        inputs.forEach(input => {
            if (input.type !== 'hidden') {
                input.disabled = !enabled;
            }
        });
    }

    // スクロール監視によるインジケーターのリアルタイム追従
    let isTicking = false;
    if (viewport) {
        viewport.addEventListener('scroll', () => {
            if (!isTicking) {
                window.requestAnimationFrame(() => {
                    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
                    if (maxScroll > 0) {
                        const progress = Math.max(0, Math.min(1, viewport.scrollLeft / maxScroll));
                        updateLiquidIndicator(progress);

                        // 50% を超えたらアクティブ状態を切り替え
                        if (progress >= 0.5 && currentCategory !== 'personal') {
                            setCategory('personal', false);
                        } else if (progress < 0.5 && currentCategory !== 'business') {
                            setCategory('business', false);
                        }
                    }
                    isTicking = false;
                });
                isTicking = true;
            }
        }, { passive: true });
    }

    // タブクリックイベント
    if (tabBusiness) {
        tabBusiness.addEventListener('click', () => setCategory('business', true));
    }
    if (tabPersonal) {
        tabPersonal.addEventListener('click', () => setCategory('personal', true));
    }

    // カード下部の切り替えリンク
    if (switchToPersonal) {
        switchToPersonal.addEventListener('click', () => setCategory('personal', true));
    }
    if (switchToBusiness) {
        switchToBusiness.addEventListener('click', () => setCategory('business', true));
    }

    // ウィンドウリサイズ時のインジケーター再計算
    window.addEventListener('resize', () => {
        updateLiquidIndicator(currentCategory === 'business' ? 0 : 1);
    });

    // 初期状態のインジケーター配置とフォーム活性化
    setTimeout(() => {
        setCategory('business', false);
    }, 50);


    // ── バリデーション機能 ──

    /**
     * エラーを解除する関数
     */
    function clearError(inputEl) {
        if (!inputEl) return;
        const group = inputEl.closest('.form-group');
        if (group) {
            group.classList.remove('has-error');
            const existingError = group.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
        }
    }

    /**
     * エラーを表示する関数
     */
    function setError(inputEl, message) {
        if (!inputEl) return;
        const group = inputEl.closest('.form-group');
        if (group) {
            group.classList.add('has-error');
            let errorEl = group.querySelector('.error-message');
            if (!errorEl) {
                errorEl = document.createElement('span');
                errorEl.className = 'error-message';
                group.appendChild(errorEl);
            }
            errorEl.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 2px;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>${message}</span>
            `;
        }
    }

    /**
     * メールアドレスの厳格バリデーション関数
     * RFC 5322準拠および日本の誤入力（全角・スペース・構文ミス）を検知
     */
    function validateEmailAddress(rawEmail) {
        if (!rawEmail || !rawEmail.trim()) {
            return { isValid: false, message: 'メールアドレスを入力してください。' };
        }

        const email = rawEmail.trim();

        // 1. スペース（全角・半角）の混入チェック
        if (/[\s\u3000]/.test(email)) {
            return { isValid: false, message: 'メールアドレスにスペースを含めることはできません。' };
        }

        // 2. 全角文字のチェック
        if (/[^\x20-\x7E]/.test(email)) {
            return { isValid: false, message: 'メールアドレスは半角英数字・記号で入力してください（全角文字が含まれています）。' };
        }

        // 3. 「@」の個数チェック
        const atCount = (email.match(/@/g) || []).length;
        if (atCount === 0) {
            return { isValid: false, message: '「@」が含まれていません。正しいメールアドレスを入力してください。' };
        }
        if (atCount > 1) {
            return { isValid: false, message: '「@」が複数含まれています。' };
        }

        // 4. ローカル部とドメイン部の分離
        const atIndex = email.indexOf('@');
        const localPart = email.slice(0, atIndex);
        const domainPart = email.slice(atIndex + 1);

        if (!localPart) {
            return { isValid: false, message: '「@」の前のユーザー名を入力してください。' };
        }
        if (!domainPart) {
            return { isValid: false, message: '「@」の後のドメイン名を入力してください（例: example.com）。' };
        }

        // 5. ローカル部の詳細チェック
        if (localPart.startsWith('.') || localPart.endsWith('.')) {
            return { isValid: false, message: 'ユーザー名（@の前）の先頭または末尾に「.（ドット）」を使用することはできません。' };
        }
        if (/\.{2,}/.test(localPart)) {
            return { isValid: false, message: 'ユーザー名（@の前）に「.（ドット）」を連続して使用することはできません。' };
        }
        if (localPart.length > 64) {
            return { isValid: false, message: 'ユーザー名（@の前）が長すぎます（64文字以内）。' };
        }

        // 6. ドメイン部の詳細チェック
        if (!domainPart.includes('.')) {
            return { isValid: false, message: 'ドメイン名（@以降）に「.（ドット）」が含まれていません（例: example.com）。' };
        }
        if (domainPart.startsWith('.') || domainPart.endsWith('.')) {
            return { isValid: false, message: 'ドメイン名（@以降）の先頭または末尾に「.（ドット）」を使用することはできません。' };
        }
        if (/\.{2,}/.test(domainPart)) {
            return { isValid: false, message: 'ドメイン名（@以降）に「.（ドット）」を連続して使用することはできません。' };
        }
        if (domainPart.length > 255) {
            return { isValid: false, message: 'ドメイン名（@以降）が長すぎます。' };
        }

        const labels = domainPart.split('.');
        const tld = labels[labels.length - 1];

        if (!/^[a-zA-Z]{2,63}$/.test(tld)) {
            return { isValid: false, message: 'トップレベルドメイン（.comや.jpなど）が正しくありません（半角英字2文字以上）。' };
        }

        for (const label of labels) {
            if (!label) {
                return { isValid: false, message: 'ドメイン名の形式が正しくありません。' };
            }
            if (label.startsWith('-') || label.endsWith('-')) {
                return { isValid: false, message: 'ドメインラベルの先頭または末尾にハイフン「-」は使用できません。' };
            }
            if (!/^[a-zA-Z0-9-]+$/.test(label)) {
                return { isValid: false, message: 'ドメイン名に使用できない記号が含まれています。' };
            }
        }

        // 7. RFC 5322 準拠の総合チェック
        const strictEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
        if (!strictEmailRegex.test(email)) {
            return { isValid: false, message: '有効なメールアドレスの形式で入力してください（例: name@example.com）。' };
        }

        return { isValid: true, message: '' };
    }

    /**
     * URLのチェック関数
     */
    function validateUrl(urlInputEl) {
        if (!urlInputEl || !urlInputEl.value.trim()) return true;
        const val = urlInputEl.value.trim();
        return /^https?:\/\/[^\s]+$/i.test(val);
    }

    /**
     * 現在アクティブなパネルに応じたバリデーション
     */
    function validateCurrentForm() {
        let isValid = true;
        let firstInvalidEl = null;

        function markInvalid(el, message) {
            setError(el, message);
            isValid = false;
            if (!firstInvalidEl) firstInvalidEl = el;
        }

        if (currentCategory === 'business') {
            // ── 企業様用バリデーション ──
            if (bizCompany && !bizCompany.value.trim()) {
                markInvalid(bizCompany, '貴社名・屋号を入力してください。');
            } else if (bizCompany) {
                clearError(bizCompany);
            }

            if (bizName && !bizName.value.trim()) {
                markInvalid(bizName, 'ご担当者名を入力してください。');
            } else if (bizName) {
                clearError(bizName);
            }

            if (bizEmail) {
                const emailRes = validateEmailAddress(bizEmail.value);
                if (!emailRes.isValid) {
                    markInvalid(bizEmail, emailRes.message);
                } else {
                    clearError(bizEmail);
                }
            }

            if (bizType && !bizType.value) {
                markInvalid(bizType, 'ご相談の種類を選択してください。');
            } else if (bizType) {
                clearError(bizType);
            }

            if (bizUrl && !validateUrl(bizUrl)) {
                markInvalid(bizUrl, '「http://」または「https://」から始まる正しいURLを入力してください。');
            } else if (bizUrl) {
                clearError(bizUrl);
            }

            if (bizMessage && !bizMessage.value.trim()) {
                markInvalid(bizMessage, 'お問い合わせ内容をご記入ください。');
            } else if (bizMessage) {
                clearError(bizMessage);
            }

            if (bizAgree && !bizAgree.checked) {
                markInvalid(bizAgree, '利用規約とプライバシーポリシーへの同意が必要です。');
            } else if (bizAgree) {
                clearError(bizAgree);
            }

        } else {
            // ── 個人向けバリデーション ──
            if (persName && !persName.value.trim()) {
                markInvalid(persName, 'お名前を入力してください。');
            } else if (persName) {
                clearError(persName);
            }

            if (persEmail) {
                const emailRes = validateEmailAddress(persEmail.value);
                if (!emailRes.isValid) {
                    markInvalid(persEmail, emailRes.message);
                } else {
                    clearError(persEmail);
                }
            }

            if (persType && !persType.value) {
                markInvalid(persType, 'お問い合わせの種類を選択してください。');
            } else if (persType) {
                clearError(persType);
            }

            if (persUrl && !validateUrl(persUrl)) {
                markInvalid(persUrl, '「http://」または「https://」から始まる正しいURLを入力してください。');
            } else if (persUrl) {
                clearError(persUrl);
            }

            if (persMessage && !persMessage.value.trim()) {
                markInvalid(persMessage, 'メッセージ・お問い合わせ内容をご記入ください。');
            } else if (persMessage) {
                clearError(persMessage);
            }

            if (persAgree && !persAgree.checked) {
                markInvalid(persAgree, '利用規約とプライバシーポリシーへの同意が必要です。');
            } else if (persAgree) {
                clearError(persAgree);
            }
        }

        return { isValid, firstInvalidEl };
    }

    // ── リアルタイムバリデーション（入力中の自動解除） ──
    const allWatchElements = [
        { el: bizCompany, test: el => el.value.trim() !== '' },
        { el: bizName, test: el => el.value.trim() !== '' },
        { el: bizEmail, test: el => validateEmailAddress(el.value).isValid },
        { el: bizType, test: el => el.value !== '' },
        { el: bizUrl, test: el => validateUrl(el) },
        { el: bizMessage, test: el => el.value.trim() !== '' },
        { el: bizAgree, test: el => el.checked },

        { el: persName, test: el => el.value.trim() !== '' },
        { el: persEmail, test: el => validateEmailAddress(el.value).isValid },
        { el: persType, test: el => el.value !== '' },
        { el: persUrl, test: el => validateUrl(el) },
        { el: persMessage, test: el => el.value.trim() !== '' },
        { el: persAgree, test: el => el.checked }
    ];

    allWatchElements.forEach(({ el, test }) => {
        if (!el) return;
        const eventName = el.type === 'checkbox' || el.tagName === 'SELECT' ? 'change' : 'input';
        el.addEventListener(eventName, () => {
            const group = el.closest('.form-group');
            if (group && group.classList.contains('has-error')) {
                if (test(el)) {
                    clearError(el);
                }
            }
        });
    });

    // メールアドレスの blur 時チェック
    [bizEmail, persEmail].forEach(emailEl => {
        if (!emailEl) return;
        emailEl.addEventListener('blur', () => {
            const val = emailEl.value.trim();
            if (val) {
                const res = validateEmailAddress(val);
                if (!res.isValid) {
                    setError(emailEl, res.message);
                } else {
                    clearError(emailEl);
                }
            }
        });
    });

    // ── モーダルの開閉機能 ──
    function openModal() {
        if (currentCategory === 'business') {
            // 企業様用プレビューの流し込み
            if (previewCategory) previewCategory.textContent = '企業・法人様 (Business)';
            
            if (previewBizCompanyRow) previewBizCompanyRow.style.display = 'flex';
            if (previewBizCompany) previewBizCompany.textContent = bizCompany ? bizCompany.value.trim() : '';

            if (previewNameLabel) previewNameLabel.textContent = 'ご担当者名';
            if (previewName) previewName.textContent = bizName ? bizName.value.trim() : '';

            if (previewEmail) previewEmail.textContent = bizEmail ? bizEmail.value.trim() : '';
            if (previewType) previewType.textContent = bizType ? bizType.value : '';

            if (previewUrlRow) previewUrlRow.style.display = 'flex';
            if (previewUrlLabel) previewUrlLabel.textContent = '貴社ウェブサイトURL';
            if (previewUrl) {
                const urlVal = bizUrl ? bizUrl.value.trim() : '';
                previewUrl.textContent = urlVal || '（未入力）';
                previewUrl.style.color = urlVal ? 'var(--text)' : 'var(--text-tertiary)';
            }

            if (previewBizBudgetRow) previewBizBudgetRow.style.display = 'flex';
            if (previewBizBudget) {
                const budVal = bizBudget ? bizBudget.value.trim() : '';
                previewBizBudget.textContent = budVal || '（未入力）';
                previewBizBudget.style.color = budVal ? 'var(--text)' : 'var(--text-tertiary)';
            }

            if (previewMessage) previewMessage.textContent = bizMessage ? bizMessage.value : '';

        } else {
            // 個人向けプレビューの流し込み
            if (previewCategory) previewCategory.textContent = '個人のお客様 (Personal)';
            
            if (previewBizCompanyRow) previewBizCompanyRow.style.display = 'none';

            if (previewNameLabel) previewNameLabel.textContent = 'お名前';
            if (previewName) previewName.textContent = persName ? persName.value.trim() : '';

            if (previewEmail) previewEmail.textContent = persEmail ? persEmail.value.trim() : '';
            if (previewType) previewType.textContent = persType ? persType.value : '';

            if (previewUrlRow) previewUrlRow.style.display = 'flex';
            if (previewUrlLabel) previewUrlLabel.textContent = '関連URL・SNS';
            if (previewUrl) {
                const urlVal = persUrl ? persUrl.value.trim() : '';
                previewUrl.textContent = urlVal || '（未入力）';
                previewUrl.style.color = urlVal ? 'var(--text)' : 'var(--text-tertiary)';
            }

            if (previewBizBudgetRow) previewBizBudgetRow.style.display = 'none';

            if (previewMessage) previewMessage.textContent = persMessage ? persMessage.value : '';
        }

        // モーダル表示 & スクロールロック
        confirmModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        if (cancelBtn) cancelBtn.focus();
    }

    function closeModal() {
        confirmModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ── フォーム送信トリガー（確認モーダル表示） ──
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const { isValid, firstInvalidEl } = validateCurrentForm();
        if (!isValid) {
            if (firstInvalidEl) {
                firstInvalidEl.focus();
                firstInvalidEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        openModal();
    });

    // ── モーダル内ボタンの操作 ──
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) {
            closeModal();
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && confirmModal.classList.contains('active')) {
            closeModal();
        }
    });

    // 送信確認モーダルで「送信する」ボタン押下時
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            // 二重送信防止
            submitBtn.disabled = true;
            submitBtn.textContent = '送信中...';
            submitBtn.style.opacity = '0.7';
            submitBtn.style.cursor = 'not-allowed';

            if (cancelBtn) cancelBtn.disabled = true;
            if (closeBtn) closeBtn.disabled = true;

            // 送信直前に非アクティブ側のパネルの入力を確実に disabled にして不要な空データを排除
            if (currentCategory === 'business') {
                togglePanelInputs(panelBusiness, true);
                togglePanelInputs(panelPersonal, false);
            } else {
                togglePanelInputs(panelPersonal, true);
                togglePanelInputs(panelBusiness, false);
            }

            // SSGForm の endpoint へ POST
            form.submit();
        });
    }
});
