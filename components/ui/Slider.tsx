import { Platform } from 'react-native'

let Slider: any

if (Platform.OS === 'web') {
  Slider = ({ value, onValueChange, minimumValue = 0, maximumValue = 100, step = 1, minimumTrackTintColor, maximumTrackTintColor, thumbTintColor, ...props }: {
    value: number,
    onValueChange: (v: number) => void,
    minimumValue?: number,
    maximumValue?: number,
    step?: number,
    minimumTrackTintColor?: string,
    maximumTrackTintColor?: string,
    thumbTintColor?: string,
    [key: string]: any
  }) => (
    <input
      type="range"
      min={minimumValue}
      max={maximumValue}
      step={step}
      value={value}
      onChange={e => onValueChange(Number(e.target.value))}
      style={{ 
        width: '100%', 
        height: 28,
        accentColor: thumbTintColor || '#1A8754'
      }}
      {...props}
    />
  )
} else {
  Slider = require('@react-native-community/slider').default
}

export default Slider 