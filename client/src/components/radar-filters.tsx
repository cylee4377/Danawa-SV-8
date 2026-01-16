import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import type { Nation } from "@shared/schema";

interface RadarFiltersProps {
  nation: Nation;
  onNationChange: (nation: Nation) => void;
  month: string;
  onMonthChange: (month: string) => void;
  availableMonths: string[];
  minSales: number;
  onMinSalesChange: (value: number) => void;
  excludeNewEntries: boolean;
  onExcludeNewEntriesChange: (value: boolean) => void;
  onReset: () => void;
}

export function RadarFilters({
  nation,
  onNationChange,
  month,
  onMonthChange,
  availableMonths,
  minSales,
  onMinSalesChange,
  excludeNewEntries,
  onExcludeNewEntriesChange,
  onReset,
}: RadarFiltersProps) {
  const formatMonth = (monthStr: string) => {
    const match = monthStr.match(/(\d{4})-(\d{2})/);
    if (match) {
      return `${match[1]}년 ${parseInt(match[2])}월`;
    }
    return monthStr;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="space-y-2">
          <Label htmlFor="month-select" className="text-sm font-medium">기준 월</Label>
          <Select value={month} onValueChange={onMonthChange}>
            <SelectTrigger id="month-select" className="w-[160px]" data-testid="select-month">
              <SelectValue placeholder="월 선택" />
            </SelectTrigger>
            <SelectContent>
              {availableMonths.map((m) => (
                <SelectItem key={m} value={m} data-testid={`option-month-${m}`}>
                  {formatMonth(m)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">차량 구분</Label>
          <div className="flex gap-1 p-1 bg-muted rounded-md">
            <Button
              variant={nation === "domestic" ? "default" : "ghost"}
              size="sm"
              onClick={() => onNationChange("domestic")}
              className="min-w-[80px]"
              data-testid="button-nation-domestic"
            >
              국산
            </Button>
            <Button
              variant={nation === "export" ? "default" : "ghost"}
              size="sm"
              onClick={() => onNationChange("export")}
              className="min-w-[80px]"
              data-testid="button-nation-export"
            >
              수입
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-6">
        <div className="space-y-3 flex-1 min-w-[200px]">
          <div className="flex items-center justify-between">
            <Label htmlFor="min-sales-slider" className="text-sm font-medium">
              최소 판매량
            </Label>
            <span className="text-sm font-medium text-primary" data-testid="text-min-sales-value">
              {formatNumber(minSales)}대 이상
            </span>
          </div>
          <Slider
            id="min-sales-slider"
            value={[minSales]}
            onValueChange={(vals) => onMinSalesChange(vals[0])}
            min={0}
            max={2000}
            step={50}
            className="w-full"
            data-testid="slider-min-sales"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>500</span>
            <span>1,000</span>
            <span>1,500</span>
            <span>2,000</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pb-1">
          <Switch
            id="exclude-new"
            checked={excludeNewEntries}
            onCheckedChange={onExcludeNewEntriesChange}
            data-testid="switch-exclude-new"
          />
          <Label htmlFor="exclude-new" className="text-sm font-medium cursor-pointer">
            신규 진입 제외
          </Label>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="gap-2"
          data-testid="button-reset-filters"
        >
          <RotateCcw className="w-4 h-4" />
          초기화
        </Button>
      </div>
    </div>
  );
}
