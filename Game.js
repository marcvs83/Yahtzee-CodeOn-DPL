import React from 'react';
import { connect } from 'react-redux';
import { H1, H3, Button } from 'native-base';
import { View, ScrollView, Platform, Dimensions, Text} from 'react-native';
import Board from './Board';
import ScoreCard from './ScoreCard';
import { postScore } from './actions/scores';
import { resetRoll, newGame, rollDice, toggleKept } from './actions/mechanics';
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class Game extends React.Component {
  state = { toggleEdit: false };

  resetRoll = () => {
    this.props.dispatch(resetRoll());
  }

  rollDice = () => {
    let { currentGame: { dice, keep }, dispatch } = this.props;
    dispatch(rollDice(dice, keep));
  }

  toggleKept = (i) => {
    let { currentGame: { keep }, dispatch } = this.props;
    dispatch(toggleKept(keep, i));
  }

  endGame = () => {
    let { user, dispatch, currentGame: { completed } } = this.props;
    if (!completed)
      dispatch(postScore(this.props.user, this.calculateTotal()));
  }

  newGame = () => {
    this.props.dispatch(newGame());
  }

  calculateTotal = () => {
    return this.props.currentGame.scores.reduce( (total, entry) => {
      let score = entry.score || 0;
      return total + score;
    }, 0);
  }

  render() {
    let { user: { nickname }, toggleEdit, currentGame: { roll, dice, keep, completed } } = this.props;

    return (
      <View>
        <H3 style={styles.score}>Current Score: {this.calculateTotal().toString()}</H3>
        <ScrollView style={styles.scoreCard}>
          <ScoreCard endGame={this.endGame} />
        </ScrollView>
        <View>
          { completed ?
            <View>
              <H1>Game Over</H1>
              <Button block danger onPress={this.newGame}>
                <Text>
                  New Game?
                </Text>
              </Button>
            </View>
            :
            <Board />
          }
        </View>
      </View>
    )
  }
}

const styles = {
  scoreCard: {
    backgroundColor: '#E6E6FA',
    height: deviceHeight - 200
  },
  score: {
    backgroundColor: 'green',
    color: 'white',
  }
}

const mapStateToProps = (state) => {
  return { user: state.user, currentGame: state.currentGame }
}

export default connect(mapStateToProps)(Game);
