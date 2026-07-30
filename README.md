# 転職診断

スマートフォン向けの転職サービス診断サイトです。

## ローカル起動

```bash
npm install
npm run dev
```

## Vercel

このフォルダをVercelへアップロードすると、Next.jsプロジェクトとして自動検出されます。
ビルドコマンドは `npm run build`、出力設定はNext.jsの既定値を使用します。

質問、診断ルール、外部リンクは `config/diagnosis.ts` から変更できます。
