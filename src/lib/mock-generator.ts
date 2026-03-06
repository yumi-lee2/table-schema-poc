import { ColumnDef } from "./types";

const firstNames = ["김민수", "이서연", "박지훈", "최유진", "정현우", "강수빈", "조은서", "윤태호", "임하은", "한도윤"];
const lastNames = ["", "", "", "", "", "", "", "", "", ""];
const domains = ["gmail.com", "naver.com", "daum.net", "nhn.com", "kakao.com"];
const statuses = ["대기", "처리중", "완료", "취소", "반품"];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(startYear = 2023, endYear = 2025): string {
  const year = randomInt(startYear, endYear);
  const month = String(randomInt(1, 12)).padStart(2, "0");
  const day = String(randomInt(1, 28)).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function generateValue(col: ColumnDef, index: number): unknown {
  switch (col.type) {
    case "string": {
      if (col.key.toLowerCase().includes("email")) {
        const name = firstNames[index % firstNames.length];
        return `${name}@${domains[index % domains.length]}`;
      }
      if (col.key.toLowerCase().includes("name") || col.key.toLowerCase().includes("orderer")) {
        return firstNames[index % firstNames.length];
      }
      if (col.key.toLowerCase().includes("no") || col.key.toLowerCase().includes("number")) {
        return `ORD-${String(1000 + index).padStart(5, "0")}`;
      }
      return `${col.label}-${index + 1}`;
    }
    case "number": {
      if (col.key.toLowerCase().includes("age")) return randomInt(20, 60);
      if (col.key.toLowerCase().includes("amount") || col.key.toLowerCase().includes("price")) {
        return randomInt(10000, 500000);
      }
      return randomInt(1, 100);
    }
    case "date":
      return randomDate();
    case "boolean":
      return Math.random() > 0.3;
    case "select":
      return statuses[index % statuses.length];
    default:
      return `value-${index}`;
  }
}

export function generateMockData(columns: ColumnDef[], rowCount = 20): Record<string, unknown>[] {
  const sortedCols = [...columns].sort((a, b) => a.sequence - b.sequence);
  return Array.from({ length: rowCount }, (_, i) => {
    const row: Record<string, unknown> = { key: String(i) };
    for (const col of sortedCols) {
      row[col.key] = generateValue(col, i);
    }
    return row;
  });
}
