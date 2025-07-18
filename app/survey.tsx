import { FontAwesome } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { createJarDivisionApi, getSurveyQuestionsApi, submitSurveyApi } from '../services/api'

export default function Survey() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<(string | string[])[]>([])
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  useEffect(() => {
    getSurveyQuestionsApi()
      .then(data => {
        setQuestions(data.result || data)
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
  const isSingleChoice = current.type === 'SINGLE_CHOICE'
  
  function selectOption(optionId: string) {
    const newAnswers = [...answers]
    
    if (isSingleChoice) {
      newAnswers[step] = optionId
    } else {
      const currentAnswers = newAnswers[step] as string[] || []
      const index = currentAnswers.indexOf(optionId)
      if (index > -1) {
        currentAnswers.splice(index, 1)
      } else {
        currentAnswers.push(optionId)
      }
      newAnswers[step] = currentAnswers
    }
    
    setAnswers(newAnswers)
  }
  
  function isOptionSelected(optionId: string) {
    if (isSingleChoice) {
      return answers[step] === optionId
    } else {
      const currentAnswers = answers[step] as string[] || []
      return currentAnswers.includes(optionId)
    }
  }
  
  function canProceed() {
    if (isSingleChoice) {
      return answers[step]
    } else {
      const currentAnswers = answers[step] as string[] || []
      return currentAnswers.length > 0
    }
  }
  
  function next() {
    if (step < questions.length - 1) setStep(step + 1)
    else {
      const surveyAnswers = questions.map((question, index) => ({
        surveyId: question.id,
        answers: Array.isArray(answers[index]) ? answers[index] as string[] : [answers[index] as string]
      }))
      submitSurveyApi(surveyAnswers)
        .then(async (res) => {
          if (res && res.result) {
            await createJarDivisionApi({
              necessitiesPercentage: res.result.necessitiesPercentage,
              educationPercentage: res.result.educationPercentage,
              entertainmentPercentage: res.result.entertainmentPercentage,
              savingsPercentage: res.result.savingsPercentage,
              investmentPercentage: res.result.investmentPercentage,
              givingPercentage: res.result.givingPercentage
            })
          }
          AsyncStorage.setItem('surveyCompleted', 'true').then(() => {
            router.replace('/(tabs)')
          })
        })
        .catch(error => {
          console.error('Failed to submit survey:', error)
          AsyncStorage.setItem('surveyCompleted', 'true').then(() => {
            router.replace('/(tabs)')
          })
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
          style={[styles.option, isOptionSelected(opt.optionId) && styles.selected]}
          onPress={() => selectOption(opt.optionId)}
        >
          <View style={styles.optionContent}>
            {isSingleChoice ? (
              <View style={[styles.radio, isOptionSelected(opt.optionId) && styles.radioSelected]}>
                {isOptionSelected(opt.optionId) && <View style={styles.radioInner} />}
              </View>
            ) : (
              <View style={[styles.checkbox, isOptionSelected(opt.optionId) && styles.checkboxSelected]}>
                {isOptionSelected(opt.optionId) && (
                  <FontAwesome name="check" size={12} color="#fff" />
                )}
              </View>
            )}
            <Text style={styles.optionText}>{opt.optionText}</Text>
          </View>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={[styles.next, !canProceed() && styles.disabled]} disabled={!canProceed()} onPress={next}>
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
  optionContent: { flexDirection: 'row', alignItems: 'center' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#ddd', marginRight: 12, alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: '#1A8754' },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#1A8754' },
  checkbox: { width: 20, height: 20, borderWidth: 2, borderColor: '#ddd', marginRight: 12, alignItems: 'center', justifyContent: 'center' },
  checkboxSelected: { borderColor: '#1A8754', backgroundColor: '#1A8754' },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  optionText: { fontSize: 15, flex: 1 },
  next: { backgroundColor: '#1A8754', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  nextText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  disabled: { backgroundColor: '#b5b5b5' }
}) 