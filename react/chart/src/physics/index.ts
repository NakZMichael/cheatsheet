/**
 * ひとまず計算に使うデータや関数の型を作成する。
 */

/**
 * 時間発展の計算に必要な値、またエントロピー生成を計算するのに必要
 * @field variance 分散
 * @field expectedValue 分布の中心
 */
type PhysicalObservable = {
  variance: number
  expectedValue: number
}
/**
 * ポテンシャルVは
 * V(x,t) = 1/2 * k(t) * ( x - a(t) )**2
 * の調和振動子型である場合を考える
 */

/**
 * バネ定数kの従う式
 */
type KFunction = (props:{
  time:number,
  kbT:number,
})=>number
/**
 * ポテンシャルの中心aの従う式
 */
type PotentialCenterFunction = (props:{
  time:number,
  kbT:number,
})=>number
/**
 * 分布の中心の期待値の変化率を計算する式
 */
type ExpectedValueChangeRateFunction = (props:{
  currentExpectedValue:number,
  time:number,
  kFunction:KFunction,
  potentialCenterFunction:PotentialCenterFunction
})=>number
/**
 * 分散の変化率を計算する式
 */
type VarianceChangeRateFunction = (props:{
  currentVariance:number,
  time:number,
  kFunction:KFunction,
})=>number

type CalculateDefferenceWithRungeKuttaFunction = (props:{
  timeStep:number,
  prevValue:number,
  time:number,
  changeRateFunction:(props:{
    value:number,
    time:number
  })=>number
})=>number

/**
 * シミュレーターとは時間発展を計算しPhysicalObservableと時刻の配列を返す関数であり、
 * 返り値からエントロピー生成、Wasserstein距離、Wasserstein経路長を計算できるものと定義する。
 * 
 * 再利用可能性は低いので関数内でKFunctionやPotentialCenterFunctionを定義して運用する。
 * 要するに引数を取らない。
 * 
 * 念のためグローバル変数は使わず、関数内で全て定義するものとする。(不必要でわかりづらいバグを減らすため)
 */
type SimulatorFunction = () => {
  time:number,
  observable:PhysicalObservable
}[]



/**
 * KFunctionの具体例(他に作るのも面倒なのでシミュレーションにはこれを使っている)
 */
const simpleKFunction:KFunction = (props)=>{
  return props.kbT*( 2 + Math.sin(props.time ))
}
/**
 * PotentialCenterFunctionの具体例(他に作るのも面倒なのでシミュレーションにはこれを使っている)
 */
const simplePotentialCenterFunction:PotentialCenterFunction = (props)=>{
  return 10 * Math.sin(props.time )
}




/**
 * Runge-Kuttaの実装
 */
const calculateDefferenceWithRungeKuttaFunction:CalculateDefferenceWithRungeKuttaFunction = (props)=>{
  const {timeStep,time,prevValue,changeRateFunction} = props
  
  const k1 = timeStep * changeRateFunction({
    value:prevValue,
    time:time
  })
  const k2 = timeStep * changeRateFunction({
    value:prevValue + 0.5*k1,
    time:time+0.5*timeStep
  })
  const k3 = timeStep * changeRateFunction({
    value:prevValue + 0.5*k2,
    time:time+0.5*timeStep
  })
  const k4 = timeStep * changeRateFunction({
    value:prevValue + k3,
    time:time+timeStep
  })
  return ( k1 + 2*k2 + 2*k3 + k4 )/6
}

/**
 * シミュレーションを行うのに必要な情報を全部持たせてあるクラス
 */
export class Simulator{
  // 時刻の終端と時間間隔を定義
  maxTime:number
  timeStep:number
  
  // 物理定数の類はここで定義
  mobilityConstant:number
  // const temperature = 300
  // const boltzmannConstant = 1.38064852 * Math.pow(10,-23) //こいつ計算精度に影響与えそうだからよしなに処理した方がいいかも
  kbT:number　//こいつ計算精度に影響与えそうだからよしなに処理した方がいいかも
  
  // ポテンシャルの時間発展を決める関数
  kFunction:KFunction
  potentialCenterFunction:PotentialCenterFunction

  constructor(props:{
    maxTime:number,
    timeStep:number,
    mobilityConstant:number,
    kbT:number,
    kFunction:KFunction,
    potentialCenterFunction:PotentialCenterFunction
  }){
    this.maxTime = props.maxTime
    this.timeStep = props.timeStep
    this.mobilityConstant = props.mobilityConstant
    this.kbT = props.kbT
    this.kFunction = props.kFunction
    this.potentialCenterFunction = props.potentialCenterFunction
  }

  /**
   * 期待値の変化率を求める
   */
  expectedValueChangeRateFunction:ExpectedValueChangeRateFunction = (props)=>{
    const {currentExpectedValue,time,kFunction,potentialCenterFunction} = props
    return this.mobilityConstant * kFunction({time,kbT:this.kbT}) * ( potentialCenterFunction({time,kbT:this.kbT}) - currentExpectedValue )
  }
  /**
   * 分散の変化率を求める
   */
  varianceChangeRateFunction:VarianceChangeRateFunction = (props)=>{
    const {currentVariance,time,kFunction} = props
    return 2 * this.mobilityConstant * ( this.kbT - kFunction({time,kbT:this.kbT}) * currentVariance )
  }

  public execute:SimulatorFunction = ()=>{
    const startPerformanceTime = performance.now()
  
  
    // このdataSetにシミュレートした値を詰めていく
    const dataSet:{
      time:number,
      observable:PhysicalObservable
    }[] = []
    dataSet.push({
      time:0,
      // 物理量は初期状態で並行状態になるようにしておく
      observable:{
        expectedValue:0,
        variance:this.kbT/this.kFunction({time:0,kbT:this.kbT})
      }
    })

    // 初期値は既に与えているので1step後から計算する
    for(let time = this.timeStep;time<this.maxTime;time += this.timeStep){
      // 前の時刻の値を取り出す。念のためimmutableにしておく。
      const lastExpectedValue = dataSet[dataSet.length-1].observable.expectedValue
      const lastVariance = dataSet[dataSet.length-1].observable.variance
      const lastTime = dataSet[dataSet.length-1].time

      // Runge-Kuttaを使って差分を計算する
      const expectedValueDefference = calculateDefferenceWithRungeKuttaFunction({
        timeStep:this.timeStep,
        prevValue:lastExpectedValue,
        time:lastTime,
        changeRateFunction:(props)=>this.expectedValueChangeRateFunction({
          currentExpectedValue:props.value,
          time:props.time,
          kFunction:simpleKFunction,
          potentialCenterFunction:this.potentialCenterFunction,
        })
      })

      const varianceDefference = calculateDefferenceWithRungeKuttaFunction({
        timeStep:this.timeStep,
        prevValue:lastVariance,
        time:lastTime,
        changeRateFunction:(props)=>this.varianceChangeRateFunction({
          currentVariance:props.value,
          time:props.time,
          kFunction:this.kFunction,
        })
      })
      // 計算結果をdataSetに追加する
      const currentExpectedValue = lastExpectedValue + expectedValueDefference
      const currentVariance = lastVariance + varianceDefference
      dataSet.push({
        time:time,
        observable:{
          expectedValue:currentExpectedValue,
          variance:currentVariance,
        }
      })
    }
    console.log(`simpleSimulator take ${performance.now() - startPerformanceTime} ms`)
   return dataSet
  }
}


/**
 * simpleKFunctionとsimplePotentialCenterFunctionを用いて作成したシミュレーター
 */
export const simpleSimulator = new Simulator({
  // 時刻の終端と時間間隔を定義
  maxTime:3141.59,
  timeStep :0.01,
  // 物理定数の類はここで定義
  mobilityConstant:1,
  // const temperature = 300
  // const boltzmannConstant = 1.38064852 * Math.pow(10,-23) //こいつ計算精度に影響与えそうだからよしなに処理した方がいいかも
  kbT:0.01,　//こいつ計算精度に影響与えそうだからよしなに処理した方がいいかも
  
  kFunction : simpleKFunction,
  potentialCenterFunction : simplePotentialCenterFunction,
})

/**
 * simpleSimulatorと始点と終点を一致させた時にエントロピー生成を最小にするプロトコルを実現した時のシミュレーター
 */
export const optimalSimulator = new Simulator({
  // 時刻の終端と時間間隔を定義
  maxTime:10,
  timeStep :0.01,
  // 物理定数の類はここで定義
  mobilityConstant:10,
  kbT:0.01,　//こいつ計算精度に影響与えそうだからよしなに処理した方がいいかも
  
  kFunction : simpleKFunction,
  potentialCenterFunction : simplePotentialCenterFunction,
})
const res = optimalSimulator.execute()
optimalSimulator.expectedValueChangeRateFunction = (props)=> res[res.length -1].observable.expectedValue / optimalSimulator.maxTime
optimalSimulator.varianceChangeRateFunction = (props)=> 2 * Math.sqrt(props.currentVariance) * ( (
  Math.sqrt(res[res.length -1].observable.variance) - Math.sqrt(res[0].observable.variance)
  )/ optimalSimulator.maxTime )

/**
 * 実際のエントロピー生成、Path Lengthによる下限、Wasserstein距離による下限の大小関係をプロットするためのデータを生成する。
 */
export function generatePlottedDataForComparingInequality(simulator:Simulator){
  const mobilityConstant = simulator.mobilityConstant
  const kbT = simulator.kbT
  const simulatedData = simulator.execute()
  // 最終的な結果を出力する前の中間生成物
  const intermediateData:{
    time:number,
    entropyProduction:number,
    pathLength:number,
    distance:number,
  }[] = []
  simulatedData.forEach((value,index)=>{
    if(index===0){
      intermediateData.push({
        time:0,
        entropyProduction:0,
        pathLength:0,
        distance:0,
      })
      return
    }
    // エントロピー生成の変化量を計算
    const entropyProductionDifference = (
      (simulatedData[index].observable.expectedValue - simulatedData[index-1].observable.expectedValue)**2
      +
      (Math.sqrt(simulatedData[index].observable.variance) - Math.sqrt(simulatedData[index-1].observable.variance))**2
    ) / (
      mobilityConstant * kbT * (simulatedData[index].time - simulatedData[index-1].time)
    )
    // 経路長の変化量を計算
    const pathLengthDifference = Math.sqrt(
      (simulatedData[index].observable.expectedValue - simulatedData[index-1].observable.expectedValue)**2
      +
      ( Math.sqrt(simulatedData[index].observable.variance) - Math.sqrt(simulatedData[index-1].observable.variance) )**2
    )
    // 始状態からの距離を計算
    const distance = Math.sqrt(
      (simulatedData[index].observable.expectedValue - simulatedData[0].observable.expectedValue)**2
      +
      (Math.sqrt(simulatedData[index].observable.variance) - Math.sqrt(simulatedData[0].observable.variance))**2
    )
    // 
    intermediateData.push({
      time:value.time,
      entropyProduction:entropyProductionDifference + intermediateData[intermediateData.length -1].entropyProduction,
      pathLength:intermediateData[intermediateData.length-1].pathLength + pathLengthDifference,
      distance: distance
    })
  })
  
  return intermediateData.map(value=>{
    return {
      time:value.time,
      "entropyProduction":value.entropyProduction,
      "lowerBoundByPathLength": (value.pathLength)**2 / ( mobilityConstant * kbT * (value.time) ),
      "lowerBoundByDistance": (value.distance)**2 / ( mobilityConstant * kbT * (value.time) ),
    }
  })
}

/**
 * Wasserstein距離によってエントロピー生成を推定する際に用いる時間間隔を大きくして行った時の精度の低下をシミュレーションするためのデータを生成する。
 */
export function generatePlottedDataForComparingSummuation(simulator:Simulator){
  // mobilityConstantとkbTは引数にするようにした方が良さそう
  const mobilityConstant = simulator.mobilityConstant
  const kbT = simulator.kbT
  const simulatedData = simulator.execute()

  const result:{
    timeStep:number,
    value:number
  }[] = []

  for (let interval=1;interval<=1000;interval++){
    const dataForOneTimeStep:{
      time:number,
      summuation:number,
    }[] = []
    simulatedData.forEach((value,index)=>{
      if(index===0){
        dataForOneTimeStep.push({
          time:0,
          summuation:0,
        })
        return
      }
      if(index%interval === 0){
        // intervalごとに
        // 時間的に粗視化したエントロピー生成を計算
        const entropyProductionDifference = (
          (simulatedData[index].observable.expectedValue - simulatedData[index-interval].observable.expectedValue)**2
          +
          (Math.sqrt(simulatedData[index].observable.variance) - Math.sqrt(simulatedData[index-interval].observable.variance))**2
        ) / (
          mobilityConstant * kbT * ((simulatedData[index].time - simulatedData[index-interval].time))
        )
        
        dataForOneTimeStep.push({
          time:value.time,
          summuation:entropyProductionDifference + dataForOneTimeStep[dataForOneTimeStep.length -1].summuation,
        })
      }
      if (index === simulatedData.length -1){
        result.push(
          {
            timeStep:simulator.timeStep * interval,
            value:dataForOneTimeStep[dataForOneTimeStep.length -1].summuation,
          }
        )
      }
    })
  }
  
  return result
}

