import React from "react";
import { SafeAreaView } from "react-native";
import TeamProfile from "@/components/TeamProfile";
import { images } from "@/constants";

const EditTeamChat = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TeamProfile
        name="Adam Sandler"
        userName="@Adam"
        profileImage={images.chatLogo2} 
      />
    </SafeAreaView>
  );
};

export default EditTeamChat;
