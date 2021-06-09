import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Plot from 'react-plotly.js';
import {Data} from 'plotly.js';
import { generatePlottedDataForComparingInequality, generatePlottedDataForComparingSummuation, optimalSimulator, simpleSimulator, Simulator } from '../../physics';
import { getRandomColor } from './utils';

export const ChartsApp = ()=> {
  const dataForExpectedValueSimple = generatePlottedDataForExpectedValue(simpleSimulator)
  const dataForExpectedValueOptimal = generatePlottedDataForExpectedValue(optimalSimulator)

  const dataForVarianceSimple = generatePlottedDataForVariance(simpleSimulator)
  const dataForVarianceOptimal = generatePlottedDataForVariance(optimalSimulator)

  const dataForCompareInequalityForSimple = generatePlottedDataForComparingInequality(simpleSimulator)
  const dataForCompareInequalityForOptimal = generatePlottedDataForComparingInequality(optimalSimulator)
  return (
    <div style={{padding:40}}>
        {/* 期待値のプロット */}
        <Chart data={dataForExpectedValueSimple} />
        {/* 分散のプロット */}
        <Chart data={dataForVarianceSimple} />
        {/* 不等式の比較のプロット */}
        <Chart data={dataForCompareInequalityForSimple} />


        <Chart data={dataForExpectedValueOptimal} />
        <Chart data={dataForVarianceOptimal} />
        <Chart data={dataForCompareInequalityForOptimal} />
        {/* 総和のプロット */}
        <LineChart
          width={500}
          height={500}
          data={generatePlottedDataForComparingSummuation(simpleSimulator)}
          margin={{
            top: 10,
            right: 20,
            left: 20,
            bottom: 10,
          }}
          >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timeStep" 
            // tickFormatter={(value,index)=>{
            //   return Math.round(value).toString()
            // }}
          />
          <YAxis 
          tickFormatter={(value:Number,index)=>{
            return value.toPrecision(3)
          }}
          />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey={"value"} 
            stroke={getRandomColor()}
            dot={false} 
          />
        </LineChart>
        <AltChart data={dataForCompareInequalityForSimple} title={'Example comparison'} yAxisTitle="Value" xAxisTitle="Time" />
        <AltChart data={dataForCompareInequalityForOptimal} title={'Optimal comparision'} yAxisTitle="Value" xAxisTitle="Time" />
    </div>
  );
}

const Chart = (props:{
  data:PlottedData[],
})=>{
  const timeStep = props.data[1].time-props.data[0].time
  const lineKeys:string[] = []
  Object.keys(props.data[0]).forEach(value =>{
    if(value !== 'time'){
      lineKeys.push(value)
    }
  })
  const lines =  lineKeys.map(value=>(
    <Line 
      type="monotone" 
      dataKey={value} 
      stroke={getRandomColor()}
      dot={false} 
      key={value}
    />
  ))

  return (
    <LineChart
    width={500}
    height={500}
    data={props.data}
    margin={{
      top: 10,
      right: 20,
      left: 20,
      bottom: 10,
    }}
    >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis 
      dataKey="time" 
      interval={Math.round(1/timeStep)} 
      tickFormatter={(value,index)=>{
        return Math.round(value).toString()
      }}
    />
    <YAxis 
    tickFormatter={(value:Number,index)=>{
      return value.toPrecision(3)
    }}
    />
    <Tooltip />
    <Legend />
    {lines}
  </LineChart>
  )
}

const AltChart = (props:{
  data:PlottedData[],
  title:string,
  yAxisTitle:string,
  xAxisTitle:string
})=>{
  const altPlottedData:Data[] = []
  Object.keys(props.data[0]).forEach(key=>{
    if(key==="time"){
      return
    }
    const x:number[] = []
    const y:number[] = []
    props.data.forEach(value=>{
      x.push(value.time)
      y.push(value[key])
    })
    altPlottedData.push({
      x:x,
      y:y,
      type:'scatter',
      mode:'lines',
      name:key,
      marker:{color:getRandomColor()},
    })
  })
  return (
    <Plot
        data={altPlottedData}
        layout={ {
          width: 700, 
          height: 500, 
          title: props.title,
          yaxis:{
            title:props.yAxisTitle,
            exponentformat:"e"
          },
          xaxis:{
            title:`${props.xAxisTitle} [s]`
          }
        }

      }
      />
  )
}

/**
 * プロット用のデータ
 */
type PlottedData = {
  time:number,
  [value:string]:number
}
/**
 * 
 * @returns 分布の中心の期待値のプロット用のデータ
 */
function generatePlottedDataForExpectedValue(simulator:Simulator):PlottedData[]{

  const simulatedData = simulator.execute()

  const plottedDataForExpectedValue:PlottedData[] = simulatedData.map(value=>{
    return {
      time:value.time,
      expectedValue:value.observable.expectedValue
    }
  })
  return plottedDataForExpectedValue
}
/**
 * 
 * @returns 分布の分散ののプロット用のデータ
 */
function generatePlottedDataForVariance(simulator:Simulator):PlottedData[]{

  const simulatedData = simulator.execute()

  const plottedDataForVariance:PlottedData[] = simulatedData.map(value=>{
    return {
      time:value.time,
      variance:value.observable.variance
    }
  })
  return plottedDataForVariance
}

