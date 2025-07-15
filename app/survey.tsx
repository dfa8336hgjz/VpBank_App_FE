import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { getSurveyQuestionsApi } from '../services/api'
export default function Survey() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    getSurveyQuestionsApi()
      .then(data => {
        setQuestions(data)
        setLoading(false)
      })
      .catch(e => {
        setError('Không thể tải câu hỏi khảo sát')
        setLoading(false)
      })
  }, [])
  if (loading) return <View style={styles.container}><ActivityIndicator size="large" color="#1A8754" /></View>
  if (error) return <View style={styles.container}><Text style={{ color: 'red' }}>{error}</Text></View>
  if (!questions.length) return <View style={styles.container}><Text>Không có câu hỏi khảo sát</Text></View>
  const current = questions[step]
  function selectOption(optionId: string) {
    const newAnswers = [...answers]
    newAnswers[step] = optionId
    setAnswers(newAnswers)
  }
  function next() {
    if (step < questions.length - 1) setStep(step + 1)
    else {
      AsyncStorage.setItem('surveyCompleted', 'true').then(() => {
        router.replace('/(tabs)')
      })
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{current.title}</Text>
      <Text style={styles.desc}>{current.description}</Text>
      <Text style={styles.question}>{current.question}</Text>
      {current.options.map((opt: any) => (
        <TouchableOpacity
          key={opt.optionId}
          style={[styles.option, answers[step] === opt.optionId && styles.selected]}
          onPress={() => selectOption(opt.optionId)}
        >
          <Text style={styles.optionText}>{opt.optionText}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={[styles.next, !answers[step] && styles.disabled]} disabled={!answers[step]} onPress={next}>
        <Text style={styles.nextText}>{step < questions.length - 1 ? 'Next' : 'Finish'}</Text>
      </TouchableOpacity>
    </View>
  )
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24, justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1A8754', marginBottom: 8 },
  desc: { color: '#666', marginBottom: 16 },
  question: { fontSize: 16, marginBottom: 16 },
  option: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 16, marginBottom: 12 },
  selected: { borderColor: '#1A8754', backgroundColor: '#e6f7ee' },
  optionText: { fontSize: 15 },
  next: { backgroundColor: '#1A8754', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  nextText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  disabled: { backgroundColor: '#b5b5b5' }
}) 