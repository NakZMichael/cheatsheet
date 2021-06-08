import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
// import { differenceInMilliseconds } from 'date-fns';
import { generatePlottedDataForComparingInequality, generatePlottedDataForComparingSummuation, optimalSimulator, simpleSimulator, Simulator } from '../../physics';

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

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
