import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { DEFAULT_TIMER } from '../../model/config'
import Letter from '../../model/letter'
import Ball from '../../model/ball'
import Hole from '../../model/hole'
import Level from '../../model/level'
import Game from '../../model/SkillGame'


class SkillGame extends Component {
  constructor(props) {
    super(props)
    const level = new Level(743284, 20)
    this.state = { game: new Game(level) }
  }

  componentDidMount() {
    $("#navnext").hide()
    $("#skillscore").hide()
    $("#smartscore").hide()
    const game = this.state.game
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    const timeInterval = setInterval(countdown, 1000)
    let interval
    $("#score").show()
    let timeLeft = DEFAULT_TIMER
    function countdown() {
    if (timeLeft === 0) {
      game.forceGameOver()
      clearInterval(timeInterval)
      } else {
        $('#timer').text(timeLeft + ' seconds remaining')
        timeLeft--
      }
    }

    countdown()
    game.letters.forEach(letter => game.balls.push(new Ball(250, 750, 15, letter, canvas)))
    var ball = game.balls[0]
    interval = setInterval(draw, 10)

    let x2
    let y2

    function inBounds(y) {
      if(y<600) {
        return false
      }
      return true
    }

    $('#canvas').mousedown(function (canvas) {
      const offset = $(this).offset()
      $('#canvas').bind('mousemove', function(e){
        x2 = e.pageX - offset.left
        y2 = e.pageY - offset.top
         $('#canvas').mouseup(function (canvas) {
           if (inBounds(y2)) { ball.giveVelocity(ball.xPos,ball.yPos, x2, y2)}
        })
      })
    })


    function draw () {
      $('#score').text('Current Score: ' + game.score)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.font = '20px Arial'
      game.checkBallDone(ball)
      game.isBallinScoreHole(ball)
      game.isBallinWordHole(ball)
      game.isBallInTheAbyss(ball)
      checkGameOver()
      drawRectangle()
      drawHoles(game.holeArray)
      if (ball.isDone === true) {
        ball = game.currentBall()
      } else {
        drawBall(ball)
      }
      ctx.fillStyle = 'white'
      ctx.fillText('Foul Line!', 200, 620)
      ctx.beginPath();
      ctx.moveTo(0, 600);
      ctx.lineTo(500, 600);
      ctx.stroke();
    }
    function drawHoles (array) {
      array.forEach(function drawHole (item) {
        ctx.fillStyle = 'black'
        ctx.beginPath()
        ctx.arc(item.xPos, item.yPos, item.radius, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
        ctx.fillStyle = 'white'
        ctx.fillText('x' + item.score, item.xPos - 8, item.yPos)
      })
    }
    function drawRectangle () {
      ctx.beginPath()
      ctx.rect(game.tLeftCorner[0], game.tRightCorner[1], game.tRightCorner[0] - game.tLeftCorner[0], game.bRightCorner[1] - game.tLeftCorner[1])
      ctx.stroke()
      ctx.fillStyle = 'black'
      ctx.fill()
      ctx.fillStyle = 'white'
      ctx.fillText('Throw in here to make a word!', 115, 830)
    }
    function drawBall (ball) {
      ball.position()
      const x = ball.xPos
      const y = ball.yPos
      ctx.fillStyle = ball.colour
      ctx.beginPath()
      ctx.arc(x, y, ball.radius, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = 'white'
      ctx.fillText(ball.letter, x + 5, y + 30)
    }
    function checkGameOver () {
      if (game.isGameOver() === true) {
        clearInterval(interval)
        $("#bankedletters").attr('value', game.word.join('') )
        $("#skillscore").attr('value', game.score)
        $("#navnext").trigger( "click" );
      }
    }
  }

  render() {
    return (
    <div className="App">
      <div id="skillapp">
      <div id="timer"></div>
        <center>
          <canvas id="canvas" width="500" height="900"></canvas>
        </center>
      </div>
      <Link to={'./smartgame'}>
        <button variant="raised" id="navnext">
            NEXT
        </button>
      </Link>
    </div>
    );
  }
}
export default SkillGame;
