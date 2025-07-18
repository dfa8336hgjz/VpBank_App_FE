import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, FlatList, Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Reward = {
  id: string;
  name: string;
  points: number;
  description: string;
  image: any;
};

type PointHistory = {
  id: string;
  points: number;
  reason: string;
  date: string;
  type: 'earned' | 'spent' | 'penalty';
};

interface State {
  selectedReward: Reward | null;
  modalVisible: boolean;
  historyModalVisible: boolean;
}

const rewards: Reward[] = [
  {
    id: '1',
    name: 'Starbucks Voucher 50k',
    points: 500,
    description: 'Discount voucher 50,000 VND at all Starbucks stores nationwide. Valid for 30 days.',
    image: require('../../assets/images/starbuck.jpg'),
  },
  {
    id: '2',
    name: 'Phone Top-up Card 100k',
    points: 1000,
    description: 'Phone top-up card worth 100,000 VND for all carriers.',
    image: require('../../assets/images/topup.png'),
  },
  {
    id: '3',
    name: '10% Off Tiki',
    points: 750,
    description: '10% discount code for orders on Tiki, up to 100,000 VND.',
    image: require('../../assets/images/tiki.png'),
  },
];

const userPoints = 1200;

const pointHistory: PointHistory[] = [
  {
    id: '1',
    points: -500,
    reason: 'Redeemed Starbucks 50k voucher',
    date: '2024-01-15',
    type: 'spent',
  },
  {
    id: '2',
    points: +150,
    reason: 'Smart spending - Savings jar reached goal',
    date: '2024-01-14',
    type: 'earned',
  },
  {
    id: '3',
    points: -10,
    reason: 'Unreasonable transaction - Entertainment jar exceeded limit',
    date: '2024-01-13',
    type: 'penalty',
  },
  {
    id: '4',
    points: +200,
    reason: 'Smart spending - Living expenses jar used efficiently',
    date: '2024-01-12',
    type: 'earned',
  },
  {
    id: '5',
    points: -750,
    reason: 'Redeemed 10% off Tiki discount code',
    date: '2024-01-11',
    type: 'spent',
  },
  {
    id: '6',
    points: +300,
    reason: 'Smart spending - Investment jar grew well',
    date: '2024-01-10',
    type: 'earned',
  },
  {
    id: '7',
    points: -20,
    reason: 'Unreasonable transaction - Shopping jar exceeded budget',
    date: '2024-01-09',
    type: 'penalty',
  },
  {
    id: '8',
    points: +100,
    reason: 'Smart spending - Emergency jar preserved',
    date: '2024-01-08',
    type: 'earned',
  },
];

export default class RewardsScreen extends React.Component<{}, State> {
  state: State = {
    selectedReward: null,
    modalVisible: false,
    historyModalVisible: false,
  };

  openModal = (reward: Reward) => {
    this.setState({ selectedReward: reward, modalVisible: true });
  };

  closeModal = () => {
    this.setState({ modalVisible: false });
  };

  openHistoryModal = () => {
    this.setState({ historyModalVisible: true });
  };

  closeHistoryModal = () => {
    this.setState({ historyModalVisible: false });
  };

  renderReward = ({ item }: { item: Reward }) => (
    <View style={{ flex: 1, margin: 10, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#eee', alignItems: 'center', padding: 16, minWidth: (Dimensions.get('window').width / 2) - 32 }}>
      <View style={{ width: 80, height: 80, backgroundColor: '#f3f3f3', borderRadius: 8, marginBottom: 12, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Image source={item.image} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
      </View>
      <Text style={{ fontSize: 14, fontWeight: '600', color: '#222', textAlign: 'center', marginBottom: 8 }}>{item.name}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <FontAwesome5 name="gem" size={18} color="#FFD700" style={{ marginRight: 4 }} />
        <Text style={{ color: '#1A8754', fontWeight: 'bold' }}>{item.points} points</Text>
      </View>
      <TouchableOpacity onPress={() => this.openModal(item)} style={{ backgroundColor: '#1A8754', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 32, marginTop: 4 }}>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Redeem</Text>
      </TouchableOpacity>
    </View>
  );

  renderHistoryItem = ({ item }: { item: PointHistory }) => {
    const getPointColor = (type: string, points: number) => {
      if (type === 'earned') return '#1A8754';
      if (type === 'spent') return '#FF6B35';
      if (type === 'penalty') return '#DC2626';
      return points > 0 ? '#1A8754' : '#DC2626';
    };

    const getIcon = (type: string) => {
      if (type === 'earned') return 'plus-circle';
      if (type === 'spent') return 'exchange-alt';
      if (type === 'penalty') return 'exclamation-triangle';
      return 'circle';
    };

    return (
      <View style={{ backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 8, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#eee' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#222', marginBottom: 4 }}>{item.reason}</Text>
            <Text style={{ fontSize: 12, color: '#666' }}>{item.date}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesome5 name={getIcon(item.type)} size={14} color={getPointColor(item.type, item.points)} style={{ marginRight: 4 }} />
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: getPointColor(item.type, item.points) }}>
              {item.points > 0 ? '+' : ''}{item.points}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  render() {
    const { selectedReward, modalVisible, historyModalVisible } = this.state;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fafbfc' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Your Rewards</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity onPress={this.openHistoryModal} style={{ backgroundColor: '#f0f0f0', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 }}>
              <FontAwesome5 name="history" size={16} color="#666" />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffe066', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 4 }}>
              <FontAwesome5 name="gem" size={18} color="#FFD700" style={{ marginRight: 4 }} />
              <Text style={{ fontWeight: 'bold', color: '#333' }}>{userPoints}</Text>
            </View>
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
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, margin: 20, maxWidth: 300 }}>
              {selectedReward && (
                <>
                  <View style={{ alignItems: 'center', marginBottom: 16 }}>
                    <Image source={selectedReward.image} style={{ width: 80, height: 80, borderRadius: 8, marginBottom: 12 }} />
                    <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>{selectedReward.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                      <FontAwesome5 name="gem" size={18} color="#FFD700" style={{ marginRight: 4 }} />
                      <Text style={{ color: '#1A8754', fontWeight: 'bold' }}>{selectedReward.points} points</Text>
                    </View>
                  </View>
                  <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 }}>{selectedReward.description}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={this.closeModal} style={{ backgroundColor: '#f0f0f0', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24, flex: 1, marginRight: 8 }}>
                      <Text style={{ color: '#666', fontWeight: 'bold', textAlign: 'center' }}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: '#1A8754', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 24, flex: 1, marginLeft: 8 }}>
                      <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Redeem</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
        <Modal
          visible={historyModalVisible}
          transparent
          animationType="slide"
          onRequestClose={this.closeHistoryModal}
        >
          <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ backgroundColor: '#fafbfc', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%', paddingBottom: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Points History</Text>
                <TouchableOpacity onPress={this.closeHistoryModal} style={{ padding: 4 }}>
                  <FontAwesome5 name="times" size={20} color="#666" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={pointHistory}
                renderItem={this.renderHistoryItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingTop: 16 }}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
} 