import React, { Component } from 'react'
import {View,FlatList,StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import DealItem from './DealItem';
class DealList extends Component {
    static PropTypes={
        deals:PropTypes.array.isRequired,
        onItemPress:PropTypes.func.isRequired,
    }

    render() {
        return (
          <View style={styles.list}>
              <FlatList
                 data={this.props.deals}
        renderItem={({item}) => <DealItem  key={item.key} deal={item}   OnPress={this.props.onItemPress}/>}
               />
              
          </View>  
        );
    }
}

const styles=StyleSheet.create({
     list:{
         backgroundColor:'#eee',
        //  flex:1,
         width:'100%',
        //  paddingTop:50,
     },
});
export default DealList;