import React, { Component } from 'react';
import { TextInput ,StyleSheet} from 'react-native';
import propTypes from 'prop-types';
import debounce from 'lodash.debounce'
 class SearchBar extends Component {
     static propTypes={
         searchDeals:propTypes.func.isRequired,
         initialSearchTerm:propTypes.string.isRequired,
     }
     state={
       searchTerm:this.props.initialSearchTerm,
     };
     searchDeals=(searchTerm)=>{
         this.props.searchDeals(searchTerm);
         this.inputElement.blur();
     }
     debouncedSearchDeals=debounce(this.props.searchDeals,300);
     
     handleChange=(searchTerm)=>{
     this.setState({searchTerm},()=>{
         this.debouncedSearchDeals(this.state.searchTerm);
     });
     };
    render() {
        return (
           <TextInput
           ref={(inputElement)=>{this.inputElement=inputElement;}}
           value={this.state.searchTerm}
           onChangeText={this.handleChange}
           placeholder="Search all deals "
           style={StyleSheet.input}
           />
        );
    }
}
const styles=StyleSheet.create({
    input:{
        height:40,
        marginHorizontal:12,
        marginLeft:10,
    },
});
export default SearchBar;