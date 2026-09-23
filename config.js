/**
 * azarin.me 工事中案内 サイト設定ファイル (Default Config)
 * admin.html（管理画面）から編集・保存・書き出しが可能です。
 */
window.DEFAULT_SITE_CONFIG = {
  // サイト基本情報
  site: {
    title: "あざりん | サイトリニューアル工事中",
    brandName: "AZARIN",
    brandSub: "@azarin · YouTube Creator",
    avatarInitial: "あ",
    tags: ["ガジェット", "YouTube", "サイトリニューアル中"],
    gtmId: "GTM-5SWCCXNL"
  },

  // 工事案内ステータス
  maintenance: {
    isActive: true,
    badgeText: "UNDER CONSTRUCTION · リニューアル工事中",
    badgeType: "warning", // 'warning', 'info', 'success'
    heading: "ただいまWEBサイトの\nリニューアル工事を行っています",
    description: "いつも「あざりん」を応援いただきありがとうございます。\n現在、より見やすく、快適に最新ガジェット情報やコンテンツをお届けできるよう、全面的なシステムおよびデザインのリニューアルを実施しております。\n公開まで今しばらくお待ちくださいますようお願い申し上げます。",
    showProgress: true,
    progressPercent: 78,
    progressLabel: "リニューアル進捗状況 (UIデザイン実装・機能移行中)"
  },

  // リニューアル公開予定カウントダウン
  countdown: {
    enabled: true,
    label: "REOPENING COUNTDOWN",
    subLabel: "リニューアル公開予定",
    targetDate: "2026-10-15T18:00:00", // ISO 8601フォーマット
    expiredMessage: "まもなく公開予定です！最新情報はSNSでお知らせします。"
  },

  // お問い合わせ窓口
  contact: {
    enabled: true,
    title: "お仕事・コラボ等のご連絡",
    description: "リニューアル工事中も、製品レビュー・タイアップ・取材等のご依頼は通常通り受け付けております。下記アドレスまでお気軽にご連絡ください。",
    email: "azarin_official@yahoo.co.jp",
    formUrl: "" // 任意のお問い合わせフォームURL（空なら非表示）
  },

  // 各種公式リンク集
  links: [
    {
      id: "main_channel",
      title: "メインチャンネル",
      desc: "ガジェット最新情報 & 丁寧なレビュー解説",
      url: "main/ch.html",
      icon: "youtube",
      tag: "YouTube",
      featured: true,
      enabled: true
    },
    {
      id: "gadget_channel",
      title: "ガジェットチャンネル",
      desc: "特化型ガジェット動画・比較レビュー",
      url: "gajyetto/ch.html",
      icon: "youtube",
      tag: "YouTube",
      featured: true,
      enabled: true
    },
    {
      id: "sub_channel",
      title: "サブチャンネル",
      desc: "日常・雑談・裏話・ライブ配信",
      url: "sub/ch.html",
      icon: "youtube",
      tag: "YouTube",
      featured: false,
      enabled: true
    },
    {
      id: "x_twitter",
      title: "X (Twitter)",
      desc: "日々のつぶやき & 速報アナウンス",
      url: "https://x.com/azarin_official",
      icon: "x",
      tag: "SNS",
      featured: false,
      enabled: true
    },
    {
      id: "instagram",
      title: "Instagram",
      desc: "デスク環境 & 写真コレクション",
      url: "https://Instagram.com/@azarin_official",
      icon: "instagram",
      tag: "SNS",
      featured: false,
      enabled: true
    },
    {
      id: "note",
      title: "note「azarinのガジェット日記」",
      desc: "長文コラム・深掘りガジェット雑記",
      url: "https://note.com/azukiba10051127",
      icon: "note",
      tag: "Column",
      featured: false,
      enabled: true
    },
    {
      id: "blog",
      title: "ブログ「るるそばのあれやこれや」",
      desc: "外部連載・ブログ記事",
      url: "https://rurusoba.me/author/azarin/",
      icon: "blog",
      tag: "Blog",
      featured: false,
      enabled: true
    },
    {
      id: "podcast",
      title: "ポッドキャスト",
      desc: "音声配信・ラジオトーク",
      url: "https://www.3zat.work/podcast/index.html",
      icon: "podcast",
      tag: "Audio",
      featured: false,
      enabled: true
    }
  ],

  // 管理画面設定
  admin: {
    // 簡易パスコード（初期値: azarin2026）
    passcode: "azarin2026"
  }
};

// localStorage からカスタム設定がある場合は読み込み
(function() {
  try {
    const saved = localStorage.getItem("AZARIN_SITE_CONFIG");
    if (saved) {
      const parsed = JSON.parse(saved);
      window.SITE_CONFIG = Object.assign({}, window.DEFAULT_SITE_CONFIG, parsed);
      return;
    }
  } catch (e) {
    console.warn("ローカル設定の読み込みに失敗しました:", e);
  }
  window.SITE_CONFIG = JSON.parse(JSON.stringify(window.DEFAULT_SITE_CONFIG));
})();
