/* eslint-disable react-native/no-inline-styles */
/*
********************************************
 Copyright © 2021 Agora Lab, Inc., all rights reserved.
 AppBuilder and all associated components, source code, APIs, services, and documentation 
 (the “Materials”) are owned by Agora Lab, Inc. and its licensors. The Materials may not be 
 accessed, used, modified, or distributed for any purpose without a license from Agora Lab, Inc.  
 Use without a license or in violation of any license terms and conditions (including use for 
 any purpose competitive to Agora Lab, Inc.’s business) is strictly prohibited. For more 
 information visit https://appbuilder.agora.io. 
*********************************************
*/
import React, {useContext, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Text,
  Modal,
  TouchableOpacity,
} from 'react-native';
import SecondaryButton from '../atoms/SecondaryButton';
import {useString} from '../utils/useString';
import useRemoteMute, {MUTE_REMOTE_TYPE} from '../utils/useRemoteMute';
import TertiaryButton from '../atoms/TertiaryButton';
import Spacer from '../atoms/Spacer';
import RemoteMutePopup from '../subComponents/RemoteMutePopup';
import {calculatePosition} from '../utils/common';
import {PollContext} from './PollContext';
import TextInput from '../atoms/TextInput';
import ThemeConfig from '../theme';
import {controlMessageEnum} from '../components/ChatContext';
import events from '../rtm-events-api';

export interface MuteAllAudioButtonProps {
  render?: (onPress: () => void) => JSX.Element;
}

export const MuteAllAudioButton = (props: MuteAllAudioButtonProps) => {
  const [showAudioMuteModal, setShowAudioMuteModal] = useState(false);
  const audioBtnRef = useRef(null);
  const [modalPosition, setModalPosition] = useState({});
  const muteRemoteAudio = useRemoteMute();
  //commented for v1 release
  //const muteAllAudioButton = useString('muteAllAudioButton')();
  const muteAllAudioButton = 'Mute all';
  const onPressAction = () => muteRemoteAudio(MUTE_REMOTE_TYPE.audio);
  const {width: globalWidth, height: globalHeight} = useWindowDimensions();
  const showAudioModal = () => {
    audioBtnRef?.current?.measure(
      (_fx, _fy, localWidth, localHeight, px, py) => {
        const data = calculatePosition({
          px,
          py,
          localHeight,
          localWidth,
          globalHeight,
          globalWidth,
          extra: {
            bottom: 10,
            left: localWidth / 2,
            right: -(localWidth / 2),
          },
          popupWidth: 290,
        });
        setModalPosition(data);
        setShowAudioMuteModal(true);
      },
    );
  };
  const onPress = () => {
    showAudioModal();
  };
  return props?.render ? (
    props.render(onPress)
  ) : (
    <>
      <RemoteMutePopup
        type="audio"
        actionMenuVisible={showAudioMuteModal}
        setActionMenuVisible={setShowAudioMuteModal}
        name={null}
        modalPosition={modalPosition}
        onMutePress={() => {
          onPressAction();
          setShowAudioMuteModal(false);
        }}
      />
      <TertiaryButton
        setRef={ref => (audioBtnRef.current = ref)}
        onPress={onPress}
        text={muteAllAudioButton}
      />
    </>
  );
};

export interface MuteAllVideoButtonProps {
  render?: (onPress: () => void) => JSX.Element;
}
export const MuteAllVideoButton = (props: MuteAllVideoButtonProps) => {
  const [showVideoMuteModal, setShowVideoMuteModal] = useState(false);
  const videoBtnRef = useRef(null);
  const [modalPosition, setModalPosition] = useState({});
  const muteRemoteVideo = useRemoteMute();
  const {width: globalWidth, height: globalHeight} = useWindowDimensions();
  //commented for v1 release
  //const muteAllVideoButton = useString('muteAllVideoButton')();
  const muteAllVideoButton = 'Turn off all cameras';
  const onPressAction = () => muteRemoteVideo(MUTE_REMOTE_TYPE.video);
  const showVideoModal = () => {
    videoBtnRef?.current?.measure(
      (_fx, _fy, localWidth, localHeight, px, py) => {
        const data = calculatePosition({
          px,
          py,
          localHeight,
          localWidth,
          globalHeight,
          globalWidth,
          extra: {
            bottom: 10,
            left: globalWidth < 720 ? 0 : localWidth / 2,
            right: globalHeight < 720 ? 0 : -(localWidth / 2),
          },
          popupWidth: 290,
        });
        setModalPosition(data);
        setShowVideoMuteModal(true);
      },
    );
  };
  const onPress = () => {
    showVideoModal();
  };
  return props?.render ? (
    props.render(onPress)
  ) : (
    <>
      <RemoteMutePopup
        type="video"
        actionMenuVisible={showVideoMuteModal}
        setActionMenuVisible={setShowVideoMuteModal}
        name={null}
        modalPosition={modalPosition}
        onMutePress={() => {
          onPressAction();
          setShowVideoMuteModal(false);
        }}
      />
      <TertiaryButton
        setRef={ref => (videoBtnRef.current = ref)}
        onPress={onPress}
        text={muteAllVideoButton}
      />
    </>
  );
};

const HostControlView = () => {
  //commented for v1 release
  //const hostControlsLabel = useString('hostControlsLabel')();
  const {
    question,
    setQuestion,
    answers,
    setAnswers,
    showModal,
    setShowModal,
    setIsModalOpen,
  } = useContext(PollContext);

  const createPoll = () => {
    setShowModal(true);
  };

  const startPoll = () => {
    setIsModalOpen(true);
    setShowModal(false);
    const payload = JSON.stringify({question, answers});
    events.send(controlMessageEnum.initiatePoll, payload);
  };

  const closeAndSavePoll = () => {
    setShowModal(false);
  };
  return (
    <>
      <View style={style.container}>
        {!$config.AUDIO_ROOM && <MuteAllVideoButton />}
        <Spacer horizontal size={16} />
        <MuteAllAudioButton />
      </View>
      <Spacer horizontal size={16} />
      <View style={style.containerBorder}>
        <TouchableOpacity onPress={createPoll}>
          <Text style={style.text}>Create A Poll</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={showModal} transparent={true} animationType="fade">
        <View style={style.modalContainer}>
          <View style={style.modalContent}>
            <Text style={style.text}>Enter your poll question:</Text>
            <Spacer size={26} />
            <TextInput
              style={style.input}
              value={question}
              onChangeText={setQuestion}
              placeholder="Type your question here"
              multiline={true}
            />

            {answers.map((answer, i) => (
              <div key={i}>
                <br />
                <TextInput
                  style={{borderColor: 'black'}}
                  value={answer.option}
                  onChangeText={value =>
                    setAnswers([
                      ...answers.slice(0, i),
                      {option: value, votes: 0},
                      ...answers.slice(i + 1),
                    ])
                  }
                  placeholder={`Poll answer ${i + 1}`}
                />
              </div>
            ))}
            <br />
            <View style={style.container}>
              <View style={style.containerColor}>
                <TouchableOpacity onPress={startPoll}>
                  <Text style={style.textColor}>Start Poll</Text>
                </TouchableOpacity>
              </View>
              <Spacer horizontal size={16} />
              <View style={style.containerBorder}>
                <TouchableOpacity onPress={closeAndSavePoll}>
                  <Text style={style.text}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  containerColor: {
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderWidth: 0,
    borderRadius: ThemeConfig.BorderRadius.small,
    backgroundColor: $config.PRIMARY_ACTION_BRAND_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerBorder: {
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: $config.SECONDARY_ACTION_COLOR,
    borderRadius: ThemeConfig.BorderRadius.small,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {},
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    minHeight: 100,
    marginBottom: 20,
  },
  text: {
    color: $config.SECONDARY_ACTION_COLOR,
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontSize: ThemeConfig.FontSize.small,
    fontWeight: '600',
  },
  textColor: {
    color: $config.PRIMARY_ACTION_TEXT_COLOR,
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontSize: ThemeConfig.FontSize.small,
    fontWeight: '600',
  },
});

export default HostControlView;
