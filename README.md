# Au Fil des Mers プレイヤー向けサイト

Discordゲーム「Au Fil des Mers」の公開案内、図解ガイド、西・中央・東の島マップの現在地ビューアです。
制作リポジトリ `game_afm` とは分け、GitHub Pages で静的配信するためのコピーです。

## 含めるもの

- ゲーム紹介
- プレイヤー向けガイド（遊び方、戦闘、成長など）
- プレイヤー向け説明画像18点
- 西・中央・東の島マップと現在地ビューア

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
https://tsukibo0805.github.io/game_afm_public/guide/images.html
https://tsukibo0805.github.io/game_afm_public/map/
```

Jekyll を使わないため、ルートに `.nojekyll` を置いてあります。

## 更新のしかた

正本は `game_afm` 側です。

- マップ試作: `tools/west-island-map-preview/`
- 案内文: `docs/ゲーム紹介.md` と `docs/ユーザー向け/`
- 説明画像: `docs/ユーザー向け/*.png`
- 三島の概略図: `image/maps/west-island.png`、`central-island.png`、`east-island.png`

更新したら、リポジトリルートで次を実行してこのフォルダを作り直します。

```bash
python3 tools/player-pages/build.py
```

生成後は、専用にcloneした公開リポジトリへ生成物を同期し、差分を確認してから公開します。次の例では公開リポジトリを隣のディレクトリへcloneしています。

```bash
git clone git@github.com:tsukibo0805/game_afm_public.git ../game_afm_public
python3 tools/player-pages/build.py
rsync -a --delete --exclude='.git/' --exclude='__pycache__/' tools/player-pages/ ../game_afm_public/
git -C ../game_afm_public diff --check
git -C ../game_afm_public status --short
```

`rsync --delete` は公開専用のcloneだけを対象にします。差分確認後、公開リポジトリ側でコミットして `main` へpushするとGitHub Pagesへ反映されます。公開リポジトリ上で `build.py` だけを実行しても、正本資料がないため再生成できません。

## 権利と利用条件

文章、コード、画像の利用条件は [RIGHTS.md](RIGHTS.md) を参照してください。
