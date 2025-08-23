import React, { useMemo } from 'react';
import { Pressable, Text, ImageBackground, View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite, selectIsFavorite } from '../redux/favoritesSlice';
import HeartIconSVG from '../assets/svg/HeartIconSVG';
import HeartIconSVGOnPress from '../assets/svg/HeartIconSVGOnPress';

const FALLBACK_COLORS = {
  gelato: '#FFCC00',
  'fruit-tart': '#00FF4D',
  panettone: '#C08FFF',
  madeleine: '#00FFDD',
  'creme-brulee': '#F679FF',
};

export default function DessertCard({ item, onPress }) {
  const dispatch = useDispatch();
  const isFav = useSelector(selectIsFavorite(item.id));

  const pillColor = useMemo(
    () => item?.pillColor || FALLBACK_COLORS[item?.id] || '#BFE8FF',
    [item]
  );

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <ImageBackground
        source={item.image}
        style={styles.bg}
        imageStyle={styles.bgImg}
        resizeMode="cover"
      >
        <View style={styles.topRow}>
          <View style={[styles.pill, { backgroundColor: pillColor }]}>
            <Text style={styles.pillText} numberOfLines={1}>
              {item.category}
            </Text>
          </View>

          <Pressable
            style={styles.heartWrap}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={isFav ? 'Remove from favorites' : 'Add to favorites'}
            onPress={() => dispatch(toggleFavorite(item.id))}
          >
            {isFav ? (
              <HeartIconSVGOnPress width={28} height={28} />
            ) : (
              <HeartIconSVG width={28} height={28} />
            )}
          </Pressable>
        </View>

        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

const CARD_W = 350;
const CARD_H = 188;

const styles = StyleSheet.create({
  card: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 40,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFCC00',
  },
  bg: { flex: 1, justifyContent: 'space-between' },
  bgImg: { borderRadius: 40 },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    marginHorizontal: 18,
  },

  pill: {
    width: 240,
    height: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    fontFamily: 'BagelFatOne-Regular',
    fontWeight: '400',
    fontSize: 22,
    lineHeight: 30,
    letterSpacing: -0.32,
    color: '#0F0F0F',
  },

  heartWrap: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },

  titleRow: { marginLeft: 18, marginBottom: 12 },
  title: {
    fontFamily: 'BagelFatOne-Regular',
    fontWeight: '400',
    fontSize: 34,
    lineHeight: 44,
    letterSpacing: -0.32,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowRadius: 4,
  },
});
