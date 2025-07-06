export type ChangeType = 'RISE' | 'FALL';
export type DailyVolumn = {
    code: string;
    englishName: string;
    koreanName: string;
    localName: string;
    pair: string;
    rank: number;
    signedChangePrice: number;
    signedChangeRate: number;
    volumePower: number;
};
export type DailyVolumnResponse = {
    markets: DailyVolumn[];
    lastUpdated: number;
};
//# sourceMappingURL=DailyVolumn.d.ts.map