const jobIds = {
  "騎士": "job-knight",
  "武術家": "job-martial-artist",
  "武神": "job-war-god",
  "修羅": "job-asura",
  "ガーディアン": "job-guardian",
  "ディバインナイト": "job-divine-knight",
  "ルーンナイト": "job-rune-knight",
  "魔術師": "job-mage",
  "錬金術師": "job-alchemist",
  "星術師": "job-astrologer",
  "賢者": "job-sage",
  "アルカニスト": "job-arcanist",
  "妖術師": "job-sorcerer",
  "道化師": "job-jester",
  "僧侶": "job-cleric",
  "神官": "job-priest",
  "ビショップ": "job-bishop",
  "インクイジター": "job-inquisitor",
  "エクソシスト": "job-exorcist",
  "呪術師": "job-hexer",
  "憑霊師": "job-medium"
};

const makeSkill = (name, effect, battleCount, activation, ...tags) => ({
  name,
  effect,
  battleCount,
  activation,
  tags
});

const skillDetails = Object.freeze({
  "2回攻撃": {"id": "skill-0001","battleCount": 3,"activation": "A","equipment": "武器","effect": "敵ランダムへ（力100%・装備武器区分）×技威力1.2・2回（各ヒット再抽選）"},
  "かばう": {"id": "skill-0002","battleCount": 6,"activation": "A","equipment": "不要","effect": "味方への次の敵攻撃をかばう"},
  "範囲攻撃": {"id": "skill-0003","battleCount": 9,"activation": "A","equipment": "武器","effect": "敵全体へ（力100%・装備武器区分）×技威力0.3"},
  "ためる": {"id": "skill-0004","battleCount": 12,"activation": "A","equipment": "不要","effect": "次の力依存行動の力成分を2.1倍"},
  "チャージ攻撃": {"id": "skill-0005","battleCount": 15,"activation": "S1","equipment": "武器","effect": "敵全体へ（力100%・装備武器区分）×技威力1.2"},
  "連続魔法": {"id": "skill-0006","battleCount": 3,"activation": "A","equipment": "不要","effect": "敵ランダムへ（魔力100%・装備魔石属性/無属性）×技威力1・2回（各ヒット再抽選）"},
  "フィールド展開": {"id": "skill-0007","battleCount": 6,"activation": "A","equipment": "魔石","effect": "装備魔石属性フィールドを展開"},
  "全体魔法": {"id": "skill-0008","battleCount": 9,"activation": "A","equipment": "不要","effect": "敵全体へ（魔力100%・装備魔石属性/無属性）×技威力0.25"},
  "フィールドキャンセル": {"id": "skill-0009","battleCount": 12,"activation": "A","equipment": "魔石","effect": "装備魔石属性フィールドを解除"},
  "詠唱魔法": {"id": "skill-0010","battleCount": 15,"activation": "S1","equipment": "不要","effect": "敵単体へ（魔力100%・装備魔石属性/無属性）×技威力4.5"},
  "回復魔法": {"id": "skill-0011","battleCount": 3,"activation": "A","equipment": "不要","effect": "HP欠損率最大の味方1人を回復：（霊感100%）×回復力2.5"},
  "毎ターン回復": {"id": "skill-0012","battleCount": 6,"activation": "A","equipment": "不要","effect": "味方全体へ継続回復：（霊感100%）・能力1につき最大HPの0.8%（上限15%）"},
  "蘇生術": {"id": "skill-0013","battleCount": 9,"activation": "A","equipment": "不要","effect": "戦闘不能の味方1人を蘇生：（霊感100%）・能力1につき最大HPの2.5%"},
  "霊撃": {"id": "skill-0014","battleCount": 12,"activation": "A","equipment": "霊符","effect": "敵単体へ（霊感100%・装備霊符属性）×技威力1.2"},
  "大回復魔法": {"id": "skill-0015","battleCount": 15,"activation": "S1","equipment": "不要","effect": "味方全体を回復：（霊感100%）・能力1につき最大HPの8%（上限100%）"},
  "三連撃": {"id": "skill-0016","battleCount": 3,"activation": "A","equipment": "不要","effect": "敵単体へ（力100%・装備武器区分/近距離）×技威力1.65・3回"},
  "浮身崩し": {"id": "skill-0017","battleCount": 6,"activation": "A","equipment": "不要","effect": "敵単体を一時的にリフト姿勢へ変更"},
  "ショックウェイブ": {"id": "skill-0018","battleCount": 9,"activation": "A","equipment": "不要","effect": "敵全体へ（力100%・近距離）×技威力0.25"},
  "積極姿勢": {"id": "skill-0019","battleCount": 12,"activation": "P","equipment": "不要","effect": "積極姿勢を付与"},
  "全体2回攻撃": {"id": "skill-0020","battleCount": 15,"activation": "S2","equipment": "不要","effect": "敵全体へ（力100%・装備武器区分/近距離）×技威力3・2回"},
  "パリィ": {"id": "skill-0021","battleCount": 3,"activation": "A","equipment": "不要","effect": "次の敵攻撃を受け流し、被ダメージを0.4倍"},
  "カウンター": {"id": "skill-0022","battleCount": 6,"activation": "A","equipment": "不要","effect": "次の敵攻撃を0.5倍に軽減して反撃：（力100%・装備武器区分/近距離）×技威力1.5"},
  "魔バリア": {"id": "skill-0023","battleCount": 9,"activation": "A","equipment": "魔石","effect": "味方側へ装備魔石属性障壁"},
  "慎重姿勢": {"id": "skill-0024","battleCount": 12,"activation": "P","equipment": "不要","effect": "慎重姿勢を付与"},
  "ハルモニアンシールド": {"id": "skill-0025","battleCount": 15,"activation": "S2","equipment": "魔石＋霊符","effect": "味方側へ装備魔石属性障壁 → 味方側へ装備霊符属性障壁"},
  "三連魔法": {"id": "skill-0026","battleCount": 3,"activation": "A","equipment": "不要","effect": "敵単体へ（魔力100%・装備魔石属性/無属性）×技威力1.65・3回"},
  "魔力収束": {"id": "skill-0027","battleCount": 6,"activation": "A","equipment": "魔石","effect": "次の魔力依存行動の魔力成分を2.1倍"},
  "属性強化全体攻撃": {"id": "skill-0028","battleCount": 9,"activation": "A","equipment": "魔石","effect": "敵全体へ（魔力100%・装備魔石属性）×技威力0.25"},
  "クイック": {"id": "skill-0029","battleCount": 12,"activation": "A","equipment": "不要","effect": "自身を次ターン先頭へ予約"},
  "高等変成術": {"id": "skill-0030","battleCount": 15,"activation": "S2","equipment": "魔石","effect": "敵単体へ（魔力100%・装備魔石属性）×技威力11"},
  "魔相転換": {"id": "skill-0031","battleCount": 3,"activation": "A","equipment": "魔石","effect": "装備魔石属性フィールドを別の魔法属性へ変成"},
  "カード投げ": {"id": "skill-0032","battleCount": 6,"activation": "A","equipment": "不要","effect": "敵単体へ（力70%・無属性＋魔力30%・装備魔石属性/無属性）×技威力2.2"},
  "お札投げ": {"id": "skill-0033","battleCount": 9,"activation": "A","equipment": "不要","effect": "敵単体へ（力30%・無属性＋霊感70%・装備霊符属性/無属性）×技威力2.2"},
  "トラップ": {"id": "skill-0034","battleCount": 12,"activation": "A","equipment": "不要","effect": "敵単体へスタン"},
  "三相秘術": {"id": "skill-0035","battleCount": 15,"activation": "S2","equipment": "不要","effect": "敵全体へ（力25%・無属性＋魔力50%・装備魔石属性/無属性＋霊感25%・装備霊符属性/無属性）×技威力8"},
  "全体回復": {"id": "skill-0036","battleCount": 3,"activation": "A","equipment": "不要","effect": "味方全体を回復：（霊感100%）×回復力0.5"},
  "継続ダメージ解除": {"id": "skill-0037","battleCount": 6,"activation": "A","equipment": "不要","effect": "味方全体の継続ダメージを解除"},
  "スロウ": {"id": "skill-0038","battleCount": 9,"activation": "A","equipment": "不要","effect": "敵単体を次ターン最後へ予約"},
  "呪効果解除": {"id": "skill-0039","battleCount": 12,"activation": "A","equipment": "不要","effect": "味方全体の呪いを解除"},
  "裁きの祈り": {"id": "skill-0040","battleCount": 15,"activation": "S2","equipment": "霊符","effect": "敵単体へ（霊感100%・装備霊符属性）×技威力11"},
  "霊壁展開": {"id": "skill-0041","battleCount": 3,"activation": "A","equipment": "霊符","effect": "味方側へ装備霊符属性障壁"},
  "魂返し": {"id": "skill-0042","battleCount": 6,"activation": "A","equipment": "不要","effect": "次の敵攻撃を0.5倍に軽減して反撃：（霊感100%・装備霊符属性/無属性）×技威力1.5"},
  "3連続攻撃": {"id": "skill-0043","battleCount": 9,"activation": "A","equipment": "不要","effect": "敵ランダムへ（霊感100%・装備霊符属性/無属性）×技威力1.65・3回（各ヒット再抽選）"},
  "魔力変換": {"id": "skill-0044","battleCount": 12,"activation": "A","equipment": "不要","effect": "戦闘中、魔力を霊感へ変換"},
  "大降霊": {"id": "skill-0045","battleCount": 15,"activation": "S2","equipment": "不要","effect": "敵全体へ（霊感100%・装備霊符属性/無属性）×技威力8"},
  "装心解放": {"id": "skill-0127","battleCount": 3,"activation": "A","equipment": "武器","effect": "敵単体へ（力100%・装備武器区分）×技威力2.8"},
  "連環破": {"id": "skill-0128","battleCount": 6,"activation": "A","equipment": "武器","effect": "敵単体へ（力100%・装備武器区分）×技威力2.4・4回"},
  "無拍子": {"id": "skill-0129","battleCount": 9,"activation": "A","equipment": "不要","effect": "自身を次ターン先頭へ予約"},
  "極点破": {"id": "skill-0130","battleCount": 12,"activation": "S1","equipment": "武器","effect": "敵単体へ（力100%・装備武器区分・近/中/遠スレイヤー）×技威力4.5"},
  "武神顕現": {"id": "skill-0131","battleCount": 15,"activation": "S3","equipment": "武器","effect": "敵単体へ（力100%・装備武器区分）×技威力10・5回"},
  "刹那連撃": {"id": "skill-0132","battleCount": 3,"activation": "A","equipment": "不要","effect": "敵ランダムへ（力100%・無属性）×技威力3・4回（各ヒット再抽選）"},
  "血路開き": {"id": "skill-0133","battleCount": 6,"activation": "A","equipment": "不要","effect": "敵全体へ（力100%・無属性）×技威力2 → 自身の現在HPを30%消費"},
  "死線撃": {"id": "skill-0134","battleCount": 9,"activation": "A","equipment": "不要","effect": "敵単体へ（力100%・無属性）×技威力2.4・自身の欠損HP率で増幅"},
  "狂乱舞": {"id": "skill-0135","battleCount": 12,"activation": "S1","equipment": "不要","effect": "敵ランダムへ（力100%・無属性）×技威力5.4・6回（各ヒット再抽選） → 自身の現在HPを30%消費"},
  "修羅界": {"id": "skill-0136","battleCount": 15,"activation": "S3","equipment": "不要","effect": "敵全体へ（力100%・無属性）×技威力4・3回・自身の欠損HP率で増幅"},
  "霊装撃": {"id": "skill-0137","battleCount": 3,"activation": "A","equipment": "武器/霊符","effect": "敵単体へ（力70%・装備武器区分＋霊感30%・装備霊符属性）×技威力3"},
  "献身護法": {"id": "skill-0138","battleCount": 6,"activation": "A","equipment": "不要","effect": "自身を回復：（霊感100%）×回復力2 → 味方への次の敵攻撃をかばう"},
  "霊護結界": {"id": "skill-0139","battleCount": 9,"activation": "A","equipment": "霊符","effect": "味方側へ装備霊符属性障壁"},
  "神気反照": {"id": "skill-0140","battleCount": 12,"activation": "A","equipment": "武器/霊符","effect": "次の敵攻撃を0.4倍に軽減して反撃：（力70%・装備武器区分＋霊感30%・装備霊符属性）×技威力2.4"},
  "神威両断": {"id": "skill-0141","battleCount": 15,"activation": "S3","equipment": "武器/霊符","effect": "敵単体へ（力70%・装備武器区分＋霊感30%・装備霊符属性）×技威力8 → 味方全体を回復：（霊感100%）×回復力1"},
  "魔の衝撃": {"id": "skill-0142","battleCount": 3,"activation": "A","equipment": "武器/魔石","effect": "敵単体へ（力70%・装備武器区分＋魔力30%・装備魔石属性）×技威力3"},
  "刻印展開": {"id": "skill-0143","battleCount": 6,"activation": "A","equipment": "武器/魔石","effect": "装備魔石属性フィールドを展開 → 敵単体へ（力70%・装備武器区分＋魔力30%・装備魔石属性）×技威力1.8"},
  "ルーンシールド": {"id": "skill-0144","battleCount": 9,"activation": "A","equipment": "不要","effect": "次ターン、風・火・水・大地レジスト"},
  "エレメンタルフュージョン": {"id": "skill-0145","battleCount": 12,"activation": "S1","equipment": "武器/魔石","effect": "敵全体へ（力70%・装備武器区分＋魔力30%・装備魔石属性・風/火/水/大地スレイヤー）×技威力3.8"},
  "刻印解放": {"id": "skill-0146","battleCount": 15,"activation": "S3","equipment": "武器/魔石","effect": "敵単体へ（力70%・装備武器区分＋魔力30%・装備魔石属性）×技威力10・3回"},
  "隕石": {"id": "skill-0147","battleCount": 3,"activation": "A","equipment": "不要","effect": "敵単体へ（魔力100%・無属性）×技威力2.4・3回"},
  "流星雨": {"id": "skill-0148","battleCount": 6,"activation": "S1","equipment": "不要","effect": "敵ランダムへ（魔力100%・無属性）×技威力5・6回（各ヒット再抽選）"},
  "グラビトンフィールド": {"id": "skill-0149","battleCount": 9,"activation": "A","equipment": "不要","effect": "敵全体を一時的にダウン姿勢へ変更"},
  "エレメンタルスター": {"id": "skill-0150","battleCount": 12,"activation": "S2","equipment": "魔石","effect": "敵単体へ（魔力100%・装備魔石属性）×技威力8・2回"},
  "天球崩壊": {"id": "skill-0151","battleCount": 15,"activation": "S4","equipment": "不要","effect": "敵全体へ（魔力100%・無属性）×技威力10・3回"},
  "精霊解放": {"id": "skill-0152","battleCount": 3,"activation": "A","equipment": "魔石","effect": "敵単体へ（魔力100%・装備魔石属性）×技威力3"},
  "浄化術": {"id": "skill-0153","battleCount": 6,"activation": "A","equipment": "不要","effect": "味方全体の継続ダメージを解除 → 味方全体の呪いを解除"},
  "命の秘薬": {"id": "skill-0154","battleCount": 9,"activation": "A","equipment": "不要","effect": "味方全体を回復：（魔力100%）×回復力0.8"},
  "精霊への枷": {"id": "skill-0155","battleCount": 12,"activation": "S1","equipment": "魔石","effect": "風・火・水・大地フィールドを装備魔石属性へ置換"},
  "アルス・マグナ": {"id": "skill-0156","battleCount": 15,"activation": "S3","equipment": "魔石","effect": "敵全体へ（魔力100%・装備魔石属性（非隣接スレイヤー））×技威力8・2回"},
  "ファントムビュレット": {"id": "skill-0157","battleCount": 3,"activation": "A","equipment": "霊符/魔石","effect": "敵単体へ（霊感70%・装備霊符属性＋魔力30%・装備魔石属性）×技威力3"},
  "瘴気の手": {"id": "skill-0158","battleCount": 6,"activation": "A","equipment": "霊符/魔石","effect": "敵単体へ（霊感70%・装備霊符属性＋魔力30%・装備魔石属性）×技威力1.8 → 命中対象へ継続ダメージ：（霊感70%＋魔力30%）×継続威力0.4"},
  "金縛り": {"id": "skill-0159","battleCount": 9,"activation": "A","equipment": "不要","effect": "敵単体へスタン"},
  "異空の狭間": {"id": "skill-0160","battleCount": 12,"activation": "S1","equipment": "不要","effect": "敵全体へスタン"},
  "百鬼夜行": {"id": "skill-0161","battleCount": 15,"activation": "S3","equipment": "霊符/魔石","effect": "敵全体へ（霊感70%・装備霊符属性＋魔力30%・装備魔石属性）×技威力6・2回 → 命中対象へ継続ダメージ：（霊感70%＋魔力30%）×継続威力0.6"},
  "ワイルドカード": {"id": "skill-0162","battleCount": 3,"activation": "A","equipment": "武器/魔石","effect": "敵ランダムへ（魔力70%・装備魔石属性＋力30%・装備武器区分）×技威力2.4・4回（各ヒット再抽選）"},
  "ディレイトリック": {"id": "skill-0163","battleCount": 6,"activation": "A","equipment": "不要","effect": "敵単体を次ターン最後へ予約"},
  "ミスディレクション": {"id": "skill-0164","battleCount": 9,"activation": "A","equipment": "不要","effect": "自身へ幻影"},
  "びっくり箱": {"id": "skill-0165","battleCount": 12,"activation": "S1","equipment": "武器/魔石","effect": "敵全体へ（魔力70%・装備魔石属性＋力30%・装備武器区分）×技威力2 → 命中対象へスタン"},
  "グランドフィナーレ": {"id": "skill-0166","battleCount": 15,"activation": "S3","equipment": "武器/魔石","effect": "敵ランダムへ（魔力70%・装備魔石属性＋力30%・装備武器区分）×技威力8・10回（各ヒット再抽選）"},
  "魂の叫び": {"id": "skill-0167","battleCount": 3,"activation": "A","equipment": "不要","effect": "敵単体へ（霊感100%・装備霊符属性/無属性）×技威力2.8"},
  "恩寵": {"id": "skill-0168","battleCount": 6,"activation": "A","equipment": "不要","effect": "HP欠損率最大の味方1人を回復：（霊感100%）×回復力2 → 回復対象へ祝福"},
  "ヒーリングフィールド": {"id": "skill-0169","battleCount": 9,"activation": "S1","equipment": "不要","effect": "味方全体を回復：（霊感100%）・能力1につき最大HPの4%（上限100%）"},
  "復活の鐘": {"id": "skill-0170","battleCount": 12,"activation": "S1","equipment": "不要","effect": "味方全体を蘇生：（霊感100%）・能力1につき最大HPの2.5% → 蘇生対象へ継続回復：（霊感100%）・能力1につき最大HPの15%（上限15%）"},
  "葬炎": {"id": "skill-0171","battleCount": 15,"activation": "S3","equipment": "不要","effect": "敵全体へ（霊感100%・装備霊符属性/無属性）×技威力6 → 味方全体を回復：（霊感100%）×回復力1.5"},
  "二律裁定": {"id": "skill-0172","battleCount": 3,"activation": "A","equipment": "不要","effect": "敵単体へ（霊感100%・聖）×技威力1.4 → 敵単体へ（霊感100%・邪）×技威力1.4"},
  "沈黙の楔": {"id": "skill-0173","battleCount": 6,"activation": "A","equipment": "不要","effect": "敵単体へ（霊感100%・装備霊符属性/無属性）×技威力1.8 → 命中対象へ攻撃封印"},
  "贖罪": {"id": "skill-0174","battleCount": 9,"activation": "A","equipment": "不要","effect": "敵単体へ（霊感100%・装備霊符属性/無属性）×技威力2.4 → 命中対象への実ダメージの50%を吸収"},
  "異端審問": {"id": "skill-0175","battleCount": 12,"activation": "S1","equipment": "不要","effect": "敵全体へ（霊感100%・装備霊符属性/無属性・聖/邪スレイヤー）×技威力3.2"},
  "最後の審判": {"id": "skill-0176","battleCount": 15,"activation": "S3","equipment": "不要","effect": "敵全体へ（霊感100%・装備霊符属性/無属性）×技威力6・2回 → 命中対象へ呪い（反動40%）"},
  "呪刻": {"id": "skill-0177","battleCount": 3,"activation": "A","equipment": "武器/霊符","effect": "敵単体へ（霊感70%・装備霊符属性＋力30%・装備武器区分）×技威力3"},
  "衰微の印": {"id": "skill-0178","battleCount": 6,"activation": "A","equipment": "武器/霊符","effect": "敵単体へ（霊感70%・装備霊符属性＋力30%・装備武器区分）×技威力1.8 → 命中対象へ継続ダメージ：（霊感70%＋力30%）×継続威力0.4"},
  "封殺の印": {"id": "skill-0179","battleCount": 9,"activation": "A","equipment": "武器/霊符","effect": "敵単体へ（霊感70%・装備霊符属性＋力30%・装備武器区分）×技威力1.8 → 命中対象へ攻撃封印"},
  "因果応報": {"id": "skill-0180","battleCount": 12,"activation": "A","equipment": "武器/霊符","effect": "次の敵攻撃に反撃：（霊感70%・装備霊符属性＋力30%・装備武器区分）×技威力2"},
  "呪殺陣": {"id": "skill-0181","battleCount": 15,"activation": "S3","equipment": "武器/霊符","effect": "敵全体へ（霊感70%・装備霊符属性＋力30%・装備武器区分）×技威力6・2回 → 命中対象へ呪い（反動40%）"},
  "魂討ち": {"id": "skill-0182","battleCount": 3,"activation": "A","equipment": "霊符/魔石","effect": "敵単体へ（霊感70%・装備霊符属性＋魔力30%・装備魔石属性）×技威力3"},
  "身代わり霊": {"id": "skill-0183","battleCount": 6,"activation": "A","equipment": "不要","effect": "自身以外のHP欠損率最大の味方1人へ幻影"},
  "憑依治療": {"id": "skill-0184","battleCount": 9,"activation": "A","equipment": "不要","effect": "自身以外のHP欠損率最大の味方1人と現在HPを交換"},
  "霊体反照": {"id": "skill-0185","battleCount": 12,"activation": "S2","equipment": "不要","effect": "敵全体へ自身の欠損HP比例ダメージ"},
  "幽界侵食": {"id": "skill-0186","battleCount": 15,"activation": "S3","equipment": "霊符/魔石","effect": "敵全体へ（霊感70%・装備霊符属性＋魔力30%・装備魔石属性）×技威力5・2回 → 味方全体へ幻影"}
});

const expertJobs = [
  {
    name: "武神",
    mark: "武",
    role: "力を極めた連撃の達人",
    parent: "武術家系",
    skills: [
      makeSkill("装心解放", "先頭の敵へ強力な一撃", 3, "A", "単体", "要: 武器"),
      makeSkill("連環破", "先頭の敵へ4連撃", 6, "A", "単体", "4回"),
      makeSkill("無拍子", "次の行動を先頭にする", 9, "A", "自分", "行動順"),
      makeSkill("極点破", "全間合いに強い大威力攻撃", 12, "S1", "単体", "全間合い"),
      makeSkill("武神顕現", "超強力な5連撃", 15, "S3", "単体", "5回")
    ]
  },
  {
    name: "修羅",
    mark: "修",
    role: "HPを代償に猛攻する闘士",
    parent: "武術家系",
    skills: [
      makeSkill("刹那連撃", "ランダムな敵へ無属性4連撃", 3, "A", "ランダム", "4回"),
      makeSkill("血路開き", "敵全体を攻撃しHPを消費", 6, "A", "敵全体", "HP消費"),
      makeSkill("死線撃", "HPが減るほど強くなる一撃", 9, "A", "単体", "欠損HP"),
      makeSkill("狂乱舞", "ランダム6連撃後にHPを消費", 12, "S1", "ランダム", "6回"),
      makeSkill("修羅界", "敵全体へ欠損HP比例の3連撃", 15, "S3", "敵全体", "3回")
    ]
  },
  {
    name: "ディバインナイト",
    mark: "聖",
    role: "武器と霊力で攻守を担う",
    parent: "ガーディアン系",
    skills: [
      makeSkill("霊装撃", "力と霊感を重ねた一撃", 3, "A", "単体", "複合"),
      makeSkill("献身護法", "自分を回復して味方をかばう", 6, "A", "自分", "かばう"),
      makeSkill("霊護結界", "霊符属性の障壁を展開", 9, "A", "味方", "障壁"),
      makeSkill("神気反照", "被害を抑えて複合反撃", 12, "A", "反撃", "複合"),
      makeSkill("神威両断", "大技の後に味方全体を回復", 15, "S3", "攻撃＋回復", "複合")
    ]
  },
  {
    name: "ルーンナイト",
    mark: "印",
    role: "武器と魔力を刻印で融合",
    parent: "ガーディアン系",
    skills: [
      makeSkill("魔の衝撃", "力と魔力を重ねた一撃", 3, "A", "単体", "複合"),
      makeSkill("刻印展開", "フィールド展開後に複合攻撃", 6, "A", "展開＋攻撃", "複合"),
      makeSkill("ルーンシールド", "次ターンの四属性耐性を付与", 9, "A", "味方", "耐性"),
      makeSkill("エレメンタルフュージョン", "四属性に強い全体攻撃", 12, "S1", "敵全体", "四属性"),
      makeSkill("刻印解放", "力魔複合の3連大技", 15, "S3", "単体", "3回")
    ]
  },
  {
    name: "星術師",
    mark: "星",
    role: "無属性の大魔法で制圧",
    parent: "錬金術師系",
    skills: [
      makeSkill("隕石", "敵1体へ無属性3連撃", 3, "A", "単体", "3回"),
      makeSkill("流星雨", "ランダムな敵へ6連撃", 6, "S1", "ランダム", "6回"),
      makeSkill("グラビトンフィールド", "敵全体の体勢を崩す", 9, "A", "敵全体", "ダウン"),
      makeSkill("エレメンタルスター", "魔石属性の強力な2連撃", 12, "S2", "単体", "2回"),
      makeSkill("天球崩壊", "敵全体へ無属性3連大魔法", 15, "S4", "敵全体", "3回")
    ]
  },
  {
    name: "賢者",
    mark: "賢",
    role: "精霊術と回復を使い分ける",
    parent: "錬金術師系",
    skills: [
      makeSkill("精霊解放", "魔石属性で敵1体を攻撃", 3, "A", "単体", "要: 魔石"),
      makeSkill("浄化術", "味方全体の継続被害と呪いを解除", 6, "A", "味方全体", "解除"),
      makeSkill("命の秘薬", "味方全体のHPを回復", 9, "A", "味方全体", "回復"),
      makeSkill("精霊への枷", "戦場を装備魔石の属性へ変える", 12, "S1", "戦場", "フィールド"),
      makeSkill("アルス・マグナ", "隣接外属性に強い全体2連撃", 15, "S3", "敵全体", "2回")
    ]
  },
  {
    name: "妖術師",
    mark: "妖",
    role: "魔力と霊感で敵を拘束",
    parent: "アルカニスト系",
    skills: [
      makeSkill("ファントムビュレット", "霊感と魔力を重ねた一撃", 3, "A", "単体", "複合"),
      makeSkill("瘴気の手", "攻撃し継続ダメージを与える", 6, "A", "単体", "継続"),
      makeSkill("金縛り", "敵1体を行動不能にする", 9, "A", "単体", "スタン"),
      makeSkill("異空の狭間", "敵全体を行動不能にする", 12, "S1", "敵全体", "スタン"),
      makeSkill("百鬼夜行", "全体攻撃と継続ダメージ", 15, "S3", "敵全体", "継続")
    ]
  },
  {
    name: "道化師",
    mark: "戯",
    role: "行動順と幻影で翻弄する",
    parent: "アルカニスト系",
    skills: [
      makeSkill("ワイルドカード", "魔力と力によるランダム4連撃", 3, "A", "ランダム", "4回"),
      makeSkill("ディレイトリック", "敵の次ターン行動を最後にする", 6, "A", "単体", "行動順"),
      makeSkill("ミスディレクション", "自分へ幻影を付与", 9, "A", "自分", "幻影"),
      makeSkill("びっくり箱", "敵全体を攻撃してスタン", 12, "S1", "敵全体", "スタン"),
      makeSkill("グランドフィナーレ", "ランダムな敵へ10連撃", 15, "S3", "ランダム", "10回")
    ]
  },
  {
    name: "ビショップ",
    mark: "祈",
    role: "回復と蘇生を極めた聖職者",
    parent: "神官系",
    skills: [
      makeSkill("魂の叫び", "霊符属性で敵1体を攻撃", 3, "A", "単体", "霊符/無"),
      makeSkill("恩寵", "傷の深い味方を回復し祝福", 6, "A", "味方単体", "祝福"),
      makeSkill("ヒーリングフィールド", "味方全体を大きく回復", 9, "S1", "味方全体", "回復"),
      makeSkill("復活の鐘", "倒れた味方全体を蘇生", 12, "S1", "味方全体", "蘇生"),
      makeSkill("葬炎", "全体攻撃後に味方全体を回復", 15, "S3", "攻撃＋回復", "霊符/無")
    ]
  },
  {
    name: "インクイジター",
    mark: "審",
    role: "聖邪の裁きと封印を操る",
    parent: "神官系",
    skills: [
      makeSkill("二律裁定", "聖と邪の2属性で連続攻撃", 3, "A", "単体", "聖＋邪"),
      makeSkill("沈黙の楔", "攻撃して敵の攻撃技を封じる", 6, "A", "単体", "封印"),
      makeSkill("贖罪", "与えたダメージの半分を吸収", 9, "A", "単体", "吸収"),
      makeSkill("異端審問", "聖邪に強い敵全体攻撃", 12, "S1", "敵全体", "聖邪"),
      makeSkill("最後の審判", "敵全体を2回攻撃して呪う", 15, "S3", "敵全体", "呪い")
    ]
  },
  {
    name: "呪術師",
    mark: "呪",
    role: "霊力と武器で呪いを刻む",
    parent: "エクソシスト系",
    skills: [
      makeSkill("呪刻", "霊感と力を重ねた一撃", 3, "A", "単体", "複合"),
      makeSkill("衰微の印", "攻撃し継続ダメージを与える", 6, "A", "単体", "継続"),
      makeSkill("封殺の印", "攻撃して敵の攻撃技を封じる", 9, "A", "単体", "封印"),
      makeSkill("因果応報", "欠損HPに応じた複合反撃", 12, "A", "反撃", "欠損HP"),
      makeSkill("呪殺陣", "敵全体を2回攻撃して呪う", 15, "S3", "敵全体", "呪い")
    ]
  },
  {
    name: "憑霊師",
    mark: "憑",
    role: "霊を憑けて生命力を操作",
    parent: "エクソシスト系",
    skills: [
      makeSkill("魂討ち", "霊感と魔力を重ねた一撃", 3, "A", "単体", "複合"),
      makeSkill("身代わり霊", "傷の深い味方へ幻影を付与", 6, "A", "味方単体", "幻影"),
      makeSkill("憑依治療", "味方1人と現在HPを交換", 9, "A", "味方単体", "HP交換"),
      makeSkill("霊体反照", "自分の欠損HPに応じ全体攻撃", 12, "S2", "敵全体", "欠損HP"),
      makeSkill("幽界侵食", "全体攻撃後に味方全体へ幻影", 15, "S3", "攻撃＋幻影", "複合")
    ]
  }
];

const skillProfiles = {
  "2回攻撃": ["武", "attr-weapon", "装備武器区分", "力"],
  "かばう": ["―", "attr-none", "属性なし", "なし"],
  "範囲攻撃": ["武", "attr-weapon", "装備武器区分", "力"],
  "ためる": ["―", "attr-none", "属性なし", "なし"],
  "チャージ攻撃": ["武", "attr-weapon", "装備武器区分", "力"],
  "連続魔法": ["魔/無", "attr-magic", "装備魔石属性／無属性", "魔力"],
  "フィールド展開": ["魔", "attr-magic", "装備魔石属性", "なし"],
  "全体魔法": ["魔/無", "attr-magic", "装備魔石属性／無属性", "魔力"],
  "フィールドキャンセル": ["魔", "attr-magic", "装備魔石属性", "なし"],
  "詠唱魔法": ["魔/無", "attr-magic", "装備魔石属性／無属性", "魔力"],
  "回復魔法": ["―", "attr-none", "属性なし", "霊感"],
  "毎ターン回復": ["―", "attr-none", "属性なし", "霊感"],
  "蘇生術": ["―", "attr-none", "属性なし", "霊感"],
  "霊撃": ["霊", "attr-spirit", "装備霊符属性", "霊感"],
  "大回復魔法": ["―", "attr-none", "属性なし", "霊感"],
  "三連撃": ["武/近", "attr-weapon", "装備武器区分／近距離", "力"],
  "浮身崩し": ["―", "attr-none", "属性なし", "なし"],
  "ショックウェイブ": ["近", "attr-close", "近距離", "力"],
  "積極姿勢": ["―", "attr-none", "属性なし", "なし"],
  "全体2回攻撃": ["武/近", "attr-weapon", "装備武器区分／近距離", "力"],
  "パリィ": ["―", "attr-none", "属性なし", "なし"],
  "カウンター": ["武/近", "attr-weapon", "装備武器区分／近距離", "力"],
  "魔バリア": ["魔", "attr-magic", "装備魔石属性", "なし"],
  "慎重姿勢": ["―", "attr-none", "属性なし", "なし"],
  "ハルモニアンシールド": ["魔+霊", "attr-mixed", "装備魔石属性＋装備霊符属性", "なし"],
  "三連魔法": ["魔/無", "attr-magic", "装備魔石属性／無属性", "魔力"],
  "魔力収束": ["―", "attr-none", "属性なし", "なし"],
  "属性強化全体攻撃": ["魔", "attr-magic", "装備魔石属性", "魔力"],
  "クイック": ["―", "attr-none", "属性なし", "なし"],
  "高等変成術": ["魔", "attr-magic", "装備魔石属性", "魔力"],
  "魔相転換": ["―", "attr-none", "属性なし", "なし"],
  "カード投げ": ["複", "attr-mixed", "無属性＋装備魔石属性／無属性", "力70%＋魔力30%"],
  "お札投げ": ["複", "attr-mixed", "無属性＋装備霊符属性／無属性", "力30%＋霊感70%"],
  "トラップ": ["―", "attr-none", "属性なし", "なし"],
  "三相秘術": ["複", "attr-mixed", "無属性＋装備魔石属性／無属性＋装備霊符属性／無属性", "力25%＋魔力50%＋霊感25%"],
  "全体回復": ["―", "attr-none", "属性なし", "霊感"],
  "継続ダメージ解除": ["―", "attr-none", "属性なし", "なし"],
  "スロウ": ["―", "attr-none", "属性なし", "なし"],
  "呪効果解除": ["―", "attr-none", "属性なし", "なし"],
  "裁きの祈り": ["霊", "attr-spirit", "装備霊符属性", "霊感"],
  "霊壁展開": ["霊", "attr-spirit", "装備霊符属性", "なし"],
  "魂返し": ["霊/無", "attr-spirit", "装備霊符属性／無属性", "霊感"],
  "3連続攻撃": ["霊/無", "attr-spirit", "装備霊符属性／無属性", "霊感"],
  "魔力変換": ["―", "attr-none", "属性なし", "なし"],
  "大降霊": ["霊/無", "attr-spirit", "装備霊符属性／無属性", "霊感"],
  "装心解放": ["武", "attr-weapon", "装備武器区分", "力"],
  "連環破": ["武", "attr-weapon", "装備武器区分", "力"],
  "無拍子": ["―", "attr-none", "属性なし", "なし"],
  "極点破": ["武", "attr-weapon", "装備武器区分（近中遠スレイヤー）", "力"],
  "武神顕現": ["武", "attr-weapon", "装備武器区分", "力"],
  "刹那連撃": ["無", "attr-neutral", "無属性", "力"],
  "血路開き": ["無", "attr-neutral", "無属性", "力"],
  "死線撃": ["無", "attr-neutral", "無属性", "力"],
  "狂乱舞": ["無", "attr-neutral", "無属性", "力"],
  "修羅界": ["無", "attr-neutral", "無属性", "力"],
  "霊装撃": ["複", "attr-mixed", "装備武器区分＋装備霊符属性", "力70%＋霊感30%"],
  "献身護法": ["―", "attr-none", "属性なし", "霊感"],
  "霊護結界": ["霊", "attr-spirit", "装備霊符属性", "なし"],
  "神気反照": ["複", "attr-mixed", "装備武器区分＋装備霊符属性", "力70%＋霊感30%"],
  "神威両断": ["複", "attr-mixed", "装備武器区分＋装備霊符属性", "力70%＋霊感30%"],
  "魔の衝撃": ["複", "attr-mixed", "装備武器区分＋装備魔石属性", "力70%＋魔力30%"],
  "刻印展開": ["複", "attr-mixed", "装備魔石属性＋装備武器区分", "力70%＋魔力30%"],
  "ルーンシールド": ["―", "attr-none", "属性なし", "なし"],
  "エレメンタルフュージョン": ["複", "attr-mixed", "装備武器区分＋装備魔石属性（風火水土スレイヤー）", "力70%＋魔力30%"],
  "刻印解放": ["複", "attr-mixed", "装備武器区分＋装備魔石属性", "力70%＋魔力30%"],
  "隕石": ["無", "attr-neutral", "無属性", "魔力"],
  "流星雨": ["無", "attr-neutral", "無属性", "魔力"],
  "グラビトンフィールド": ["―", "attr-none", "属性なし", "なし"],
  "エレメンタルスター": ["魔", "attr-magic", "装備魔石属性", "魔力"],
  "天球崩壊": ["無", "attr-neutral", "無属性", "魔力"],
  "精霊解放": ["魔", "attr-magic", "装備魔石属性", "魔力"],
  "浄化術": ["―", "attr-none", "属性なし", "なし"],
  "命の秘薬": ["―", "attr-none", "属性なし", "魔力"],
  "精霊への枷": ["魔", "attr-magic", "装備魔石属性", "なし"],
  "アルス・マグナ": ["魔", "attr-magic", "装備魔石属性（隣接以外スレイヤー）", "魔力"],
  "ファントムビュレット": ["複", "attr-mixed", "装備霊符属性＋装備魔石属性", "霊感70%＋魔力30%"],
  "瘴気の手": ["複", "attr-mixed", "装備霊符属性＋装備魔石属性", "霊感70%＋魔力30%"],
  "金縛り": ["―", "attr-none", "属性なし", "なし"],
  "異空の狭間": ["―", "attr-none", "属性なし", "なし"],
  "百鬼夜行": ["複", "attr-mixed", "装備霊符属性＋装備魔石属性", "霊感70%＋魔力30%"],
  "ワイルドカード": ["複", "attr-mixed", "装備魔石属性＋装備武器区分", "魔力70%＋力30%"],
  "ディレイトリック": ["―", "attr-none", "属性なし", "なし"],
  "ミスディレクション": ["―", "attr-none", "属性なし", "なし"],
  "びっくり箱": ["複", "attr-mixed", "装備魔石属性＋装備武器区分", "魔力70%＋力30%"],
  "グランドフィナーレ": ["複", "attr-mixed", "装備魔石属性＋装備武器区分", "魔力70%＋力30%"],
  "魂の叫び": ["霊/無", "attr-spirit", "装備霊符属性／無属性", "霊感"],
  "恩寵": ["―", "attr-none", "属性なし", "霊感"],
  "ヒーリングフィールド": ["―", "attr-none", "属性なし", "霊感"],
  "復活の鐘": ["―", "attr-none", "属性なし", "霊感"],
  "葬炎": ["霊/無", "attr-spirit", "装備霊符属性／無属性", "霊感"],
  "二律裁定": ["聖+邪", "attr-mixed", "聖属性（固定）＋邪属性（固定）", "霊感"],
  "沈黙の楔": ["霊/無", "attr-spirit", "装備霊符属性／無属性", "霊感"],
  "贖罪": ["霊/無", "attr-spirit", "装備霊符属性／無属性", "霊感"],
  "異端審問": ["霊/無", "attr-spirit", "装備霊符属性／無属性（聖邪スレイヤー）", "霊感"],
  "最後の審判": ["霊/無", "attr-spirit", "装備霊符属性／無属性", "霊感"],
  "呪刻": ["複", "attr-mixed", "装備霊符属性＋装備武器区分", "霊感70%＋力30%"],
  "衰微の印": ["複", "attr-mixed", "装備霊符属性＋装備武器区分", "霊感70%＋力30%"],
  "封殺の印": ["複", "attr-mixed", "装備霊符属性＋装備武器区分", "霊感70%＋力30%"],
  "因果応報": ["複", "attr-mixed", "装備霊符属性＋装備武器区分", "霊感70%＋力30%"],
  "呪殺陣": ["複", "attr-mixed", "装備霊符属性＋装備武器区分", "霊感70%＋力30%"],
  "魂討ち": ["複", "attr-mixed", "装備霊符属性＋装備魔石属性", "霊感70%＋魔力30%"],
  "身代わり霊": ["―", "attr-none", "属性なし", "なし"],
  "憑依治療": ["―", "attr-none", "属性なし", "なし"],
  "霊体反照": ["―", "attr-none", "属性なし", "なし"],
  "幽界侵食": ["複", "attr-mixed", "装備霊符属性＋装備魔石属性", "霊感70%＋魔力30%"]
};

const jobsContainer = document.querySelector(".jobs");

expertJobs.forEach((job) => {
  const article = document.createElement("article");
  article.className = "job";
  article.dataset.tier = "expert";
  article.innerHTML = `
    <header class="job-header">
      <div class="job-mark" aria-hidden="true">${job.mark}</div>
      <div class="job-title">
        <h2>${job.name}</h2>
        <p>${job.role}</p>
      </div>
      <span class="tier">${job.parent}</span>
    </header>
    <ol class="skill-list">
      ${job.skills.map((skill) => `
        <li>
          <details class="skill">
            <summary>
              <span class="role-icon special" aria-hidden="true">◆</span>
              <span class="skill-name">${skill.name}</span>
              <span class="effect">${skill.effect}</span>
            </summary>
            <div class="skill-meta">
              <span class="badge">${skill.battleCount}戦</span>
              <span class="badge activation">${skill.activation}</span>
              ${skill.tags.map((tag) => `<span class="badge">${tag}</span>`).join("")}
            </div>
          </details>
        </li>
      `).join("")}
    </ol>
  `;
  jobsContainer.append(article);
});

document.querySelectorAll(".job").forEach((job) => {
  const jobName = job.querySelector("h2").textContent.trim();
  job.id = jobIds[jobName];
});

document.querySelectorAll(".skill").forEach((skill) => {
  const name = skill.querySelector(".skill-name").textContent.trim();
  const profile = skillProfiles[name];
  const detail = skillDetails[name];
  const icon = skill.querySelector(".role-icon");

  if (!profile || !detail) {
    return;
  }

  const [symbol, attributeClass, attributeLabel, powerSource] = profile;
  const attributeCell = document.createElement("span");
  const powerLabel = document.createElement("span");

  attributeCell.className = "attribute-cell";
  icon.className = `role-icon ${attributeClass}`;
  icon.textContent = symbol;
  icon.setAttribute("aria-label", `属性: ${attributeLabel}`);
  icon.title = `属性: ${attributeLabel}`;

  powerLabel.className = "power-source";
  powerLabel.textContent = powerSource === "なし" ? "PS ―" : `PS ${powerSource}`;
  powerLabel.title = `パワーソース: ${powerSource}`;

  icon.replaceWith(attributeCell);
  attributeCell.append(icon, powerLabel);

  const meta = skill.querySelector(".skill-meta");
  const attributeBadge = document.createElement("span");
  const powerBadge = document.createElement("span");

  attributeBadge.className = "badge";
  attributeBadge.textContent = `属性: ${attributeLabel}`;
  powerBadge.className = "badge";
  powerBadge.textContent = `PS: ${powerSource}`;
  meta.append(attributeBadge, powerBadge);

  const battleCountBadge = meta.querySelector(".badge");
  battleCountBadge.textContent = `${detail.battleCount}戦`;

  const detailPanel = document.createElement("div");
  const effectLabel = document.createElement("p");
  const effectText = document.createElement("p");
  const equipmentText = document.createElement("p");

  detailPanel.className = "skill-detail";
  effectLabel.className = "skill-detail-label";
  effectLabel.textContent = "効果・計算式";
  effectText.className = "skill-detail-effect";
  effectText.textContent = detail.effect;
  equipmentText.className = "skill-detail-equipment";
  equipmentText.textContent = `使用装備: ${detail.equipment}`;
  detailPanel.append(effectLabel, effectText, equipmentText);
  skill.append(detailPanel);
});

const filters = document.querySelectorAll("[data-filter]");
const jobs = document.querySelectorAll(".job");

document.querySelectorAll(".job-tree a[href^='#job-']").forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));

    if (!target) {
      return;
    }

    event.preventDefault();
    filters.forEach((filter) => {
      filter.setAttribute("aria-pressed", String(filter.dataset.filter === "all"));
    });
    jobs.forEach((job) => {
      job.hidden = false;
    });

    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", link.getAttribute("href"));
    });
  });
});

filters.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedTier = button.dataset.filter;

    filters.forEach((filter) => {
      filter.setAttribute("aria-pressed", String(filter === button));
    });

    jobs.forEach((job) => {
      job.hidden = selectedTier !== "all" && job.dataset.tier !== selectedTier;
    });
  });
});
