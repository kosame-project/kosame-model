<div align="center">
<img width="214" height="70" alt="kosame" src="https://raw.githubusercontent.com/kosame-project/kosame-orm/main/src/logo/kosameMojiLogo.png" />
</div>

<div align="center">
  <h3>Drizzleをベースにした、Model駆動のORM。</h3>
</div>

[English README](./README.md)

[ドキュメント](https://kosame-documents.kosame-project.workers.dev/ja/)

## 特徴

- Drizzleの上に構築されたクラスベースのModel（`class User extends Model {}`）
- DbContext的なAPI（`context.users.find()`）とインスタンスメソッド（`user.save()`）の両方を提供
- アソシエーション（`hasMany`/`belongsTo`）はJOINを使わず、バッチクエリ（`IN (...)`）で解決
- Hooks: `beforeCreate` / `beforeUpdate` / `beforeDelete`
- ネスト対応のトランザクション（`context.transaction()`）、`afterCommit` / `afterRollback`
- Mixin機構（`SoftDeletable`等）
- zod（`drizzle-zod`）によるスキーマ検証。書き込み時・読み込み時どちらも実行
- 生のDrizzle `db`/`tx`へ抜けられるエスケープハッチ（`context.raw`）
- PostgreSQL・MySQL・SQLite（Cloudflare D1含む）に対応

## インストール

### bun

```bash
bun add kosame
```

### npm

```bash
npm install kosame
```

## エージェント用スキル

KosameにはClaude Codeなどのコーディングエージェントに、Kosameの書き方を教えるスキルが同梱されています。パッケージをインストールしたあと、次のコマンドでプロジェクトにコピーします。

```bash
npx kosame skills install --claude-md
```

スキルは`.claude/skills/kosame`に置かれ、`CLAUDE.md`にそれを指す1行が追加されます。`kosame`をアップグレードしたあとは、同じコマンドをもう一度実行するとスキルが更新されます。
