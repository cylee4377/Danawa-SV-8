import { Car, Search, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RadarEmptyProps {
  type: "no-data" | "no-results" | "error";
  onReset?: () => void;
}

export function RadarEmpty({ type, onReset }: RadarEmptyProps) {
  if (type === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <BarChart3 className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          데이터를 불러올 수 없습니다
        </h3>
        <p className="text-muted-foreground max-w-md mb-6">
          다나와 서버에서 데이터를 가져오는 중 오류가 발생했습니다.
          잠시 후 다시 시도해 주세요.
        </p>
        <Button onClick={() => window.location.reload()} data-testid="button-retry">
          다시 시도
        </Button>
      </div>
    );
  }

  if (type === "no-results") {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          조건에 맞는 모델이 없습니다
        </h3>
        <p className="text-muted-foreground max-w-md mb-6">
          필터 조건을 조정하시거나 초기화 버튼을 눌러 전체 결과를 확인해 보세요.
        </p>
        {onReset && (
          <Button variant="outline" onClick={onReset} data-testid="button-reset-empty">
            필터 초기화
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Car className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        데이터가 없습니다
      </h3>
      <p className="text-muted-foreground max-w-md">
        선택한 월에 대한 판매 데이터가 아직 없습니다.
        다른 월을 선택해 주세요.
      </p>
    </div>
  );
}
