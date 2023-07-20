import {Series} from "@/types/componentsType/Series";
import {IComponent} from "@/types/componentsType/IComponent";
import {ECharts} from "echarts";

export interface IPieComponent extends IComponent{
    option: PieComponentOption;
    myChart: ECharts;
}

interface PieComponentOption {
    tooltip: {
        trigger: string;
        formatter: string;
    };
    legend: {
        orient: string;
        left: number;
        data:Array<string>
    };
    series: Array<PieComponentSeries>;
}

interface PieComponentSeries extends Series {
    radius: Array<string>;
    avoidLabelOverlap: boolean;
    label: {
        show: boolean;
        position: string;
    };
    emphasis: {
        label: {
            show: boolean;
            fontSize: string;
            fontWeight: string;
        };
    };
    labelLine: {
        show: boolean;
    };
    data : Array<PieComponentSeriesData>;
}

interface PieComponentSeriesData {
    value: number;
    name: string;
}