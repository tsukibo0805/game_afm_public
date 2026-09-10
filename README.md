# Au Fil des Mers プレイヤー向けサイト

Discordゲーム「Au Fil des Mers」の公開案内、図解ガイド、スキル一覧、西・中央・東の島マップの現在地ビューアです。
制作リポジトリ `game_afm` とは分け、GitHub Pages で静的配信するためのコピーです。

## 含めるもの

- ゲーム紹介
- プレイヤー向けガイド（遊び方、戦闘、成長、装備と素材など）
- プレイヤー向け説明画像18点
- 西・中央・東の島マップと現在地ビューア
- 職業ツリーから探せる職業スキル一覧
- 装備一覧から探せる50・100ターン装備スキル一覧
- 犬・猫・鳥の系統別に探せる使い魔専用スキル一覧

含めないもの:

- ゲーム本体、Bot、ランタイムデータ
- 画像生成プロンプト、Discord告知原稿
- 実装・運用・ゲームデザインの内部資料

## GitHub Pages として公開する

このフォルダ一式を公開リポジトリのルートへ手動アップロードします。公開作業はユーザーが行い、AIは公開リポジトリのclone、commit、push、GitHub認証確認を行いません。

初回構築時は、ユーザーが公開リポジトリとGitHub Pagesを設定します。構成例:

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
https://tsukibo0805.github.io/game_afm_public/guide/images.html
https://tsukibo0805.github.io/game_afm_public/map/
https://tsukibo0805.github.io/game_afm_public/skills/
```

Jekyll を使わないため、ルートに `.nojekyll` を置いてあります。

## 更新のしかた

正本は `game_afm` 側です。

- マップ試作: `tools/west-island-map-preview/`
- スキル一覧の表示テンプレート: `tools/job-skills-preview/`
- スキル効果・習得方法の正本: `docs/ゲームデザイン/スキル一覧.md`
- 案内文: `docs/ゲーム紹介.md` と `docs/ユーザー向け/`
- 説明画像: `docs/ユーザー向け/*.png`
- 三島の概略図: `image/maps/west-island.png`、`central-island.png`、`east-island.png`

更新したら、リポジトリルートで次を実行してこのフォルダを作り直します。

```bash
python3 tools/player-pages/build.py
```

生成後は、ユーザーが `tools/player-pages/` 一式を手動アップロードします。スキルページは `skills/index.html`、`skills/catalog-data.js`、`skills/preview.js`、`skills/preview.css` が一組なので、一部だけを差し替えません。公開リポジトリ上で `build.py` だけを実行しても、正本資料がないため再生成できません。

AIの完了条件は次のとおりです。

- `python3 tools/player-pages/build.py` が成功している
- `python3 -m unittest tools/test_player_pages.py` が成功している
- JavaScript構文確認と生成差分確認が成功している
- ユーザーへ `tools/player-pages/` 一式が手動アップロード対象であると報告している

手動アップロードの完了連絡があるまで、公開済みとは扱いません。

## 権利と利用条件

文章、コード、画像の利用条件は [RIGHTS.md](RIGHTS.md) を参照してください。
