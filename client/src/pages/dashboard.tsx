import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { RadarHeader } from "@/components/radar-header";
import { RadarFilters } from "@/components/radar-filters";
import { RadarCard } from "@/components/radar-card";
import { RadarListSkeleton } from "@/components/radar-skeleton";
import { RadarEmpty } from "@/components/radar-empty";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Car, BarChart3 } from "lucide-react";
import type { RadarResponse, Nation, RadarModel } from "@shared/schema";

const DEFAULT_MIN_SALES = 300;

async function fetchRadarData(nation: Nation, month?: string): Promise<RadarResponse> {
  const params = new URLSearchParams({ nation });
  if (month) params.append("month", month);
  const res = await fetch(`/api/radar?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch radar data");
  return res.json();
}

export default function Dashboard() {
  const [nation, setNation] = useState<Nation>("domestic");
  const [month, setMonth] = useState<string>("");
  const [minSales, setMinSales] = useState<number>(DEFAULT_MIN_SALES);
  const [excludeNewEntries, setExcludeNewEntries] = useState<boolean>(false);

  const { data, isLoading, isError, refetch, isFetching } = useQuery<RadarResponse>({
    queryKey: ["/api/radar", nation, month],
    queryFn: () => fetchRadarData(nation, month || undefined),
  });

  const availableMonths = useMemo(() => {
    if (!data?.currentMonth) return [];
    const current = new Date();
    const months: string[] = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(current.getFullYear(), current.getMonth() - i, 1);
      months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-00`);
    }
    return months;
  }, [data?.currentMonth]);

  const currentMonth = month || data?.currentMonth || availableMonths[0] || "";

  const filteredModels = useMemo(() => {
    if (!data?.models) return [];
    
    return data.models
      .filter((model: RadarModel) => {
        if (model.sales < minSales) return false;
        if (excludeNewEntries && model.prevSales === 0) return false;
        return true;
      })
      .slice(0, 20);
  }, [data?.models, minSales, excludeNewEntries]);

  const stats = useMemo(() => {
    if (!data?.models) return null;
    
    const models = data.models.filter((m: RadarModel) => m.momAbs > 0);
    const totalRising = models.length;
    const avgGrowth = models.length > 0 
      ? models.reduce((acc: number, m: RadarModel) => acc + m.momPct, 0) / models.length 
      : 0;
    const topRiser = models[0];
    
    return { totalRising, avgGrowth, topRiser };
  }, [data?.models]);

  const handleReset = () => {
    setMinSales(DEFAULT_MIN_SALES);
    setExcludeNewEntries(false);
  };

  const formatMonth = (monthStr: string) => {
    const match = monthStr.match(/(\d{4})-(\d{2})/);
    if (match) {
      return `${match[1]}년 ${parseInt(match[2])}월`;
    }
    return monthStr;
  };

  return (
    <div className="min-h-screen bg-background">
      <RadarHeader 
        lastUpdated={data?.lastUpdated} 
        isRefreshing={isFetching}
        onRefresh={() => refetch()}
      />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {stats && !isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">급상승 모델</p>
                    <p className="text-2xl font-bold text-foreground" data-testid="stat-total-rising">
                      {stats.totalRising}
                      <span className="text-sm font-normal text-muted-foreground ml-1">개</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">평균 성장률</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400" data-testid="stat-avg-growth">
                      +{(stats.avgGrowth * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Car className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">1위 급상승</p>
                    <p className="text-lg font-bold text-foreground truncate max-w-[180px]" data-testid="stat-top-riser">
                      {stats.topRiser?.modelName || "-"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardContent className="pt-6">
            <RadarFilters
              nation={nation}
              onNationChange={setNation}
              month={currentMonth}
              onMonthChange={setMonth}
              availableMonths={availableMonths}
              minSales={minSales}
              onMinSalesChange={setMinSales}
              excludeNewEntries={excludeNewEntries}
              onExcludeNewEntriesChange={setExcludeNewEntries}
              onReset={handleReset}
            />
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">
              {nation === "domestic" ? "국산" : "수입"} Top 20 급상승 모델
            </h2>
            <Badge variant="secondary" className="text-xs">
              {formatMonth(currentMonth)}
            </Badge>
          </div>
          {!isLoading && data?.models && (
            <span className="text-sm text-muted-foreground" data-testid="text-result-count">
              {filteredModels.length}개 모델
            </span>
          )}
        </div>

        {isLoading ? (
          <RadarListSkeleton count={6} />
        ) : isError ? (
          <RadarEmpty type="error" />
        ) : filteredModels.length === 0 ? (
          <RadarEmpty type="no-results" onReset={handleReset} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModels.map((model: RadarModel, index: number) => (
              <RadarCard key={model.id} model={model} rank={index + 1} />
            ))}
          </div>
        )}
        
        <footer className="pt-8 pb-4 text-center">
          <p className="text-xs text-muted-foreground">
            본 서비스는 다나와 판매실적 데이터를 기반으로 급상승 점수를 분석한 파생 지표입니다.
            <br />
            원본 데이터의 저작권은 다나와에 있으며, 자세한 정보는 원문 링크를 통해 확인해 주세요.
          </p>
        </footer>
      </main>
    </div>
  );
}
