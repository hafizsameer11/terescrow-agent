import { COLORS, icons } from '@/constants';
import { Colors } from '@/constants/Colors';
import { useSocket } from '@/contexts/socketContext';
import { useTheme } from '@/contexts/themeContext';
import { getImageUrl } from '@/utils/helpers';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Checkbox } from 'react-native-paper';

let isOnline = false;

const TeamGroupList: React.FC<{
  pfp: string;
  name: string;
  username: string;
  userId: string;
  getCheckedId?: (userId: number, isChecked: boolean) => void;
  deleteSelected?: (userId: number) => void;
  isSelectable: boolean;
}> = (props) => {
  const [isChecked, setIsChecked] = useState(false);
  const { dark } = useTheme();
  const { onlineAgents } = useSocket();

  const checkDataHandler = () => {
    setIsChecked(!isChecked);
    props.getCheckedId && props.getCheckedId(+props.userId, !isChecked);
  };

  //check online Status

  useEffect(() => {
    for (const agent of onlineAgents) {
      if (agent.userId === props.userId.toString()) {
        isOnline = true;
      }
    }
  }, [onlineAgents]);

  return (
    <View style={styles.container}>
      {/* Profile Image */}
      <Image source={{uri:getImageUrl(props.pfp)}} style={styles.profileImage} />
      {/* Right Section */}
      <View style={styles.rightContainer}>
        {/* Name and Date Row */}
        <View style={{ flex: 1 }}>
          <View style={styles.nameStatusRow}>
            <Text
              style={[styles.nameText, dark && { color: Colors.dark.text }]}
            >
              {props.name}
            </Text>
            <View
              style={[
                styles.onlineStatus,
                isOnline
                  ? { backgroundColor: COLORS.green }
                  : { backgroundColor: COLORS.red },
              ]}
            ></View>
          </View>

          {/* Recent Message and Unread Messages Row */}
          <Text style={styles.userName}>{props.username}</Text>
        </View>
        {props.isSelectable && (
          <Checkbox
            status={isChecked ? 'checked' : 'unchecked'}
            onPress={checkDataHandler}
            color="#4CAF50"
          />
        )}
        {!props.isSelectable && (
          <TouchableOpacity
            onPress={() =>
              props.deleteSelected && props.deleteSelected(+props.userId)
            }
            activeOpacity={0.6}
          >
            <Image
              source={icons.deletePng}
              style={{ width: 20, height: 20 }}
              tintColor={COLORS.red}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 23,
    padding: 10,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: COLORS.grayscale400,
  },
  profileImage: {
    width: 57,
    height: 57,
    borderRadius: 25,
    marginRight: 20,
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  nameText: {
    fontSize: 14,
    fontWeight: 'semibold',
  },
  onlineStatus: {
    width: 15,
    height: 15,
    borderRadius: 50,
    marginLeft: 10,
  },
  userName: {
    fontSize: 10,
    color: COLORS.grayscale400,
  },
});

export default TeamGroupList;
