/**
 * azarin.me 工事中案内 サイト設定ファイル (Exported Config)
 * 生成日時: 2026/9/23 19:22:27
 */
window.DEFAULT_SITE_CONFIG = {
  "site": {
    "title": "あざりん | サイトリニューアル工事中 (テスト中)",
    "brandName": "AZARIN",
    "brandSub": "@azarin · YouTube Creator",
    "avatarInitial": "あ",
    "tags": [
      "ガジェット",
      "YouTube",
      "サイトリニューアル中"
    ],
    "gtmId": "GTM-5SWCCXNL"
  },
  "maintenance": {
    "isActive": true,
    "badgeText": "UNDER CONSTRUCTION · リニューアル工事中 ",
    "badgeType": "warning",
    "heading": "リニューアル工事の画面を作成中です。実際にはこのようなリニューアル工事はしておりません",
    "description": "いつも「あざりん」を応援いただきありがとうございます。\n現在、より見やすく、快適に最新ガジェット情報やコンテンツをお届けできるよう、全面的なシステムおよびデザインのリニューアルを実施しております。\n公開まで今しばらくお待ちくださいますようお願い申し上げます。",
    "showProgress": true,
    "progressPercent": 78,
    "progressLabel": "リニューアル進捗状況 (UIデザイン実装・機能移行中)"
  },
  "countdown": {
    "enabled": true,
    "label": "REOPENING COUNTDOWN",
    "subLabel": "リニューアル公開予定",
    "targetDate": "2026-10-14T06:00:00.000Z",
    "expiredMessage": "まもなく公開予定です！最新情報はSNSでお知らせします。"
  },
  "contact": {
    "enabled": true,
    "title": "お仕事・コラボ等のご連絡",
    "description": "リニューアル工事中も、製品レビュー・PRタイアップ・取材等のご依頼やお問い合わせは通常通り受け付けております。専用のWebフォーム、または下記メールアドレスよりお気軽にご連絡ください。",
    "email": "azarin_official@yahoo.co.jp",
    "formUrl": "inquiry/index.html"
  },
  "links": [
    {
      "id": "main_channel",
      "title": "メインチャンネル",
      "url": "main/ch.html",
      "desc": "ガジェット最新情報 & 丁寧なレビュー解説",
      "tag": "YouTube",
      "icon": "youtube",
      "enabled": true,
      "featured": true
    },
    {
      "id": "gadget_channel",
      "title": "ガジェットチャンネル",
      "url": "gajyetto/ch.html",
      "desc": "特化型ガジェット動画・比較レビュー",
      "tag": "YouTube",
      "icon": "youtube",
      "enabled": true,
      "featured": true
    },
    {
      "id": "sub_channel",
      "title": "サブチャンネル",
      "url": "sub/ch.html",
      "desc": "日常・雑談・裏話・ライブ配信",
      "tag": "YouTube",
      "icon": "youtube",
      "enabled": true,
      "featured": false
    },
    {
      "id": "x_twitter",
      "title": "X (Twitter)",
      "url": "https://x.com/azarin_official",
      "desc": "日々のつぶやき & 速報アナウンス",
      "tag": "SNS",
      "icon": "x",
      "enabled": true,
      "featured": false
    },
    {
      "id": "instagram",
      "title": "Instagram",
      "url": "https://Instagram.com/@azarin_official",
      "desc": "デスク環境 & 写真コレクション",
      "tag": "SNS",
      "icon": "instagram",
      "enabled": true,
      "featured": false
    },
    {
      "id": "note",
      "title": "note「azarinのガジェット日記」",
      "url": "https://note.com/azukiba10051127",
      "desc": "長文コラム・深掘りガジェット雑記",
      "tag": "Column",
      "icon": "note",
      "enabled": true,
      "featured": false
    },
    {
      "id": "blog",
      "title": "ブログ「るるそばのあれやこれや」",
      "url": "https://rurusoba.me/author/azarin/",
      "desc": "外部連載・ブログ記事",
      "tag": "Blog",
      "icon": "blog",
      "enabled": true,
      "featured": false
    },
    {
      "id": "podcast",
      "title": "ポッドキャスト",
      "url": "https://www.3zat.work/podcast/index.html",
      "desc": "音声配信・ラジオトーク",
      "tag": "Audio",
      "icon": "podcast",
      "enabled": true,
      "featured": false
    },
    {
      "id": "link_1790158924037",
      "title": "公式ウェブサイト",
      "url": "https://azarin.me",
      "desc": "ウェブサイト",
      "tag": "Official",
      "icon": "link",
      "enabled": true,
      "featured": false
    }
  ],
  "admin": {
    "passcode": "azarin2026"
  }
};

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
