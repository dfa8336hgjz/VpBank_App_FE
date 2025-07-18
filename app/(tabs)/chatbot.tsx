import React from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sendChatMessageApi } from '../../services/api';

type Message = {
  id: string;
  text: string;
  sender?: 'user' | 'bot';
};

type State = {
  messages: Message[];
  input: string;
  botTyping: boolean;
};

export default class ChatbotScreen extends React.Component<{}, State> {
  flatListRef = React.createRef<FlatList<any>>();
  state: State = {
    messages: [
      { id: '1', text: 'Hello! How can I help you?', sender: 'bot' },
    ],
    input: '',
    botTyping: false,
  };

  componentDidUpdate(prevProps: {}, prevState: State) {
    if (prevState.messages.length !== this.state.messages.length) {
      setTimeout(() => {
        this.flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }

  handleSend = () => {
    if (this.state.input.trim() === '') return;
    const userMessage: Message = { id: Date.now().toString(), text: this.state.input, sender: 'user' };
    this.setState(
      prevState => ({
        messages: [...prevState.messages, userMessage],
        input: '',
        botTyping: true,
      }),
      () => {
        this.sendMessage(userMessage.text);
      }
    );
  };

  sendMessage = async (text: string) => {
    const botReply = await sendChatMessageApi(text);
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botReply,
      sender: 'bot',
    };
    this.setState(prevState => ({
      messages: [...prevState.messages, botMessage],
      botTyping: false,
    }));
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <FlatList
              ref={this.flatListRef}
              data={this.state.messages}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View
                  style={{ 
                    padding: 12,
                    alignSelf: item.sender === 'user' ? 'flex-end' : 'flex-start',
                    backgroundColor: item.sender === 'user' ? '#1A8754' : '#f1f1f1',
                    borderRadius: 12,
                    marginVertical: 4,
                    maxWidth: '80%'
                  }}
                >
                  <Text style={{ color: item.sender === 'user' ? '#fff' : '#000' }}>{item.text.split('\n').map((line: string, idx: number, arr: string[]) => (
                    <Text key={idx}>{line}{idx < arr.length - 1 ? '\n' : ''}</Text>
                  ))}</Text>
                </View>
              )}
              contentContainerStyle={{ padding: 10, paddingBottom: 0 }}
              keyboardShouldPersistTaps="handled"
              onContentSizeChange={() => this.flatListRef.current?.scrollToEnd({ animated: true })}
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
            />
            {this.state.botTyping && (
              <View style={{ alignSelf: 'flex-start', backgroundColor: '#f1f1f1', borderRadius: 8, padding: 10, marginLeft: 5, maxWidth: '80%' }}>
                <Text style={{ color: '#000' }}>Bot is typing...</Text>
              </View>
            )}
            <View style={{ flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#eee', alignItems: 'center', backgroundColor: '#fff' }}>
              <TextInput
                style={{ flex: 1, height: 40, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 15 }}
                value={this.state.input}
                onChangeText={text => this.setState({ input: text })}
                placeholder="Type a message..."
                returnKeyType="send"
                onSubmitEditing={this.handleSend}
              />
              <TouchableOpacity onPress={this.handleSend} style={{ marginLeft: 10, backgroundColor: '#1A8754', borderRadius: 20, padding: 10 }}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
} 