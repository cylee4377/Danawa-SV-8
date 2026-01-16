import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, TrendingUp, ArrowUp, ArrowDown, Minus } from "lucide-react";
import type { RadarModel } from "@shared/schema";

interface RadarCardProps {
  model: RadarModel;
  rank: number;
}

export function RadarCard({ model, rank }: RadarCardProps) {
  const isNewEntry = model.prevSales === 0;
  const rankChangeDisplay = model.rankChange;
  
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  const formatPercent = (num: number) => {
    if (num >= 100) return "+100%+";
    return `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`;
  };

  const getRankBadgeVariant = () => {
    if (rank <= 3) return "default";
    if (rank <= 10) return "secondary";
    return "outline";
  };

  const getRankChangeIcon = () => {
    if (rankChangeDisplay > 0) {
      return <ArrowUp className="w-3.5 h-3.5" />;
    } else if (rankChangeDisplay < 0) {
      return <ArrowDown className="w-3.5 h-3.5" />;
    }
    return <Minus className="w-3.5 h-3.5" />;
  };

  const getRankChangeColor = () => {
    if (rankChangeDisplay > 0) return "text-emerald-600 dark:text-emerald-400";
    if (rankChangeDisplay < 0) return "text-red-500 dark:text-red-400";
    return "text-muted-foreground";
  };

  const getMomColor = () => {
    if (model.momAbs > 0) return "text-emerald-600 dark:text-emerald-400";
    if (model.momAbs < 0) return "text-red-500 dark:text-red-400";
    return "text-muted-foreground";
  };

  return (
    <Card className="hover-elevate active-elevate-2 transition-all duration-200" data-testid={`card-model-${model.id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Badge 
            variant={getRankBadgeVariant()} 
            className="shrink-0 min-w-[2.5rem] justify-center font-bold text-sm"
            data-testid={`badge-rank-${model.id}`}
          >
            {rank}
          </Badge>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground truncate text-base" data-testid={`text-model-name-${model.id}`}>
              {model.modelName}
            </h3>
            <p className="text-sm text-muted-foreground truncate" data-testid={`text-manufacturer-${model.id}`}>
              {model.manufacturer}
            </p>
          </div>
        </div>
        {isNewEntry && (
          <Badge variant="secondary" className="shrink-0 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0">
            NEW
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">이번달 판매량</p>
            <p className="text-lg font-bold text-foreground" data-testid={`text-sales-${model.id}`}>
              {formatNumber(model.sales)}
              <span className="text-xs font-normal text-muted-foreground ml-0.5">대</span>
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">전월대비</p>
            <div className={`text-lg font-bold flex items-center gap-1 ${getMomColor()}`} data-testid={`text-mom-${model.id}`}>
              <TrendingUp className="w-4 h-4" />
              <span>{model.momAbs >= 0 ? '+' : ''}{formatNumber(model.momAbs)}</span>
            </div>
            <p className={`text-xs font-medium ${getMomColor()}`}>
              {formatPercent(model.momPct * 100)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">랭크 변화</p>
            <div className={`text-lg font-bold flex items-center gap-1 ${getRankChangeColor()}`} data-testid={`text-rank-change-${model.id}`}>
              {getRankChangeIcon()}
              <span>{Math.abs(rankChangeDisplay)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {model.prevRank ? `${model.prevRank}위 → ${model.rank}위` : `${model.rank}위`}
            </p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full gap-2"
          asChild
          data-testid={`button-view-original-${model.id}`}
        >
          <a href={model.originalUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4" />
            다나와 원문 보기
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
