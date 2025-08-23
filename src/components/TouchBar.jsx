import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Encyclopedia1SVG from '../assets/svg/icons/Encyclopedia1SVG';
import Encyclopedia1SVGOnPress from '../assets/svg/icons/Encyclopedia1SVGOnPress';
import Journal2SVG from '../assets/svg/icons/Journal2SVG';
import Journal2SVGOnPress from '../assets/svg/icons/Journal2SVGOnPress';
import Collections3SVG from '../assets/svg/icons/Collections3SVG';
import Collections3SVGOnPress from '../assets/svg/icons/Collections3SVGOnPress';
import Favorites4SVG from '../assets/svg/icons/Favorites4SVG';
import Favorites4SVGOnPress from '../assets/svg/icons/Favorites4SVGOnPress';
import Game5SVG from '../assets/svg/icons/Game5SVG';
import Game5SVGOnPress from '../assets/svg/icons/Game5SVGOnPress';
import Settings6SVG from '../assets/svg/icons/Settings6SVG';
import Settings6SVGOnPress from '../assets/svg/icons/Settings6SVGOnPress';

const TABS = [
  { key: 'encyclopedia', Inactive: Encyclopedia1SVG, Active: Encyclopedia1SVGOnPress },
  { key: 'journal', Inactive: Journal2SVG, Active: Journal2SVGOnPress },
  { key: 'collections', Inactive: Collections3SVG, Active: Collections3SVGOnPress },
  { key: 'favorites', Inactive: Favorites4SVG, Active: Favorites4SVGOnPress },
  { key: 'game', Inactive: Game5SVG, Active: Game5SVGOnPress },
  { key: 'settings', Inactive: Settings6SVG, Active: Settings6SVGOnPress },
];

const ROUTE_BY_TAB = {
  encyclopedia: 'Main',
  journal: 'MyTasting',
  collections: 'Collections',
  favorites: 'Favorites',
  game: 'Game',
  settings: 'Settings',
};

const TouchBar = ({ active = 'encyclopedia', onTabPress = () => {} }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handlePress = (key) => {
    onTabPress(key);
    const route = ROUTE_BY_TAB[key];
    if (route) navigation.navigate(route);
  };

  return (
    <View style={[styles.wrapper, { bottom: insets.bottom + 16 }]}>
      <View style={styles.bar}>
        {TABS.map(({ key, Inactive, Active }) => {
          const SelectedIcon = active === key ? Active : Inactive;
          return (
            <Pressable key={key} onPress={() => handlePress(key)} style={styles.item} hitSlop={8}>
              <SelectedIcon width={24} height={24} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default TouchBar;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
    elevation: 10,
  },
  bar: {
    width: 286,
    height: 66,
    backgroundColor: '#B78DFF',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#7E52DD',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
  },
  item: {},
});
