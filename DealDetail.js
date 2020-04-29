import React from 'react';
import {View,Text,Image,StyleSheet,TouchableOpacity,PanResponder
    ,Animated,Dimensions, Button,ScrollView,Linking} 
    from 'react-native';
import PropTypes from 'prop-types';
import priceDisplay from '../util';
import ajax from '../ajax';

 class DealDetail extends React.Component {
     imageXPos = new   Animated.Value(0);
     imagePanResponder=PanResponder.create({
         onStartShouldSetPanResponder:()=>true,
         onPanResponderMove:(evt,gs)=>{
            //  console.log("moving",gs.dx)
            this.imageXPos.setValue(gs.dx);
         },
         onPanResponderRelease:(evt,gs)=>{
            this.width = Dimensions.get("window").width-150;
            //  console.log("relaes");
            if(Math.abs(gs.dx) > this.width*0.4){
                const direction =Math.sign(gs.dx);
                Animated.timing(this.imageXPos,{
                    toValue: direction*this.width,
                    duration:250,
                }).start(()=>this.handleSwipe(-1*direction));

            } else {
                Animated.spring(this.imageXPos,{
                    toValue:0,
                }).start();
            }
         },
     });

     handleSwipe=(indexDirection)=>{
         if(!this.state.deal.media[this.state.imageIndex+indexDirection]){
            Animated.spring(this.imageXPos,{
                toValue:0,
            }).start();
            return;
         }
         this.setState((prevState)=>({
           imageIndex:prevState.imageIndex+indexDirection
         }),()=>{
             //
              this.imageXPos.setValue(indexDirection * this.width);
              Animated.spring(this.imageXPos,{
                  toValue:0,
              }).start();
         } );
     }
     static PropTypes={
        initialDealData: PropTypes.object.isRequired,
        onBack:PropTypes.func.isRequired,

     };
     state={
         deal:this.props.initialDealData,
         imageIndex:0,
     };
     async componentDidMount() {
          const fullDeal=await ajax.fetcthDealDetail(this.state.deal.key);
          
          this.setState({
              deal:fullDeal,
          });
     };
     openDealUrl=()=>{
  Linking.openURL(this.state.deal.url);
     };
    render() {
        const {deal}=this.state;
        return (
        <ScrollView style={styles.deal}>
           <TouchableOpacity onPress={this.props.onBack}>
               <Text style={styles.backLink}>Back</Text>
           </TouchableOpacity>
           <Animated.Image   
           
           {...this.imagePanResponder.panHandlers}
           source={{uri:deal.media[this.state.imageIndex]}} 
           style={[{left:this.imageXPos},styles.image]}
           
           />           
           
           <View style={styles.info} >
               
               <Text style={styles.title}>{deal.title}</Text>
               <View style={styles.footer}>
                   
               <Text style={styles.cause}>{deal.cause.name}</Text>
               <Text style={styles.price}>{priceDisplay(deal.price)}</Text>
             
               </View>

           </View>
          {deal.user &&  <View>
               <Image source={{uri:deal.user.avatar}} style={styles.avatar}/>
                <Text>{deal.user.name}</Text>
           </View>}
          
           <View  style={styles.description}>
          <Text>{deal.description}</Text>
           </View>
           <Button title="Buy this deal!"  onPress={this.openDealUrl}/>

        </ScrollView>
        
        );
    }
}
const styles=StyleSheet.create({

    deal:{
        // marginHorizontal:12,
        // marginTop:12,
        marginBottom:20,
        
    },
    image:{
        width:'100%',
        height: 150,
        backgroundColor:'#ccc',
    },
    info:{
        padding:10,
        backgroundColor:'#fff',
        borderColor:'#bbb',
        borderWidth:2,
        borderTopWidth:0,
    },
    title:{
        fontSize:16,
        fontWeight:'bold',
        marginBottom:5,
    },
    footer:{
        flexDirection:'row',
    },
    cause:{
        flex: 2,
    },
    price:{
        flex:1,
        textAlign:'right',
        fontWeight:'bold'
    },
   avatar:{
       width:60,
       height:60,
       marginHorizontal:12,
    marginTop:12,
   },
   description:{
    padding:10,
    backgroundColor:'#fff',
    borderColor:'#bbb',
    borderWidth:2,
    borderTopWidth:0,   
   },
   backLink:{
       marginBottom:5,
       color:'#22f',
       padding:10,
       marginTop:12,
   }
   

});
export default DealDetail;