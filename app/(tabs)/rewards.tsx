import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Reward = {
  id: string;
  name: string;
  points: number;
  description: string;
};

type State = {
  selectedReward: Reward | null;
  modalVisible: boolean;
};

const rewards: Reward[] = [
  {
    id: '1',
    name: 'Starbucks Voucher 50k',
    points: 500,
    description: 'Discount voucher 50,000 VND at all Starbucks stores nationwide. Valid for 30 days.',
  },
  {
    id: '2',
    name: 'Phone Top-up Card 100k',
    points: 1000,
    description: 'Phone top-up card worth 100,000 VND for all carriers.',
  },
  {
    id: '3',
    name: '10% Off Tiki',
    points: 750,
    description: '10% discount code for orders on Tiki, up to 100,000 VND.',
  },
  {
    id: '4',
    name: 'CGV Movie Ticket',
    points: 1200,
    description: 'Movie ticket at CGV cinemas nationwide.',
  },
];

const userPoints = 1200;

export default class RewardsScreen extends React.Component<{}, State> {
  state: State = {
    selectedReward: null,
    modalVisible: false,
  };

  openModal = (reward: Reward) => {
    this.setState({ selectedReward: reward, modalVisible: true });
  };

  closeModal = () => {
    this.setState({ modalVisible: false });
  };

  renderReward = ({ item }: { item: Reward }) => (
    <View style={{ flex: 1, margin: 10, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#eee', alignItems: 'center', padding: 16, minWidth: (Dimensions.get('window').width / 2) - 32 }}>
      <View style={{ width: 80, height: 80, backgroundColor: '#f3f3f3', borderRadius: 8, marginBottom: 12, justifyContent: 'center', alignItems: 'center' }}>
      </View>
      <Text style={{ fontWeight: '500', fontSize: 16, marginBottom: 4 }}>{item.name}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <FontAwesome5 name="gem" size={18} color="#FFD700" style={{ marginRight: 4 }} />
        <Text style={{ color: '#0070f3', fontWeight: 'bold' }}>{item.points} points</Text>
      </View>
      <TouchableOpacity onPress={() => this.openModal(item)} style={{ backgroundColor: '#ff8800', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 32, marginTop: 4 }}>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Redeem</Text>
      </TouchableOpacity>
    </View>
  );

  render() {
    const { selectedReward, modalVisible } = this.state;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fafbfc' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Your Rewards</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffe066', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 4 }}>
            <FontAwesome5 name="gem" size={18} color="#FFD700" style={{ marginRight: 4 }} />
            <Text style={{ fontWeight: 'bold', color: '#333' }}>{userPoints}</Text>
          </View>
        </View>
        <Text style={{ fontSize: 16, fontWeight: '500', marginLeft: 16, marginTop: 12, marginBottom: 4 }}>Reward Catalog</Text>
        <FlatList
          data={rewards}
          renderItem={this.renderReward}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 4, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={this.closeModal}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: '85%', backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Confirm Redemption</Text>
              <View style={{ width: 100, height: 100, backgroundColor: '#f3f3f3', borderRadius: 8, marginBottom: 16, justifyContent: 'center', alignItems: 'center' }}>
              </View>
              <Text style={{ fontWeight: '500', fontSize: 18, marginBottom: 8 }}>{selectedReward?.name}</Text>
              <Text style={{ color: '#555', textAlign: 'center', marginBottom: 12 }}>{selectedReward?.description}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <FontAwesome5 name="gem" size={18} color="#FFD700" style={{ marginRight: 4 }} />
                <Text style={{ color: '#0070f3', fontWeight: 'bold', fontSize: 16 }}>{selectedReward?.points} points</Text>
              </View>
              <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 8 }}>
                <TouchableOpacity onPress={this.closeModal} style={{ flex: 1, backgroundColor: '#f3f3f3', borderRadius: 8, paddingVertical: 12, marginRight: 8, alignItems: 'center' }}>
                  <Text style={{ color: '#333', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.closeModal} style={{ flex: 1, backgroundColor: '#0070f3', borderRadius: 8, paddingVertical: 12, marginLeft: 8, alignItems: 'center' }}>
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
} 