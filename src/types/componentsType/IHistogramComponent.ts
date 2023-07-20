import {Series} from "@/types/componentsType/Series";
import {IComponent} from "@/types/componentsType/IComponent";
import {ECharts} from "echarts";

export interface IHistogramComponent extends IComponent{
    option: HistogramComponentOption;
    myChart: ECharts;
}

interface HistogramComponentOption {
    title: {
        text: string
    };
    tooltip: {},
    legend: {
        data:Array<string>
    };
    xAxis: {
        data: Array<string>
    };
    yAxis: {},
    series: Array<HistogramComponentSeries>
}

interface HistogramComponentSeries extends Series {
    data : Array<number>;
}