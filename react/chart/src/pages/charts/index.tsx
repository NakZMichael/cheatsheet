import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Plot from 'react-plotly.js';
import {Data} from 'plotly.js';
import { generatePlottedDataForComparingInequality, generatePlottedDataForComparingSummuation, optimalSimulator, simpleSimulator, Simulator } from '../../physics';

export const ChartsApp = ()=> {
  // const dataForExpectedValueSimple = generatePlottedDataForExpectedValue(simpleSimulator)
  // const dataForExpectedValueOptimal = generatePlottedDataForExpectedValue(optimalSimulator)

  // const dataForVarianceSimple = generatePlottedDataForVariance(simpleSimulator)
  // const dataForVarianceOptimal = generatePlottedDataForVariance(optimalSimulator)

  const dataForCompareInequalityForSimple = generatePlottedDataForComparingInequality(simpleSimulator)
  const dataForCompareInequalityForOptimal = generatePlottedDataForComparingInequality(optimalSimulator)
  return (
    <div style={{padding:40}}>

        {/* 総和のプロット */}
        <SummationChart />
        <Chart 
          data={dataForCompareInequalityForSimple}
          xAxisTitle={"Time"}
          yAxisTitle={"Value"}
          title={"Compare tightness of inequalities"}
        />
        <Chart 
          data={dataForCompareInequalityForOptimal}
          xAxisTitle={"Time"}
          yAxisTitle={"Value"}
          title={"Compare tightness of inequalities in the optimal protocol"}
        />
    </div>
  );
}

const Chart = (props:{
  data:PlottedData[],
  title:string,
  xAxisTitle:string,
  yAxisTitle:string,
})=>{
  let altPlottedData:Data[] = []
  Object.keys(props.data[0]).forEach( key=>{
    if(key==="time"){
      return
    }

    if( key !== "entropyProduction" && key !== "lowerBoundByPathLength" && key !== "lowerBoundByDistance"){
      return
    }
    const x:number[] = []
    const y:number[] = []
    props.data.forEach((value,index)=>{
      if(index % (key === "entropyProduction"?1:40) !== 0){
        return
      }
      x.push(value.time)
      y.push(value[key])
    })
    altPlottedData.push({
      x:x,
      y:y,
      type:"scatter",
      mode:key === "entropyProduction"?"lines":"markers",
      marker:{
        color:key === "entropyProduction"?"#2e8b57":key ==="lowerBoundByPathLength"?"red":"#4682b4",
        size:key ==="lowerBoundByPathLength"?8:12,
        symbol:key ==="lowerBoundByPathLength"?"x-thin":"square-open",
        line:{
          width:key ==="lowerBoundByPathLength"?2:2,
          color:"#daa520"
        }
      },
      name:key === "entropyProduction"?"entropy production":key ==="lowerBoundByPathLength"?"lower bound measured by path length":"lower bound measured by wasserstein distance",
    })
  })
  return (
    <Plot
        data={altPlottedData}
        layout={ {
          width: 900, 
          height: 600, 
          font:{
            size:20,
          },
          title: props.title,
          xaxis:{
            title: props.xAxisTitle,
          },
          yaxis:{
            title: props.yAxisTitle,
          },
          legend:{
            x:0.01,
            y:1,
            font:{
              size:20
            },
            // bgcolor:"transparent",
            bordercolor:"#222",
            borderwidth:1
          }
        } }
        config = {{
          toImageButtonOptions: {
            format: 'png', // one of png, svg, jpeg, webp
            filename: props.title,
            // width: 1200,
            // height: 500,
            // scale: 15 // Multiply title/legend/axis/canvas sizes by this factor
          },
          
        }}
        
      />
  )
}

/**
 * プロット用のデータ
 */
type PlottedData = {
  "time":number,
  "entropyProduction":number,
  "lowerBoundByPathLength": number,
  "lowerBoundByDistance": number,
}


const SummationChart = () => {
  const rawData = generatePlottedDataForComparingSummuation(simpleSimulator)
  const plottedData:Data[] = []
  const actualValue = rawData[0].value
  const x:number[] = []
  const y:number[] = []
  rawData.forEach((value,index)=>{
    x.push(value.timeStep)
    y.push(value.value/actualValue)
  })
  plottedData.push({
    x:x,
    y:y,
    type:"scatter",
    mode:"lines",
    marker:{
      color:"#2e8b57",
      line:{
        width:2,
        color:"#daa520"
      }
  },
  name:"entropy production",
})
  return (
    <Plot
        data={plottedData}
        layout={ {
          width: 900, 
          height: 600, 
          font:{
            size:20,
          },
          title: "Precisions of observation of the entropy production",
          xaxis:{
            title: 'Interval',
          },
          yaxis:{
            title: 'Rate against actual entropy procuction',
          },
          legend:{
            x:0.01,
            y:1,
            font:{
              size:20
            },
            bordercolor:"#222",
            borderwidth:1
          }
        } }
        config = {{
          toImageButtonOptions: {
            format: 'png', // one of png, svg, jpeg, webp
            filename: 'precision',
            // width: 1200,
            // height: 500,
            // scale: 15 // Multiply title/legend/axis/canvas sizes by this factor
          },
          
        }}
        
      />
  )
}