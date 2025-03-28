import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TutorialService } from 'src/app/services/candleStick.service';
import * as echarts from 'echarts';
import * as XLSX from 'xlsx';

type AOA = any[][];

@Component({
  selector: 'app-candleStick-chart',
  templateUrl: './candleStickChart.component.html',
  styleUrls: ['./candleStickChart.component.css'],
})
export class CandleStickChartComponent implements OnInit {
  tutorials?: Tutorial[];
  currentTutorial: Tutorial = {};
  currentIndex = -1;
  title = '';
  jsonData: any[] = [];

  data: AOA = [[1, 2], [3, 4]];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';


  constructor(private tutorialService: TutorialService, private readonly changeDetectorRef: ChangeDetectorRef, ) {}

  ngOnInit(): void {
    //this.retrieveTutorials();
    //this.customEChart();
  }

  public splitData(rawData: (number | string)[][]) {
    const categoryData = [];
    const values = [];
    const annotations =[];
    for (var i = 0; i < rawData.length; i++) {
      categoryData.push(rawData[i].splice(0, 1)[0]);
      values.push(rawData[i]);
      if (rawData[i][4] !== '') {
        annotations.push({
            coord: [i, rawData[i][3]],
            value: rawData[i][4],
            name: '',
            label: {
              formatter: function (param: any) {
                return param != null ? (param.value) + '' : '';
              }
            },
        });
    }
    }
    return {
      categoryData: categoryData,
      values: values,
      annotations: annotations
    };
  }
  
  public calculateMA(dayCount: number, data0: any) {
    var result = [];
    for (var i = 0, len = data0.values.length; i < len; i++) {
      if (i < dayCount) {
        result.push('-');
        continue;
      }
      var sum = 0;
      for (var j = 0; j < dayCount; j++) {
        sum += +data0.values[i - j][1];
      }
      result.push(sum / dayCount);
    }
    return result;
  }

  public clear(){
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
        fileInput.value = ""; // Clears the selected file
    }
    this.jsonData = [];
    this.changeDetectorRef.detectChanges();
  }
  

  public customEChart(data: any){
    type EChartsOption = echarts.EChartsOption;
    var chartDom = document.getElementById('eChartId')!;
    var myChart = echarts.init(chartDom);
    var option: EChartsOption;
    const upColor = '#ec0000';
    const upBorderColor = '#8A0000';
    const downColor = '#00da3c';
    const downBorderColor = '#008F28';

    // Each item: open，close，lowest，highest
    const data0 = this.splitData(this.jsonData);
    option = {
      title: {
        text: '上证指数',
        left: 0
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30', 'Rule']
      },
      grid: {
        left: '2%',
        right: '2%',
        bottom: '15%'
      },
      xAxis: {
        type: 'category',
        data: data0.categoryData,
        boundaryGap: false,
        axisLine: { onZero: false },
        splitLine: { show: false },
        min: 'dataMin',
        max: 'dataMax'
      },
      yAxis: {
        scale: true,
        splitArea: {
          show: true
        }
      },
      dataZoom: [
        {
          type: 'inside',
          start: 50,
          end: 100
        },
        {
          show: true,
          type: 'slider',
          top: '90%',
          start: 50,
          end: 100
        }
      ],
      series: [
        {
            type: 'candlestick',
            data: data0.values,
            itemStyle: {
                // color: '#ec0000', //red
                // color0: '#00da3c', // green
                color: '#00da3c', //green
                color0: '#ec0000', //red
                borderColor: '#8A0000',
                borderColor0: '#008F28'
            },
            markPoint: { data: data0.annotations }
        }
    ]
    };
    
    option && myChart.setOption(option);
    this.changeDetectorRef.detectChanges();
  }
  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      this.data.map(res=>{
        if(res[0] === "no"){
          console.log(res[0]);
        }else{
          console.log(res[0]);
        }
      })
    };
    reader.readAsBinaryString(target.files[0]);
  }


  export(): void {
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvContent = reader.result as string;
        this.jsonData = this.tutorialService.parseCsv(csvContent);
        this.changeDetectorRef.detectChanges();
        this.customEChart(this.jsonData)
      };
      reader.readAsText(file);
      
    }
  }
}
