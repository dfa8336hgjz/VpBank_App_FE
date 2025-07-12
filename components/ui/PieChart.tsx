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
  let total = data.reduce((sum, d) => sum + d.percent, 0)
  let startAngle = 0
  let paths = data.map((d, i) => {
    let angle = (d.percent / total) * (360 - data.length * gapDegree)
    let endAngle = startAngle + angle
    let path = describeArc(center, center, radius, startAngle + gapDegree / 2, endAngle - gapDegree / 2)
    let res = (
      <Path
        key={i}
        d={path}
        stroke={d.color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="butt"
      />
    )
    startAngle = endAngle + gapDegree
    return res
  })
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