import React from 'react';
import AppLoading from 'expo-app-loading';
import { StyleSheet, Text, View, StatusBar, TextInput, Dimensions, Platform, ScrollView } from 'react-native';
import ToDo from "./ToDo";
import { v1 as uuidv1 } from 'react-native-uuid';




const {height, width} = Dimensions.get("window");


export default class App extends React.Component{

  state = {
    newTodo: "",
    loadedToDos: false,
    toDos: {}
  }

  componentDidMount = () => {
    this._loadToDos();
  }


  render() {
    const {newTodo, loadedToDos, toDos} = this.state;
    
    console.log(toDos);

     if(!loadedToDos){
        return <AppLoading />
     }; 

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>my To Do</Text>
          <View style={styles.card}>
            <TextInput style={styles.input} 
            placeholder={"new To Do"}
            value={newTodo}
            onChangeText={this._controllNewToDo}
            placeholderTextColor={"#999"}
            returnKeyType={"done"}
            autoCorrect = {false}
            onSubmitEditing ={this._addToDo}
            />
          
          <ScrollView contentContainerStyle={styles.toDos}>
           {Object.values(toDos).map(toDo => 
           <ToDo key ={toDo.id}
            deleteTodo ={this._deleteToDo}
            uncompleteToDo ={this._uncompleteToDo}
            completeToDo = {this._completeToDo}
            updateToDo = {this._updateToDo}
            {...toDo}/>)}
          </ScrollView>
          
          </View>
      </View>
      );
  }

  _controllNewToDo = text => {
    this.setState ({
      newTodo: text
    });
  };

  _loadToDos = () => {
    this.setState ({
      loadedToDos: true
    });
  };

  _deleteToDo = (id) => {
    this.setState( prevState => {
      const toDos =prevState.toDos;
      delete toDos[id];
      const newState = {
        ...prevState,
        ...toDos
      };

      return{...newState};

    });
  };

  _uncompleteToDo = (id) =>{
    this.setState( prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: false
          }
        }
      }

      return {...newState};
    });
  };

  _completeToDo = (id) => {
    this.setState( prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: true
          }
        }
      }

      return {...newState};
    });

  };

  _updateToDo = (id, text) => {
    this.setState( prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            text: text
          }
        }
      }

      return {...newState};
    });


  }

  _addToDo = () => {
    const{newTodo} =this.state;
    if(newTodo !== ""){

      this.setState( prevState => {

        const ID = uuidv1();
        
        const newToDoObject = {
          [ID] :{
            id: ID,
            isCompleted : false,
            text: newTodo,
            createdAt: Date.now()
          }
        };

        const newState = {
          ...prevState,
          newTodo: "",
          toDos: {
            ...prevState.toDos,
            ...newToDoObject
          }
        }

        return {...newState}

      });
     
    };

  };

   




}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4E9DFC',
    alignItems: 'center',
  },
  title: {
    color: "#fff",
    fontSize: 30,
    marginTop: 100,
    fontWeight: "200",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#fff",
    flex: 1,
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
        ios : {
          shadowColor: "#234670",
          shadowOpacity: 0.5,
          shadowRadius: 10,
          shadowOffset:{
            height: -1,
            width: 0,

          }
        },
        android : {
          elevation : 3,
        }
    }) 
  },
  input: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#bbb",
    fontSize: 20,
  },
  toDos: {
    alignItems:"center"
  }

});
