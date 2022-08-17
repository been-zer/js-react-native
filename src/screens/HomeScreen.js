import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import Metaplex from '../../Metaplex';
import logo from '../assets/logo.png';
import NftCard from '../components/NftCard';

const HomeScreen = () => {
  const metaplex = new Metaplex(
    'devnet',
    'B1AfN7AgpMyctfFbjmvRAvE1yziZFDb9XCwydBjJwtRN',
  );

  const [nftList, setNftList] = useState([]);

  useEffect(() => {
    const execute = async () => {
      await metaplex
        .findAllByOwner('B1AfN7AgpMyctfFbjmvRAvE1yziZFDb9XCwydBjJwtRN')
        .then(async data => {
          const newList = data
            .map((item, index) => ({
              mint: item.metadataAccount.mint,
              id: index,
            }))
            .filter(item => !!item.mint);

          setNftList(newList);
        })
        .catch(error => console.log(error));
    };
    execute();
  }, []);

  const renderItem = ({item}) => <NftCard metaplex={metaplex} data={item} />;

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo} source={logo} />
      {nftList && nftList.length === 0 ? (
        <View style={styles.loadingView}>
          <ActivityIndicator size="large" color={'#fff'} />
        </View>
      ) : (
        <FlatList
          key={'nftList'}
          numColumns={2}
          data={nftList}
          renderItem={renderItem}
          initialNumToRender={6}
          onEndReachedThreshold={0.1}
          keyExtractor={item => item.id}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 70,
    height: 50,
  },
  container: {
    flex: 1,
    marginTop: 0,
    backgroundColor: '#000',
  },
  loadingView: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

export default HomeScreen;
