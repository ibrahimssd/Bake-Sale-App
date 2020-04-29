import React, { Component } from 'react';
import {View,Text,StyleSheet,Animated, Easing, Dimensions} from 'react-native';
import ajax from '../ajax';
import DealList from './DealList'
import DealDetail from './DealDetail';
import SearchBar from './SearchBar'
class BakeApp extends React.Component {
    titleXpos= new Animated.Value(0);
    state={
        deals:[],
        dealsFromSearch:[],
        currentDealId:null,
        activeSearchTerm:'',
    }
  
    animateTitle=(direction=1)=>{
        
        const width = Dimensions.get("window").width-150;
        Animated.timing(
            this.titleXpos,{toValue:direction*(width/2),
                      duration:1000,
                      easing:Easing.linear,
            
            }
        ).start((finished)=>{
            if(finished){
            this.animateTitle(-1*direction);
            }
        
        });
    }
    async componentDidMount() {
        
        this.animateTitle();           
        const deals= await   ajax.fetcthInitialDeals();                 
        this.setState({deals});

    };
    searchDeals=async(searchTerm)=>{
        let dealsFromSearch=[];
        if(searchTerm){
            dealsFromSearch= await ajax.fetchDealSearchResults(searchTerm);
        }
        this.setState({dealsFromSearch,activeSearchTerm:searchTerm});
    };
    
    setCurrentDeal=(dealId)=>{
        
          this.setState({
              currentDealId:dealId,
          });
    };

    UnsetCurrentDeal=()=>{
        
        this.setState({
            currentDealId:null,
        });
  };
    currentDeal=()=>{ 
        return this.state.deals.find(
            (deal)=> deal.key===this.state.currentDealId
        );
    }
    render() {
      
        
     if(this.state.currentDealId){
         
         
         return (<View style={styles.main}>
             <DealDetail initialDealData={this.currentDeal()}    onBack={this.UnsetCurrentDeal} />
         </View>)
         
         
     }
     const dealsTodisplay=this.state.dealsFromSearch.length>0?this.state.dealsFromSearch:this.state.deals;
    
        
     if(dealsTodisplay.length>0){
        
   return  (
   
   <View style={styles.main}>
       <SearchBar  searchDeals={this.searchDeals} initialSearchTerm={this.state.activeSearchTerm}/>
       <DealList deals={dealsTodisplay} onItemPress={this.setCurrentDeal}/>
   </View>
   
   )
     }
        return (
            
            <Animated.View style={[{left: this.titleXpos },styles.container]}>                                 
                 <Text style={styles.header}>Bake sale </Text>                                                        
            </Animated.View>
            );
    }
}
const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    header:{
        fontSize:40,

    },
    main:{
        marginTop:30,
    }
})
export default BakeApp;
