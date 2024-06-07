export interface PieData {
  _id: string;
  value?: number;
  credit: number;
  debit: number;
  color?: string;
}

export interface PieNivoData {
  id: string;
  label: string;
  value: number;
}

export interface BarData {
  _id: {
    day?: number;
    month?: number;
    year?: number;
  };
  credit: number;
  debit: number;
}

export interface BarNivoData {
  date: string;
  credit: number;
  debit: number;
}
