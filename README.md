# Au Fil des Mers プレイヤー向けサイト

Discordゲーム「Au Fil des Mers」の公開案内と、島マップの現在地ビューアです。
制作リポジトリ `game_afm` とは分け、GitHub Pages で静的配信するためのコピーです。

## 含めるもの

- ゲーム紹介
- プレイヤー向けガイド（遊び方、戦闘、成長など）
- 西・中央・東の島マップビューア

含めないもの:

- ゲーム本体、Bot、ランタイムデータ
- 画像生成プロンプト、Discord告知原稿
- 実装・運用・ゲームデザインの内部資料

## GitHub Pages として公開する

このフォルダを公開リポジトリのルートにします。例:

```bash
cd tools/player-pages
git init
git add .
git commit -m "プレイヤー向け案内と島マップを公開する"
gh repo create tsukibo0805/game_afm_public --public --source=. --remote=origin --push
```

GitHub の Settings → Pages で、Source を `main` の `/ (root)` にします。
公開後の案内は次のURLになります。

```text
https://tsukibo0805.github.io/game_afm_public/
https://tsukibo0805.github.io/game_afm_public/map/
```

Jekyll を使わないため、ルートに `.nojekyll` を置いてあります。

## 更新のしかた

正本は `game_afm` 側です。

- マップ試作: `tools/west-island-map-preview/`
- 案内文: `docs/ゲーム紹介.md` と `docs/ユーザー向け/`

更新したら、リポジトリルートで次を実行してこのフォルダを作り直します。

```bash
python3 tools/player-pages/build.py
```
