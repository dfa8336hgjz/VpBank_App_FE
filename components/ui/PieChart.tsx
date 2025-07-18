import React from 'react'
import { View } from 'react-native'
import Svg, { Circle, G, Path } from 'react-native-svg'

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  let angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  }
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  if (Math.abs(endAngle - startAngle) < 0.01) {
    return ''
  }
  
  if (endAngle - startAngle >= 360) {
    const midAngle = startAngle + 180
    const start = polarToCartesian(x, y, radius, startAngle)
    const mid = polarToCartesian(x, y, radius, midAngle)
    const end = polarToCartesian(x, y, radius, endAngle - 0.01)
    
    return [
      'M', start.x, start.y,
      'A', radius, radius, 0, 0, 1, mid.x, mid.y,
      'A', radius, radius, 0, 0, 1, end.x, end.y
    ].join(' ')
  }
  
  let start = polarToCartesian(x, y, radius, endAngle)
  let end = polarToCartesian(x, y, radius, startAngle)
  let largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
  
  let d = [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(' ')
  return d
}

type PieChartProps = {
  data: { percent: number; color: string }[]
  size?: number
  strokeWidth?: number
  gapDegree?: number
}

export default function PieChart({ data, size = 120, strokeWidth = 24, gapDegree = 0 }: PieChartProps) {
  let radius = size / 2 - strokeWidth / 2
  let center = size / 2
  
  const filteredData = data.filter(d => d.percent > 0)
  
  if (filteredData.length === 0) {
    return (
      <View>
        <Svg width={size} height={size}>
          <G>
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#eee"
              strokeWidth={strokeWidth}
              fill="none"
            />
          </G>
        </Svg>
      </View>
    )
  }
  
  let total = filteredData.reduce((sum, d) => sum + d.percent, 0)
  if (total <= 0) {
    return (
      <View>
        <Svg width={size} height={size}>
          <G>
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#eee"
              strokeWidth={strokeWidth}
              fill="none"
            />
          </G>
        </Svg>
      </View>
    )
  }
  
  let startAngle = 0
  let paths = filteredData.map((d, i) => {
    let angle = (d.percent / total) * (360 - filteredData.length * gapDegree)
    let endAngle = startAngle + angle
    
    if (angle < 0.5) {
      startAngle = endAngle + gapDegree
      return null
    }
    
    let path = describeArc(center, center, radius, startAngle + gapDegree / 2, endAngle - gapDegree / 2)
    
    if (!path) {
      startAngle = endAngle + gapDegree
      return null
    }
    
    let res = (
      <Path
        key={i}
        d={path}
        stroke={d.color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
      />
    )
    startAngle = endAngle + gapDegree
    return res
  }).filter(Boolean)
  
  return (
    <View>
      <Svg width={size} height={size}>
        <G>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#eee"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {paths}
        </G>
      </Svg>
    </View>
  )
} 