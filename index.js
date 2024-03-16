const http = require('http');
const PORT = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World!');
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

const { Client, MessageMedia, MessageTypes, Reaction } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const axios = require('axios')
const client = new Client();
var bot = true;
var helpMenu = 
`   *-HELP MENU-*
O bot funciona com o index "!"
> !Help - Mostra esse menu;
> !Automsg - Mostra o menu das mensagens automaticas;
> !Turn (OFF/ON) - Desliga ou liga as mensagens automaticas;
> !Roll (numero) - Sorteia um numero aleatorio entre 0 e o valor colocado;
> !S (imagem) - Cria uma Figurinha com a imagem enviada;
> !Profile - Mostra seu perfil de usuario do bot;
> !DDT (Numero) !(frase) - A frase colocada apos o ponto de exclamação vai ser enviada pelo numero de vezes dado;
> !Choise !(Op1) !(Op2) !(Op3)... - O Bot irá escolher uma das opções dadas, podendo ser de 2 a mais de 8 mil`


client.on('qr', (qr) => {
    console.log("Leia Com o Whatsapp para Conectar:");
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log("Conectado, pronto pra uso.");
});
// ------------------------------------------------ //
client.on('message_create', msg => {
//-------------configuração:-------------
const responder = (text) => msg.reply(text) // responder
const reagir = (emogi) => msg.react(emogi); // reagir
const mensagem = msg.body.toUpperCase(); // corpo da mensagem em capslock
// --------------------------------------

const criatfigu = async (msg, sender) => {
    if(msg.type === "image" || msg.type === "video") {
        try {
            const { data } = await msg.downloadMedia()
            const image = await new MessageMedia("image/jpeg", data, "image.jpg")
            await client.sendMessage(sender, image, { sendMediaAsSticker: true, stickerAuthor: msg.author+ " " +msg.from ,stickerName:"Feita com o  melhor Bot da INFO20", stickerCategories:"Melhor da INFO20"})
        } catch(e) {
            responder("❌ Erro ao processar imagem")
        }
    } else {
        try {
            const url = msg.body.substring(msg.body.indexOf(" ")).trim()
            const { data } = await axios.get(url, {responseType: 'arraybuffer'})
            const returnedB64 = Buffer.from(data).toString('base64');
            const image = await new MessageMedia("image/jpeg", returnedB64, "image.jpg")
            await client.sendMessage(sender, image, { sendMediaAsSticker: true, stickerAuthor: "Bot do May",stickerName:"Feita com o  melhor Bot da INFO20", stickerCategories:"Melhor da INFO20" })
        } catch(e) {
            responder("❌ Não foi possível gerar um sticker com esse link")
}}}

const palavraChave = [
    {palavra: "MAYKON", resposta: "Meu nome"},
    {palavra: "MAYKOLA", resposta: "Meu nome"},
    {palavra: "MAYCON", resposta: "Meu nome"},
    {palavra: "ELICE", resposta: "A mina do SESI?"},
    {palavra: "HELICE", resposta: "A mina do SESI?"},
    {palavra: "HÉLICE", resposta: "A mina do SESI?"},
    {palavra: "ÉLICE", resposta: "A mina do SESI?"},
    {palavra: "FLAESIO", resposta: "Bizaurro"},
    {palavra: "ILUMINADO", resposta: "Só sei q esse ae foi partido ao meio KKK"},
    {palavra: "GOJO", resposta: "Foi de metadinha, cortado muito bem, ator da tramontina, fez divisão de bens"},
    {palavra: "GO/JO", resposta: "Entre o Ceu e a Terra, ele foi o mais fatiado"},
//    {palavra: "CUDECABRAL", resposta: "Hmmmm cuzinho de Cabral 😋"},
    {palavra: "VIADO", resposta: "Q q tem eu?"}
];

const respostasAutomaticas = () =>{
    for(item in palavraChave){
        if(mensagem.includes(palavraChave[item].palavra) && !mensagem.includes("AUTOMSG MENU")){
          responder(palavraChave[item].resposta);
          break;
    }};
}

const comandos = () =>{
    if(mensagem[0] == "!"){
    reagir("👍");
        switch(mensagem.substring(1).split(' ')[0]){
            case "TURN":
                switch(mensagem.split(' ')[1]){
                    case "ON":
                        bot = true;  
                        break;
                    case "OFF":
                        bot = false;
                        break;
                    default:
                        responder("Os valores somente podem ser ON ou OFF");
                        break;
                }      
                break;
            case "HELP":
                responder(helpMenu);
                break;
            case "AUTOMSG":
                responder(
`   *-AUTOMSG MENU-*
Quando receber uma mensagem contendo uma dessas palavras o bot vai automaticamente responder com algum comentario;
"Maykon" - "Flaesio" - "Elice" - "Viado"
"Gojo" - "Go/jo" - "Iluminado"

Atualmente a automsg está ${bot?"Ligada":"Desligada"};
Use o comando !Help para ver como alternar;
OBS: Caso queira adicionar uma resposta automatica ou remover alguma deve consultar o meu criador.`
);
                break;
            case "ROLL":
                if(parseInt(mensagem.split(' ')[1]) > 0){
                    responder(Math.floor((Math.random() * parseInt(mensagem.split(' ')[1]) + 1)).toString());
                }else{
                    responder("Por favor utilize esse comando somente com numeros maiores que 0");
                }
                break;
            case "S":
                const sender = msg.from.includes("84443228") ? msg.to : msg.from;
                criatfigu(msg, sender);
                break;
            case "PROFILE":
                responder("ID: " + msg.from);
                break;
            case "DDT":
                if(msg.from.includes("84443228")){
                    if(parseInt(mensagem.split(' ')[1]) > 0){
                        for(i = 0; i < parseInt(mensagem.split(' ')[1]); i++){
                            responder(msg.body.split("!")[2]);
                        }
                    }else{
                        responder("Valor invalido!, consulte o !Help para mais ajuda");
                    }
                }else{
                    responder("Comando Desativado!, Quem sabe um dia volte?");
                }
                break;
            case "CHOISE":
                if(mensagem.split("!").length > 2){
                    responder(msg.body.split("!")[Math.floor(Math.random() * (mensagem.split("!").length - 2)) +2]);
                }else if(mensagem.split("!").length = 2){
                    responder("Por que a duvida entre 1 escolha?");
                }else{
                    responder("Erro de sixtaxe, consulte o !Help para mais ajuda");
                }
                break;
            default:
                responder("Comando não reconhecido, use !Help para mais ajuda");
                break;
}}}
    console.log(msg.body);

    comandos();
    if(bot){
        respostasAutomaticas();
}});
// ------------------------------------------------ //

client.initialize();
