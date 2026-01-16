import { Car, TrendingUp, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";

interface RadarHeaderProps {
  lastUpdated?: string;
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

export function RadarHeader({ lastUpdated, isRefreshing, onRefresh }: RadarHeaderProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Car className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                판매 급상승 레이더
                <TrendingUp className="w-5 h-5 text-primary" />
              </h1>
              <p className="text-sm text-muted-foreground">
                다나와 기반 월간 판매실적 분석
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs text-muted-foreground hidden sm:block" data-testid="text-last-updated">
                최근 갱신: {formatDate(lastUpdated)}
              </span>
            )}
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isRefreshing}
                className="gap-2"
                data-testid="button-refresh"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">새로고침</span>
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
