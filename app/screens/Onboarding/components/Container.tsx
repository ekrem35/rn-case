import React, {useEffect, useState} from 'react';

import {
  Dimensions,
  Image,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';

import ContainerBgSVG from '../assets/container.bg.svg';

import shadowImage from '../assets/shadow.png';

type ContainerProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export default function Container(props: ContainerProps) {
  const initialDimensions = useWindowDimensions();
  const [dimensions, setDimensions] = useState(initialDimensions);

  function isPortrait() {
    return dimensions.height >= dimensions.width;
  }

  function getBgTransformStyles() {
    return {
      transform: [
        {
          rotate: isPortrait() ? '0deg' : '90deg',
        },
      ],
      top: isPortrait() ? 0 : -dimensions.height / 1.71,
      right: isPortrait() ? 0 : 90,
    };
  }

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      changedDimens => {
        setDimensions(changedDimens.screen);
      },
    );

    return () => subscription.remove();
  }, []);

  return (
    <View>
      <View style={[defaultContainerStyle.content, props.style]}>
        <View style={[defaultContainerStyle.childrenArea, props.contentStyle]}>
          {props.children}
        </View>

        <ContainerBgSVG
          style={[defaultContainerStyle.containerBg, getBgTransformStyles()]}
        />
      </View>

      <Image
        source={shadowImage}
        height={50}
        style={[
          defaultContainerStyle.shadowImage,
          {
            top: dimensions.height / 1.5,
            width: dimensions.width,
          },
        ]}
        resizeMode="cover"
      />
    </View>
  );
}

const defaultContainerStyle = StyleSheet.create({
  content: {
    padding: 24,
  },
  childrenArea: {
    zIndex: 99,
  },
  containerBg: {
    zIndex: 1,
    position: 'absolute',
  },
  shadowImage: {
    height: 60,
    position: 'absolute',
  },
});