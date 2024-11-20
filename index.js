////Outros////
const screen = document.getElementById(`container`) //Define a div de delimitação da tela no JS
const movimento = 7.5 //Velocidade de movimento das raquetes

////Raquete 1////
const racket1 = document.getElementById(`racket1`) //Define a raquete do HTML como uma raquete no JS
let posY = 175 //Indica a posição inicial dela
let racket1MovingUp = false
let racket1MovingDown = false //Variáveis pra auziliar no movimento da raquete

////Raquete 2////
//Mesma coisa que a raquete 1
const racket2 = document.getElementById(`racket2`)
let posY2 = 175
let racket2MovingUp = false
let racket2MovingDown = false

//Checa se as teclas tão sendo apertadas ou não, pra definir o estado que as raquetes vão se encontrar (paradas ou se movendo)
//É tipo um upgrade pro sistema de movimentação básico, já que tava muito travado, agora tá bem mais fluido e jogável
document.addEventListener(`keydown`, (event) => {
    if(event.key === `w`) racket1MovingUp = true //W pressionado = váriavel no estado TRUE
    if(event.key === `s`) racket1MovingDown = true //S pressionado = váriavel no estado TRUE
    if(event.key === `ArrowUp`) racket2MovingUp = true //Setinha pra cima pressionada = váriavel no estado TRUE
    if(event.key === `ArrowDown`) racket2MovingDown = true //Setinha pra baixo pressionada = váriavel no estado TRUE
}) //Aqui, enquanto a tecla estabelecida etiver pressionada, o movimento será VERDADEIRO

document.addEventListener(`keyup`, (event) => {
    if(event.key === `w`) racket1MovingUp = false //W "solto" = variável no estado FALSE
    if(event.key === `s`) racket1MovingDown = false //S "solto" = variável no estado FALSE
    if(event.key === `ArrowUp`) racket2MovingUp = false //Setinha pra cima "solta" = variável no estado FALSE
    if(event.key === `ArrowDown`) racket2MovingDown = false //Setinha pra baixo "solta" = variável no estado FALSE
}) //Aqui, é ao contrário, enquanto a tecla estabelecida etiver pressionada, o movimento será FALSO

function moverRaquetes() { //Move as raquetes, de fato
    const containerHeight = screen.offsetHeight // Obtém a altura atual do contêiner

    //Raquete 1
    if(racket1MovingUp) {
        posY -= movimento //Diz que a nova posição vai ser igual a posição antiga mais o valor de movimento implementado após pressionar a tecla
        if(posY < 0) posY = 0 //Alguma coisa isso aqui faz
    }
    if(racket1MovingDown) {
        posY += movimento //De novo a incrementação das posições, só que, ao invés de ser sobre quando tu sobe a raquete, é quando tu desce ela
        if(posY > containerHeight - racket1.offsetHeight) {
            posY = containerHeight - racket1.offsetHeight //Ajusta o limite de até onde a raquete pode ir
        }
    }
    racket1.style.top = posY + `px`

    //Raquete 2
    if(racket2MovingUp) {
        posY2 -= movimento //Diz que a nova posição vai ser igual a posição antiga mais o valor de movimento implementado após pressionar a tecla
        if(posY2 < 0) posY2 = 0 //Alguma coisa isso aqui faz
    }
    if(racket2MovingDown) {
        posY2 += movimento //De novo a incrementação das posições, só que, ao invés de ser sobre quando tu sobe a raquete, é quando tu desce ela
        if(posY2 > containerHeight - racket2.offsetHeight) {
            posY2 = containerHeight - racket2.offsetHeight //Ajusta o limite de até onde a raquete pode ir
        }
    }
    racket2.style.top = posY2 + `px`

    requestAnimationFrame(moverRaquetes) //Fica chamando a função o tempo todo, pra ficar mais fluido e bonitinho
}

////Bolinha////
const littleBall = document.getElementById(`littleBall`) //Define a bolinha no JS
let ballX = 295
let ballY = 210
let ballSpeedX = 6
let ballSpeedY = 3

function moverBolinha() {
    ballX += ballSpeedX
    ballY += ballSpeedY

    //Atualiza a posição da bolinha (descobri)
    littleBall.style.left = ballX + `px`
    littleBall.style.top = ballY + `px`

    //Checa se a bolinha colidiu com as bordas verticais da tela
    if(ballY <= 0 || ballY >= screen.offsetHeight - littleBall.offsetHeight) {
        ballSpeedY *= -1 //Inverte a direção vertical
    }

    //Checa a colisão com as raquetes
    if(checarColisao(littleBall, racket1)) {
        ballSpeedX *= -1 //Inverte a direção horizontal
        ballX = racket1.offsetLeft + racket1.offsetWidth
        ballOut = false
    } else if(checarColisao(littleBall, racket2)) {
        ballSpeedX *= -1 //Inverte a direção horizontal (de novo)
        ballX = racket2.offsetLeft - littleBall.offsetWidth
        ballOut = false
    }

    //Checa por que lado a bolinha saiu
    if(ballX <= 0 || ballX >= screen.offsetWidth - littleBall.offsetWidth) {
        if(!ballOut) { //Só chama resetarBolinha caso a bolinha ainda não tenha sido resetada
            resetarBolinha() //Reseta a posição da bolinha
            ballOut = true
        }
    } else {
        ballOut = false
    }

    requestAnimationFrame(moverBolinha) //Fica chamando a função o tempo todo, pra ficar mais fluido e bonitinho
}

////Colisão////
function checarColisao(ball, racket) { //Checa se a bolinha colidiu com alguma raquete ou não
    const ballRect = ball.getBoundingClientRect()
    const racketRect = racket.getBoundingClientRect()
  
    return (
      ballRect.left < racketRect.right &&
      ballRect.right > racketRect.left &&
      ballRect.top < racketRect.bottom &&
      ballRect.bottom > racketRect.top
    )
}

////Placar////

let score1 = 0 //Pontuação do jogador 1
let score2 = 0 // Pontuação do jogador 2
let ballOut = false //Indica se a bolinha já saiu da tela
const board = document.getElementById(`scoreboard`)

const score1Element = document.getElementById(`score1`) //"Traz" o placar do HTML pro JS
const score2Element = document.getElementById(`score2`) //Mesma coisa

function resetarBolinha() {
    
    if(ballX <= 0) {
        score2++ //Marca ponto pro jogador 2
        score2Element.textContent = score2 //Transfere a pontuação pro "scoreboard" no HTML, substituindo o original pelo "score2"
    } else if(ballX >= screen.offsetWidth - littleBall.offsetWidth) {
        score1++ //Mesma coisa, só que pro jogador 1
        score1Element.textContent = score1 //Mesma coisa, só que pro jogador 1
    }

    if (score1 > 4 || score2 > 4) { //Depois de 5 pontos...
        if(score1 > 9 || score2 > 9) { //Depois de 10 pontos...
            if(score1 > 14 || score2 > 14) { //Depois de 15 pontos...
                if(score1 > 19 || score2 > 19) { //Depois de 20 pontos...
                    if(score1 > 24 || score2 > 24) { //Depois de 25 pontos...
                        if(score1 > 39 || score2 > 39) {
                            board.textContent = `Fim de jogo!`

                            movimento = movimento / 2 //O intuito era diferente, mas fez o que eu queria, travar o jogo
                        } else { //Diminui a tela + randomiza a velocidade da bola + randomiza o tamanho da raquete E da bola
                            screen.style.width = `750px` //... diminui a largura
                            screen.style.height = `500.2px` //... aumenta a altura

                            ballSpeedX = (Math.random() * (12 - 3) + 3) * (Math.random() < 0.5 ? 1 : -1) //O primeiro delimita o limite de velocidade, o segundo a direção a qual a bola vai se mover
                            ballSpeedY = (Math.random() * (12 - 3) + 3) * (Math.random() < 0.5 ? 1 : -1) //Mesma coisa, só que, ao invés do eixo X, é no eixo Y        
                        
                            racket1.style.height = (Math.random() * (75 - 25) + 25) + `px` //Randomiza o tamanho da raquete 1
                            racket2.style.height = (Math.random() * (75 - 25) + 25) + `px` //Randomiza o tamanho da raquete 2
                            littleBall.style.height = (Math.random() * (15 - 7.5) + 7.5) + `px`
                            littleBall.style.width = (Math.random() * (15 - 7.5) + 7.5) + `px`
                        }
                    } else { //Modifica a tela + randomiza a velocidade da bolinha + diminui as raquetes
                        screen.style.width = `1249px` //... aumenta a largura
                        screen.style.height = `121px` //... diminui a altura

                        ballSpeedX = (Math.random() * (9 - 6) + 6) * (Math.random() < 0.5 ? 1 : -1) //O primeiro delimita o limite de velocidade, o segundo a direção a qual a bola vai se mover
                        ballSpeedY = (Math.random() * (21 - 15) + 15) * (Math.random() < 0.5 ? 1 : -1) //Mesma coisa, só que, ao invés do eixo X, é no eixo Y    

                        racket1.style.height = `25px` //Diminui o tamanho da raquete 1
                        racket2.style.height = `25px` //Diminui o tamanho da raquete 2
                    }
                } else { //Modifica a tela + randomiza a velocidade da bolinha + diminui as raquetes
                    screen.style.width = `1249px` //... aumenta a largura
                    screen.style.height = `321px` //... diminui a altura

                    ballSpeedX = (Math.random() * (6 - 3) + 3) * (Math.random() < 0.5 ? 1 : -1) //O primeiro delimita o limite de velocidade, o segundo a direção a qual a bola vai se mover
                    ballSpeedY = (Math.random() * (18 - 12) + 12) * (Math.random() < 0.5 ? 1 : -1) //Mesma coisa, só que, ao invés do eixo X, é no eixo Y    
                
                    racket1.style.height = `50px` //Diminui o tamanho da raquete 1
                    racket2.style.height = `50px` //Diminui o tamanho da raquete 2
                }
            } else { //Aumenta a tela + randomiza a velocidade da bolinha
                screen.style.width = `1104px` //... aumenta a largura

                ballSpeedX = (Math.random() * (12 - 6) + 6) * (Math.random() < 0.5 ? 1 : -1) //O primeiro delimita o limite de velocidade, o segundo a direção a qual a bola vai se mover
                ballSpeedY = (Math.random() * (5 - 3) + 3) * (Math.random() < 0.5 ? 1 : -1) //Mesma coisa, só que, ao invés do eixo X, é no eixo Y
            }
        } else { //Aumenta a tela + randomiza a velocidade da bolinha
            screen.style.width = `900px` //... aumenta a largura
            screen.style.height = `621px` //... aumenta a altura

            ballSpeedX = (Math.random() * (9 - 6) + 6) * (Math.random() < 0.5 ? 1 : -1) //O primeiro delimita o limite de velocidade, o segundo a direção a qual a bola vai se mover
            ballSpeedY = (Math.random() * (4 - 3) + 3) * (Math.random() < 0.5 ? 1 : -1) //Mesma coisa, só que, ao invés do eixo X, é no eixo Y
        }
    }

    //Reseta a posição da bolinha
    ballX = (screen.offsetWidth / 2) - (littleBall.offsetWidth / 2)
    ballY = (screen.offsetHeight / 2) - (littleBall.offsetHeight / 2)
    ballSpeedX *= -1 //Inverte a direção inicial pro próximo ponto
}

////Botão de iniciar////
const startButton = document.getElementById(`botaoStart`)
startButton.addEventListener(`click`, function() {
    startButton.style.display = `none`
    screen.style.display = `block`
    board.style.display = `block`

    moverRaquetes()
moverBolinha()
})