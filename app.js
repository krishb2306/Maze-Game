import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text,Platform, StyleSheet,Image, SafeAreaView, Pressable, Modal,Dimensions, FlatList, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { Gyroscope, Accelerometer } from 'expo-sensors';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { LogBox } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Stopwatch, Timer } from 'react-native-stopwatch-timer'
import { textShadowColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';


LogBox.ignoreAllLogs();

function HomeScreen({navigation}) {
  const[instructModal, setInstruct] = useState(false)
  const [loaded] = useFonts({
    Maze: require('./assets/maze.ttf'),
  });
  if (!loaded) {
    return <AppLoading/>;
  } else {
  
  return (
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={['#432371','#FAAE7B',  'transparent']}
        style={styles.background}
      />
      <SafeAreaView style = {styles.safeAreaStyle}>
      <View style = {styles.topCont}>
        <Text style = {styles.mazeTitle}>maze king</Text>
        <Text style = {styles.flippedTitle}>gnik ezam</Text>
      </View>
      <View style = {styles.middleCont}>
      <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={instructModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.instructModal}>
          <TouchableOpacity
              style = {styles.instructCloseButton} 
        
              onPress={() => {setInstruct(false)}}
              >
          <Text style = {{color: "white"}}>x</Text>
            </TouchableOpacity>
          <Text style = {{textAlign: "center"}}> Tilt your phone or use the buttons to beat all 11 mazes in the fastest time!</Text>
          <View style = {styles.keyCont}>
          <View style = {{margin: 8,width: 35, height: 35, backgroundColor: "#E85D75"}}>

          </View>
          <Text> - Your Player</Text>
          </View>

          <View style = {styles.keyCont}>
          <View style = {{margin: 8,width: 35, height: 35, backgroundColor: "#49769D"}}>
          </View>
          <Text> - Your Goal</Text>
          </View>

          <View style = {styles.keyCont}>
          <Image
            style= {{
              width: 35,
              height: 35,
              margin: 8,
            }}
            source = {
              require('./assets/beye.png')
            }
            >
      
          </Image>
          <Text> - Manual Mode</Text>
          </View>
          
          <View style = {styles.keyCont}>
          <Image
            style= {{
              width: 35,
              height: 35,
              margin: 8,
            }}
            source = {
              require('./assets/breset.png')
            }
            >
      
          </Image>
          <Text> - Resets Player</Text>
          </View>

          <View style = {styles.keyCont}>
          <Image
            style= {{
              width: 35,
              height: 35,
              margin: 8,
            }}
            source = {
              require('./assets/bpause.png')
            }
            >
      
          </Image>
          <Text> - Pauses Timer</Text>
          </View>
            
          </View>
        </View>
      </Modal>
    </View>
      <Image
        style={{height: 325, width: 325, resizeMode: "contain", borderColor: "black", borderWidth: 1}}
        source={require('./assets/mazeFour.jpg')}
      />
      </View>
      <View style = {styles.bottomCont}>
        <TouchableOpacity
        style = {styles.startButton}
        onPress = {() => {navigation.navigate("Game")}}
        >
          <Text style = {styles.buttonFont}> START </Text>
        </TouchableOpacity>

        <TouchableOpacity
        style = {styles.startButton}
        onPress = {() => {setInstruct(true)}}
        >
          <Text style = {styles.buttonFont}> INSTRUCTIONS </Text>
        </TouchableOpacity>

      </View>
      
      </SafeAreaView>
      
    </View>
  );
}
}

function GameScreen() {
  const[modalOpen, setModal] = useState(false)
  const[run, setRun] = useState(true)
  const[ballX, setBallX] = useState()
  const[ballY, setBallY] = useState()
  const[orgballX, setorgBallX] = useState()
  const[orgballY, setorgBallY] = useState()
  const[endX, setEndX] = useState()
  const[endY, setEndY] = useState()
  const[level, setLevel] = useState(1)
  const[pixelDim, setPixelDim] = useState(40)
  const[size, setSize] = useState(5)
  const[startTime, setStartTime] = useState(false)
  const[resetTime, setResetTime] = useState(false)

  useEffect (() => {
    if(run == true){
      if(modalOpen == false && gameOverModal == false && showStart == false && leaderboard == false){
      setStartTime(true)
      setResetTime(false)
      }
      else {
        setStartTime(false)
      }
    let tempWidth = Math.floor(windowWidth/pixelDim)
    let tempHeight = Math.floor((windowHeight/pixelDim)/2.33)
    let tempBorders = [];
    let tempVisited = [];
    let count = 0

    for(let i = 0; i < size; i++){
      tempBorders.push([])
      tempVisited.push([])
      for(let j = 0; j < size; j++){
        tempBorders[i].push({id: count, top: true, bottom: true, left: true, right: true, ball: false, goal: false})
        count += 1;
        tempVisited[i].push({c: false})
      }
    }
    backwards(tempVisited, tempBorders, 0, 0)

    let tempBX = 0
    setBallX(tempBX)
    setorgBallX(tempBX)
    let tempBY = 0
    setBallY(tempBY)
    setorgBallY(tempBY)
    let tempEX = size-1
    setEndX(tempEX)
    let tempEY = size-1
    setEndY(tempEY)

    tempBorders[tempBX][tempBY].ball = true
    tempBorders[tempEX][tempEY].goal = true

    setItems(tempBorders)
    setRun(false)

    } 

  }, [run])

  const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  useEffect(() => {
  if(Platform.OS == "ios"){
  if(modalOpen == false && showButtons == false && gameOverModal == false && showStart == false && leaderboard == false){
    if(Math.abs(data.x) > Math.abs(data.y)){
      if(round(data.x) < -0.5){
        left()
      }
      else if (round(data.x) > 0.5){
        right()
      }
    }
    else {
      if (round(data.y) < -0.5){
        down()
      }
      else if(round(data.y) > 0.5){
        up()
      }
    }
  }}
  else if(Platform.OS == "android"){
    if(modalOpen == false && showButtons == false && gameOverModal == false && showStart == false && leaderboard == false){
      if(Math.abs(data.x) > Math.abs(data.y)){
        if(round(data.x) > -0.5){
          left()
        }
        else if (round(data.x) < 0.5){
          right()
        }
      }
      else {
        if (round(data.y) > -0.5){
          down()
        }
        else if(round(data.y) < 0.5){
          up()
        }
      }
    }
  }
  
  },[data, modalOpen])

  const [items, setItems] = useState([])

  function up () {
    if (ballX - 1 >= 0 && !items[ballX][ballY].top){
      let temp = [...items]
      temp[ballX][ballY].ball = false
      temp[ballX-1][ballY].ball = true
      setItems(temp);
      setBallX(ballX-1)
      gameOver(ballX -1, ballY)
    }
    
  }

  function down () {
    if (ballX + 1 >= 0 && !items[ballX][ballY].bottom){
      let temp = [...items]
      temp[ballX][ballY].ball = false
      temp[ballX+1][ballY].ball = true
      setItems(temp);
      setBallX(ballX+1)
    gameOver(ballX +1, ballY)
    
    }
    
  }

  function right () {
    if (ballY + 1 >= 0 && !items[ballX][ballY].right){
      let temp = [...items]
      temp[ballX][ballY].ball = false
      temp[ballX][ballY+1].ball = true
      setItems(temp);
      setBallY(ballY+1)
      gameOver(ballX, ballY + 1)
     
    }
    
  }

  function left () {
    if (ballY - 1 >= 0 && !items[ballX][ballY].left){
      let temp = [...items]
      temp[ballX][ballY].ball = false
      temp[ballX][ballY-1].ball = true
      setItems(temp);
      setBallY(ballY-1)
      gameOver(ballX, ballY - 1)
    }
  }

  function reset() {
    let temp = [...items]
    temp[ballX][ballY].ball = false
    temp[orgballX][orgballY].ball = true
    setBallX(orgballX)
    setBallY(orgballY)
    setItems(temp) 
  }

  function gameOver(x, y){ 
    if(items[x][y] == items[endX][endY]){
      //setModal(true)
      nextLevel()
      if(size == 15){
      setLevel(1)
      //setStartTime(false)
      }
      else {
        setLevel(level + 1)
      }
    }
    else{
      null
    }
  }

  function startOver (){
    setSize(5)
    setLevel(1)
    setPixelDim(40)
    setRun(true)
    setStartTime(true)
    setResetTime(true)
    setShowButtons(false)
    setShowStart(true)
    setObj([{level: "#", time: "Time Interval"}])
  }

  function nextLevel () {
    addToList()
    //setLevel(level + 1)
    setSize(size + 1)
    let tempCount = 2
    if(size >= 9 && size < 11){
      setPixelDim(35)
    }
    else if (size >= 11 && size < 14){
      setPixelDim(27)
    }
    else if (size == 14){
      setPixelDim(23)
    }
    else if (size == 15 ){
      setGameOver(true)
      //setResetTime(false)
      setSize(5)
      setStartTime(false)
      setPixelDim(40)
      addToLeaderboard()
      //setLevel(-1)
    }
    setRun(true)
  }

  const[score, setScore] = useState(0)

  function backwards(visited, borders, x, y) {
    let possibleDirections = [];
    visited[x][y].c = true

    if(x != 0 && visited[x-1][y].c == false){
      possibleDirections.push("N");
    }
    if(y != visited[x].length - 1 && visited[x][y+1].c == false){
      possibleDirections.push("E")
    }
    if(x != visited.length - 1 && visited[x+1][y].c == false){
      possibleDirections.push("S")
    }
    if(y != 0 && visited[x][y-1].c == false){
      possibleDirections.push("W")
    }


    while(possibleDirections.length != 0){
      let tempIndex = Math.floor(Math.random() * possibleDirections.length);

      if(possibleDirections[tempIndex] == "N" && visited[x-1][y].c == false){
        borders[x][y].top = false
        borders[x-1][y].bottom = false
        backwards(visited, borders, x-1, y)
      }
      else if(possibleDirections[tempIndex] == "E" && visited[x][y+1].c == false){
        borders[x][y].right = false
        borders[x][y+1].left = false
        backwards(visited, borders, x, y+1)
      }
      else if(possibleDirections[tempIndex] == "S" && visited[x+1][y].c == false){
        borders[x][y].bottom = false
        borders[x+1][y].top = false
        backwards(visited, borders, x+1, y)
      }
      else if(possibleDirections[tempIndex] == "W" && visited[x][y-1].c == false){
        borders[x][y].left = false
        borders[x][y-1].right = false
        backwards(visited, borders, x, y-1)
      }
      possibleDirections.splice(tempIndex, 1)
    }
  }

  const [subscription, setSubscription] = useState(null);

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener(accelerometerData => {
        setData({
          x: accelerometerData.x,
          y: accelerometerData.y,
          z: accelerometerData.z
        });
      })
    );
  };

  function round(n) {
    if (!n) {
      return 0;
    }
    return Math.floor(n * 100) / 100;
  }

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
     _subscribe();
     return () => _unsubscribe();
   }, []);

  const { x, y, z } = data;
  const windowWidth = Dimensions.get('screen').width;
  const windowHeight = Dimensions.get('screen').height; 

  function renderRows({item, index}) {
    return(
    <FlatList
        scrollEnabled= {false}
        data = {item}
        horizontal = {true}
        renderItem={renderCell}
        keyExtractor={(item, index) => index.toString()}
       />
    )
  }

  function renderCell({item, index}) {
    return ( 
      <View style = {{
      width: pixelDim,
      height: pixelDim,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: item.goal == true ? "#49769D" : "#FFC59E" && item.ball == true ? "#E85D75" : "#FFC59E",
      borderColor: "#3B4C54",
      borderTopWidth: item.top == true ? 1: 0,
      borderBottomWidth: item.bottom == true ? 1: 0,
      borderLeftWidth: item.left == true ? 1: 0,
      borderRightWidth: item.right == true ? 1: 0,
      }}>
        
      </View>
      

    )
  }

  function addToList() {
    let tempOne = new Object({level: level, time: finalTime})
    setObj([...obj, tempOne])
    
  }

  function addToLeaderboard() {
    let today = new Date()
    let tempDate = (today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear();
    
    let tempObj = new Object({date: tempDate, time: finalTime})
    setLD([...leaderboardData, tempObj])
  }

  const[showButtons, setShowButtons] = useState(false)
  const[tempCount, setTempCount] = useState(0)
  const[pauseCount, setPauseCount] = useState(0)
  const[finalTime, setFinalTime] = useState(0)
  const[obj, setObj] = useState([{level: "#", time: "Time Interval"}])
  const[gameOverModal, setGameOver] = useState(false)
  const[leaderboard, setLeaderboard] = useState(false)
  const[leaderboardData, setLD] = useState([{date: "Date", time: "Total Time"}])
  const[dateForm, setDateForm] = useState(0)
  const[enabled, setEnabled] = useState(true)
  const[showStart, setShowStart] = useState(true)
  
  return (
    <View style={styles.container}> 
    <LinearGradient
        // Background Linear Gradient
        colors={['#432371','#FAAE7B',  'transparent']}
        style={styles.background}
      />
    <SafeAreaView style = {styles.safeAreaStyle}>
    <View style = {styles.gameContainer}>
      <View style = {styles.levelCont}>
      <Text style = {styles.gameFont}>LEVEL</Text>
      <Text style = {styles.levelNumber}> {level}</Text>
      </View>
      <View style = {styles.timeCont}>
      <Text>{
                <Stopwatch  
                msecs = {false} 
                start={startTime}
                options={options}
                reset={resetTime}
                getTime = {(time) => setFinalTime(time)}
                
                 />
                 }</Text>
      </View>
      <View style = {styles.gameButtonCont}> 
      <TouchableOpacity
        style = {styles.colorPickerButton} 
        disabled = {enabled}
        onPress={() => {tempCount % 2 == 0 ? [setShowButtons(true), setTempCount(tempCount + 1)]: [setShowButtons(false), setTempCount(tempCount + 1)]}}
      >
      <Image
      style= {{
        width: 40,
        height: 40
      }}
      source = {
        require('./assets/eye.png')
      }
      >
      
      </Image>
            </TouchableOpacity>
      <TouchableOpacity
        style = {styles.colorPickerButton} 
        onPress={() => {reset()}}
        disabled = {enabled}
      >
      <Image
      style= {{
        width: 35,
        height: 35
      }}
      source = {
        require('./assets/reset.png')
      }
      >
      
      </Image>
            </TouchableOpacity>
            <TouchableOpacity
        style = {styles.colorPickerButton}
        disabled = {enabled} 
        onPress={() => {pauseCount % 2 == 0 ? [setModal(true), setStartTime(false)]: null}}
      >
      <Image
      style= {{
        width: 40,
        height: 40
      }}
      source = {
        require('./assets/pause.png')
      }
      >
      
      </Image>
            </TouchableOpacity>
      </View>
       </View>
       
      <View style = {styles.mazeContainer}>



      <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalOpen}
      >
        <View style={styles.centeredView}>
          <View style={styles.pauseModal}>
          <TouchableOpacity
              style = {styles.pauseCloseButton} 
        
              onPress={() => {setModal(false);setStartTime(true)}}
              >
          <Text style = {{color: "white"}}>x</Text>
            </TouchableOpacity>
            <Text style = {{textAlign: "left",}}>As you progress your level and time interval will be added on below</Text>
            <Text> </Text>
        <FlatList
        data={obj}
        renderItem={({ item, index }) => (
        <View style = {{marginTop: 3}}>
        <Text style = {styles.levelFont}>Level: {item.level} --- {item.time}</Text>
        </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        />
            
          </View>
        </View>
      </Modal>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={gameOverModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.GOandLDmodal}>
          <TouchableOpacity
              style = {styles.GOandLDcloseButton} 
        
              onPress={() => {setGameOver(false); startOver()}}
              >
          <Text style = {{color: "white"}}>x</Text>
            </TouchableOpacity>
            <Text style = {{fontFamily: "Maze", fontSize: 30, marginBottom: 15}}>GAME OVER</Text>
            <TouchableOpacity
            style = {{width: "40%", height: "10%",marginBottom: 15,borderColor: "black", borderWidth : 1, borderRadius: 25, backgroundColor: "white", justifyContent: "center", alignItems: "center"}}
            onPress = {() => {setLeaderboard(true); setGameOver(false)}}
            >
              <Text>All Times</Text>
            </TouchableOpacity>
            <Text style = {styles.levelFont}>Total Time: {finalTime}</Text>
            
            <Text></Text>
            <Text style = {styles.levelFont}>Press "X" to Play Again</Text>
            <Text></Text>
            <FlatList
            data={obj}
            renderItem={({ item, index }) => (
            <View style = {{margin: 0}}>
            <Text style = {styles.levelFont}>Level: {item.level} --- {item.time}</Text>
            </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            />
            
            
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={leaderboard}
      >
        <View style={styles.centeredView}>
          <View style={styles.GOandLDmodal}>
          <TouchableOpacity
              style = {styles.GOandLDcloseButton} 
        
              onPress={() => {setLeaderboard(false); startOver()}}
              >
          <Text style = {{color: "white"}}>x</Text>
            </TouchableOpacity>
            <Text style = {{fontFamily: "Maze", fontSize: 30, marginBottom: 15}}>ALL TIMES</Text>
            <Text style = {styles.levelFont}>Press "X" to Play Again</Text>
            <Text></Text>
            <FlatList
            data={leaderboardData}
            renderItem={({ item, index }) => (
            <View style = {{margin: 0, marginTop: 3}}>
            <Text style = {styles.levelFont}>{item.date} --- {item.time}</Text>
            </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            />
            
            
          </View>
        </View>
      </Modal>

    </View>



      
       <FlatList
        scrollEnabled= {false}
        //contentContainerStyle = {{borderWidth: 1}}
        data = {items}
        renderItem={renderRows}
        keyExtractor={(item, index) => index.toString()}
       />
       </View>
       
       <View style = {styles.startGame}>
       {showStart && (
        <View style = {{width: "90%", height: "60%", borderRadius: 25, backgroundColor: "white", justifyContent: "center", alignItems: "center"}}> 
       <TouchableOpacity
       style = {{width: "90%", height: "60%", borderRadius: 25, backgroundColor: "white", justifyContent: "center", alignItems: "center"}}
       onPress = {() => {setStartTime(true); setRun(true); setShowStart(false); setEnabled(false)}}
        >
         <Text style = {{fontFamily: "Maze", fontSize: 30}}>BEGIN</Text>
       </TouchableOpacity>
       </View>
       )}
       </View>
       
       <View style = {styles.hiddenButtonsBox}>
         
       {showButtons && (
         <View style = {styles.hiddenButtons}> 
       <TouchableOpacity
        style = {styles.hiddenButtonStyle} 
        onPress={() => {up()}}
      >
      <Image
      style= {{
        width: 100,
        height: 100
      }}
      source = {
        require('./assets/up.png')
      }
      >
      
      </Image>
            </TouchableOpacity>
            <TouchableOpacity
        style = {styles.hiddenButtonStyle} 
        onPress={() => {down()}}
      >
      <Image
      style= {{
        width: 100,
        height: 100
      }}
      source = {
        require('./assets/down.png')
      }
      >
      </Image>
            </TouchableOpacity>
            <TouchableOpacity
        style = {styles.hiddenButtonStyle} 
        onPress={() => {left()}}
      >
      <Image
      style= {{
        width: 100,
        height: 100
      }}
      source = {
        require('./assets/left.png')
      }
      >
      
      </Image>
            </TouchableOpacity>
            <TouchableOpacity
        style = {styles.hiddenButtonStyle} 
        onPress={() => {right(); console.log(obj)}}
      >
      <Image
      style= {{
        width: 100,
        height: 100
      }}
      source = {
        require('./assets/right.png')
      }
      >
      
      </Image>
            </TouchableOpacity>
            
       </View>
       )}
       
       </View>
       
       
       </SafeAreaView>
       
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false, gestureEnabled: false}} >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const options = {
  container: {
    //backgroundColor: 'red',
    borderRadius: 5,
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -7
  },
  text: {
    fontSize: 15,
    color: 'black',
  }
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#64B6AC",
    alignItems: "center",
    justifyContent: "center",
    width: "100%"
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: windowHeight ,
  },
  topCont: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    flex: 0.2,
    marginTop: 20,
    //backgroundColor: "red"
  },
  middleCont: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
    flex: 0.5,
    //backgroundColor: "green"
  },
  bottomCont: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    flex: 0.4,
    //backgroundColor: "yellow"
  },
  safeAreaStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%"
  },
  mazeTitle: {
    color: "white",
    //backgroundColor: "#B5FED9",
    fontSize: 50,
    fontFamily: "Maze"
  },
  flippedTitle: {
    color: "white",
    //backgroundColor: "#B5FED9",
    fontSize: 50,
    transform: [{ rotate: '180deg'}],
    fontFamily: "Maze",
    marginLeft: -8.2,
    opacity: 0.6
  },
  buttonFont: {
    color: "black",
    //backgroundColor: "#B5FED9",
    fontSize: 25,
    fontFamily: "Maze"
  },
  gameFont: {
    color: "black",
    //backgroundColor: "#B5FED9",
    fontSize: 20,
    fontFamily: "Maze"
  },
  levelNumber: {
    color: "black",
    fontWeight: "bold",
    fontSize: 14
  },
  gameContainer: {
    flex: 0.1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    margin: 10,
    borderBottomWidth: 1,
    borderColor: "white",
    //backgroundColor: "red",
    width: "100%",
    marginTop: Platform.OS == "android" ? 30 : 0 
  },

  startGame: {
    width: "50%",
    height: "10%",
    //backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center"
  },

  mazeContainer: {
    flex: 0.7,
    //resizeMode: "contain",
    marginTop: 20,
    //width: "100%",
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "orange"
  },

  hiddenButtonsBox: {
    flex: 0.25,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    margin: 10,
    //backgroundColor: "orange",
    width: "100%"
  },
  hiddenButtons: {
    flex: 0.25,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    margin: 10,
    //backgroundColor: "orange",
    width: "100%"
  },

  levelCont: {
    backgroundColor: "white",
    height: "50%",
    flexDirection: "row",
    width: "25%",
    borderRadius: 25,
    margin: 10,
    justifyContent: 'center',
    alignItems: "center"
  },
  timeCont: {
    backgroundColor: "white",
    height: "50%",
    margin: 10,
    width: "25%",
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: "center"
  },
  gameButtonCont: {
    //backgroundColor: "white",
    height: "50%",
    width: "30%",
    margin: 13,
    flexDirection: "row",
    //borderRadius: 25,
    justifyContent: 'center',
    alignItems: "center",
    
  },

  icons: {
    height: 20,
    width: 20
  },

  text: {
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  startButton: {
    width: "60%",
    height: "15%",
    margin: 10,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  sqaure: {
    width: 50,
    height: 50,
    backgroundColor:"red",
    borderColor: "black",
    borderWidth: 1
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  pauseModal: {
    marginBottom: 60,
    width: "70%",
    height: "40%", 
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "flex-start",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  instructModal: {
    marginBottom: 60,
    //flexDirection: "row",
    width: "85%",
    height: "50%", 
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  GOandLDmodal: {
    marginBottom: 60,
    width: "80%",
    height: "50%", 
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "flex-start",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },

  colorPickerButton: {
    //backgroundColor: "red",
    height: 27,
    width: 27,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  hiddenButtonStyle: {
    //backgroundColor: "red",
    height: 27,
    width: 27,
    margin: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  keyCont: {
    //backgroundColor: "red",
    width: "100%",
    flexDirection: "row",
    margin: -5,
    height: "20%",
    justifyContent: "center",
    alignItems: "center"
  },
  keyContInfo: {
    backgroundColor: "green",
    width: "60%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  instructCloseButton: {
    backgroundColor: "grey",
    height: 27,
    width: 27,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 27/2,
    alignSelf: "flex-end",
    position: "absolute",
    left: "112%",
    bottom: "110%"  
  },
  pauseCloseButton: {
    backgroundColor: "grey",
    height: 27,
    width: 27,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 27/2,
    alignSelf: "flex-end",
    position: "absolute",
    left: "117%",
    bottom: "114%"  
  },
  GOandLDcloseButton: {
    backgroundColor: "grey",
    height: 27,
    width: 27,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 27/2,
    alignSelf: "flex-end",
    position: "absolute",
    left: "114%",
    bottom: "110%"  
  },
  levelFont: {
    fontSize: 15,
    margin: 0,
    //textAlign: "center",
    color: "black",
  },
  bestFont: {
    fontSize: 15,
    margin: 0,
    //textAlign: "center",
    color: "green",
  },
  worstFont: {
    fontSize: 15,
    margin: 0,
    //textAlign: "center",
    color: "red",
  }
});


export default App;
