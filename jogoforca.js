// Criar um jogo da forca usando POO;
// Pelo menos três classes para três entidades presentes no sistema do jogo (GameController, Player e Match);
// O usuário deve poder chutar a palavra de uma vez;
// O usuário deve poder jogar/tentar novamente (reiniciar);
// Deve haver uma dica ou tema visualmente indicados;

const readline = require('readline');

class JogoDaForca {
    constructor() {
        this.palavras = ['javascript', 'html', 'css', 'programação', 'desenvolvedor', 'forca', 'Aprender', 'Orientação POO'];
        this.palavraAlvo = this.obterPalavraAleatoria();
        this.partida = new Partida(this.palavraAlvo);
        this.jogador = new Jogador();
    }

    obterPalavraAleatoria() {
        return this.palavras[Math.floor(Math.random() * this.palavras.length)];
    }

    exibirEstadoAtual() {
        console.log(`Dica: ${this.palavraAlvo}`);
        console.log(`Palavra Atual: ${this.partida.obterExibicaoAtual()}`);
        console.log(`Tentativas Restantes: ${this.partida.tentativasRestantes}`);
        console.log(`Letras Erradas: ${this.partida.letrasErradas.join(', ')}`);
    }

    jogar() {
        const self = this; // Para acessar o contexto do jogo dentro do callback
        this.exibirEstadoAtual();
        this.jogador.fazerPalpite((palpite) => {
            self.partida.processarPalpite(palpite);
            if (!self.partida.foiVencida() && !self.partida.foiPerdida()) {
                self.jogar();
            } else {
                if (self.partida.foiVencida()) {
                    console.log('Parabéns! Você acertou a palavra.');
                } else {
                    console.log(`Fim de jogo! A palavra era: ${self.palavraAlvo}`);
                }
                self.perguntarJogarNovamente();
            }
        });
    }

    perguntarJogarNovamente() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('Deseja jogar novamente? (s/n): ', (resposta) => {
            rl.close();
            if (resposta.toLowerCase() === 's') {
                this.palavraAlvo = this.obterPalavraAleatoria();
                this.partida = new Partida(this.palavraAlvo);
                this.jogar();
            } else {
                console.log('Obrigado por jogar!');
            }
        });
    }
}

class Jogador {
    fazerPalpite(callback) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('Digite seu palpite: ', (palpite) => {
            rl.close();
            callback(palpite.toLowerCase());
        });
    }
}

class Partida {
    constructor(palavraAlvo, maxTentativas = 6) {
        this.palavraAlvo = palavraAlvo;
        this.maxTentativas = maxTentativas;
        this.tentativasRestantes = maxTentativas;
        this.letrasCorretas = new Set();
        this.letrasErradas = [];
    }

    obterExibicaoAtual() {
        return this.palavraAlvo.split('').map(letra => this.letrasCorretas.has(letra) ? letra : '_').join(' ');
    }

    processarPalpite(palpite) {
        if (this.palavraAlvo.includes(palpite)) {
            this.letrasCorretas.add(palpite);
        } else {
            this.letrasErradas.push(palpite);
            this.tentativasRestantes--;
        }
    }

    foiVencida() {
        return this.palavraAlvo.split('').every(letra => this.letrasCorretas.has(letra));
    }

    foiPerdida() {
        return this.tentativasRestantes === 0;
    }
}

// Iniciar o jogo
const jogoDaForca = new JogoDaForca();
jogoDaForca.jogar();