export type Category = "A" | "B" | "C" | "D";
export type Option = { id: string; label: string; scores: Partial<Record<Category, number>> };
export type Question = { id: string; title: string; helper?: string; options: Option[] };
export type Answers = Record<string, string>;

export const LINE_URL = "https://utage-system.com/line/open/z2opchfuY1xZ?mtid=frfS13ZMAhFT";
export const SERVICES_URL = "https://x.gd/CAfZZ";

export const categories: Record<Category, { name: string }> = {
  A: { name: "第二新卒向け" },
  B: { name: "未経験転職向け" },
  C: { name: "営業・キャリアアップ向け" },
  D: { name: "ハイクラス向け" },
};

export const questions: Question[] = [
  {
    id: "age", title: "あなたの年齢を教えてください",
    options: [
      { id: "18-22", label: "18〜22歳", scores: { A: 4, B: 2 } },
      { id: "23-25", label: "23〜25歳", scores: { A: 4, B: 2, C: 1 } },
      { id: "26-29", label: "26〜29歳", scores: { B: 2, C: 3 } },
      { id: "30-34", label: "30〜34歳", scores: { C: 3, D: 2 } },
      { id: "35-plus", label: "35歳以上", scores: { C: 1, D: 4 } },
    ],
  },
  {
    id: "currentJob", title: "現在の職種を教えてください",
    options: [
      { id: "sales", label: "営業・販売", scores: { C: 4, D: 1 } },
      { id: "office", label: "事務・管理", scores: { B: 2, C: 1 } },
      { id: "it", label: "IT・エンジニア", scores: { C: 2, D: 3 } },
      { id: "service", label: "接客・サービス", scores: { A: 1, B: 3 } },
      { id: "other", label: "その他・離職中", scores: { A: 1, B: 2 } },
    ],
  },
  {
    id: "income", title: "現在の年収を教えてください", helper: "おおよその金額で構いません",
    options: [
      { id: "under-300", label: "300万円未満", scores: { A: 2, B: 3 } },
      { id: "300-399", label: "300〜399万円", scores: { A: 1, B: 2, C: 2 } },
      { id: "400-499", label: "400〜499万円", scores: { C: 3 } },
      { id: "500-699", label: "500〜699万円", scores: { C: 3, D: 2 } },
      { id: "700-plus", label: "700万円以上", scores: { D: 5 } },
    ],
  },
  {
    id: "timing", title: "いつ頃の転職を考えていますか？",
    options: [
      { id: "asap", label: "できるだけ早く", scores: { A: 1, B: 1, C: 1, D: 1 } },
      { id: "3-months", label: "3ヶ月以内", scores: { A: 1, B: 1, C: 1, D: 1 } },
      { id: "6-months", label: "半年以内", scores: { C: 1, D: 1 } },
      { id: "undecided", label: "時期は決めていない", scores: { A: 1, B: 1 } },
    ],
  },
  {
    id: "desiredJob", title: "希望する職種を教えてください",
    options: [
      { id: "sales", label: "営業・コンサル", scores: { C: 5, D: 1 } },
      { id: "office", label: "事務・管理", scores: { A: 1, B: 2 } },
      { id: "it", label: "IT・Web", scores: { B: 2, C: 2, D: 2 } },
      { id: "professional", label: "専門職・マネジメント", scores: { D: 5 } },
      { id: "undecided", label: "まだ決まっていない", scores: { A: 1, B: 3 } },
    ],
  },
  {
    id: "newField", title: "未経験の仕事にも挑戦したいですか？",
    options: [
      { id: "yes", label: "積極的に挑戦したい", scores: { B: 6 } },
      { id: "interested", label: "良い仕事があれば挑戦したい", scores: { A: 2, B: 4 } },
      { id: "no", label: "経験を活かしたい", scores: { C: 3, D: 3 } },
      { id: "unsure", label: "まだわからない", scores: { A: 2, B: 2 } },
    ],
  },
  {
    id: "priority", title: "転職で一番重視することは？",
    options: [
      { id: "income", label: "年収アップ", scores: { C: 3, D: 4 } },
      { id: "growth", label: "成長・キャリアアップ", scores: { C: 4, D: 2 } },
      { id: "balance", label: "働きやすさ・休日", scores: { A: 2, B: 2 } },
      { id: "fit", label: "自分に合う仕事", scores: { A: 2, B: 4 } },
    ],
  },
  {
    id: "concern", title: "現在、一番近い悩みはどれですか？",
    options: [
      { id: "first-change", label: "初めての転職で不安", scores: { A: 5 } },
      { id: "no-skill", label: "経験やスキルに自信がない", scores: { B: 5 } },
      { id: "income", label: "年収・評価が上がらない", scores: { C: 4, D: 2 } },
      { id: "next-level", label: "より高いポジションを目指したい", scores: { D: 5 } },
      { id: "no-idea", label: "何が向いているかわからない", scores: { A: 2, B: 3 } },
    ],
  },
];

// 各選択肢の scores を変更するだけで、診断ルールを調整できます。
export function diagnose(answers: Answers): Category {
  const totals: Record<Category, number> = { A: 0, B: 0, C: 0, D: 0 };
  for (const question of questions) {
    const selected = question.options.find((option) => option.id === answers[question.id]);
    if (!selected) continue;
    for (const category of Object.keys(selected.scores) as Category[]) {
      totals[category] += selected.scores[category] ?? 0;
    }
  }
  return (Object.entries(totals) as [Category, number][]).sort(
    ([categoryA, scoreA], [categoryB, scoreB]) => scoreB - scoreA || categoryA.localeCompare(categoryB),
  )[0][0];
}
