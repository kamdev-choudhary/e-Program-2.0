export interface AdjustedScores {
  physics?: number;
  chemistry?: number;
  maths?: number;
  total?: number;
}

export interface CutOff {
  subject?: number;
  total?: number;
}

export interface DataProps {
  id?: string;
  name: string;
  uniqueId: string;
  category: "general" | "obc" | "st" | "sc" | "sc";
  pwd: "yes" | "no";
  physics_positive?: number;
  physics_negative?: number;
  physics: number;
  chemistry_positive?: number;
  chemistry_negative?: number;
  chemistry: number;
  maths_positive?: number;
  maths_negative?: number;
  maths: number;
  total_positive?: number;
  total_negative?: number;
  total: number;
  percetile?: number;
  rank?: number;
  isPhysicsQualified?: boolean;
  isChemistryQualified?: boolean;
  isMathsQualified?: boolean;
  isTotalQualified?: boolean;
  adjustedScores?: AdjustedScores;
  cutoff?: CutOff;
  airRank?: number | string | null | undefined;
  catRank?: number | string | null | undefined;
}

export interface SummaryProps {
  physicsQualified: DataProps[];
  chemistryQualified: DataProps[];
  mathsQualified: DataProps[];
  totalQualified: DataProps[];
  physicsDidNotQualified: DataProps[];
  chemistryDidNotQualified: DataProps[];
  mathsDidNotQualified: DataProps[];
  totalDidNotQualified: DataProps[];
  qualified: DataProps[];
  didNotQualified: DataProps[];
}

export interface CategoryProp {
  subject: number;
  total: number;
}

export interface CutoffDataProps {
  year: string | Number;
  examName: string;
  _id: string;
  general: CategoryProp;
  ews: CategoryProp;
  obc: CategoryProp;
  st: CategoryProp;
  sc: CategoryProp;
  generalPwD: CategoryProp;
  ewsPwD: CategoryProp;
  obcPwD: CategoryProp;
  stPwD: CategoryProp;
  scPwD: CategoryProp;
  preparatory: CategoryProp;
}

export interface YearsProps {
  name: string | number;
  value: string | number;
}
