<template>
  <div id="app">
	<img src="./assets/image_bocco_emo_branch_page.png" />
    <h1>Let's play Red Light/Green Light!</h1>
	<div class="buttonContainer">
	<button id="start" v-on:click="beginMotion">START</button>
	<button id="finish" v-on:click="finishMotion">FINISH</button>
	</div>
	<ol>
		<li> Press the START button to start the game </li>
		<li> Get set when emo-chan's cheeks are flashing <mark class="yellow"> yellow</mark> </li> 
		<li> Run on <mark class="green"> green </mark> until emo-chan's cheeks turn <mark class="red"> red </mark> </li>
		<li> The next round starts automatically </li>
		<li> Press the FINISH button when you want to end the game. </li>
	</ol>
  </div>
</template>

<script>

import greenCheekMotion from '../data/yellow-green-go';
import redCheekMotion from '../data/red-stop';

export default {
  name: 'App',
  data: () => ({
    base_url: 'https://platform-api.bocco.me',
    refreshKey: process.env.VUE_APP_REFRESH_KEY,
    accessToken: '',
    roomId: process.env.VUE_APP_ROOM_ID,
    intervalId: '',
    flag: false,
    greenCheekMotion: greenCheekMotion,
    redCheekMotion: redCheekMotion,
  }),
  methods: {
    getAccessToken: async function(){
      const getToken = await fetch(`${this.base_url}/oauth/token/refresh`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"refresh_token": this.refreshKey})
      })
      const tokenJSON = await getToken.json();
      this.accessToken = tokenJSON.access_token;
    },
    postGreenCheekMotion: async function() {
      await this.getAccessToken();
      await fetch(`${this.base_url}/v1/rooms/${this.roomId}/motions`,{
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + this.accessToken ,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.greenCheekMotion)
      });
    },
    postRedCheekMotion: async function() {
      await this.getAccessToken();
      await fetch(`${this.base_url}/v1/rooms/${this.roomId}/motions`,{
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + this.accessToken ,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.redCheekMotion)
      });
    },
    beginMotion: async function() {
	await this.playMessage('だるまさんがころんだ、はじめるよ。まわりにきをつけてあそんでね。スリー、ツー、ワン。');
      if(this.intervalId == '') {
        this.intervalId = setInterval(async () => {
          console.log(this.intervalId);
          await this.postGreenCheekMotion();
          await this.postRedCheekMotion();
        }, 16000);
      }
    },
    finishMotion: async function() {
      clearInterval(this.intervalId);
      this.intervalId = '';
      this.playMessage('ゲームがおわったよ。みんなでハイタッチしよう')
    },
	playMessage: async function(messageText){
    await this.getAccessToken();
    await fetch(`${this.base_url}/v1/rooms/${this.roomId}/messages/text`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + this.accessToken, 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({text: messageText})
	})
  }
}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
  margin-bottom: 30px;
  margin-left: auto;
  margin-right: auto;
  align-content: center;
  justify-content: center;
}
h1{
  font-size: max(3.2vw, 18px)
}
.buttonContainer{
  min-width: 50%;
  display: inline-block;
}

#start {
	margin-right:3%;
	margin-left:3%;
	margin-top:1%;
	margin-bottom:1%;
	cursor: pointer;
	position: relative;
	padding: 2.5rem 2.1rem;
	border-radius: 3.75rem;
	line-height: 2.5rem;
	font-size: 2rem;
	font-weight: 600;
  color: #f5f5f5;
  text-shadow: 1px 1px 1px #919191, 1px 2px 1px #919191,
    1px 3px 1px #919191;
  font-family: Avenir, Helvetica, Arial, sans-serif;
	
	border: 1px solid white;
	background-image: linear-gradient(-180deg, lightgreen 0%, green 100%);
	box-shadow: 0 1rem 1.25rem 0 lightgray
							0 -0.25rem 1.5rem darkgreen inset,
							0 0.75rem 0.5rem rgba(255,255,255, 0.4) inset,
							0 0.25rem 0.5rem 0 green inset;
}

#start span {
	color: transparent;
	background-image: linear-gradient(0deg, lightgreen 0%, #FEFAFD 100%);
	-webkit-background-clip: text;
	background-clip: text;
	filter: drop-shadow(0 2px 2px darkgreen(290, 100%, 20%, 1));
}

#start::before {
	content: "";
	display: block;
	height: 0.25rem;
	position: absolute;
	top: 0.5rem;
	left: 50%;
	transform: translateX(-50%);
	width: calc(100% - 7.5rem);
	background: #fff;
	border-radius: 100%;
	
	opacity: 0.7;
	background-image: linear-gradient(-270deg, rgba(255,255,255,0.00) 0%, #FFFFFF 20%, #FFFFFF 80%, rgba(255,255,255,0.00) 100%);
}

#start::after {
	content: "";
	display: block;
	height: 0.25rem;
	position: absolute;
	bottom: 0.75rem;
	left: 50%;
	transform: translateX(-50%);
	width: calc(100% - 7.5rem);
	background: #fff;
	border-radius: 100%;
	
	filter: blur(1px);
	opacity: 0.05;
	background-image: linear-gradient(-270deg, rgba(255,255,255,0.00) 0%, #FFFFFF 20%, #FFFFFF 80%, rgba(255,255,255,0.00) 100%);
}

#finish {
	cursor: pointer;
	position: relative;
	padding: 2.5rem 1.8rem;
	margin-left: 3%;
	margin-right:3%;
	margin-top:1%;
	margin-bottom:1%;
	border-radius: 3.75rem;
	line-height: 2.5rem;
	font-size: 2rem;
	font-weight: 600;
  color: #f5f5f5;
  text-shadow: 1px 1px 1px #919191, 1px 2px 1px #919191,
        1px 3px 1px #919191;
  font-family: Avenir, Helvetica, Arial, sans-serif;
	border: 1px solid white;
	background-image: linear-gradient(-180deg, tomato, red 100%);
	box-shadow: 0 1rem 1.25rem 0 lightgray(22,75,195,0.50),
							0 -0.25rem 1.5rem darkred(110, 15, 155, 1) inset,
							0 0.75rem 0.5rem rgba(255,255,255, 0.4) inset,
							0 0.25rem 0.5rem 0 red(180, 70, 207, 1) inset;
}

#finish span {
	color: transparent;
	background-image: linear-gradient(0deg, tomato 0%, white 100%);
	-webkit-background-clip: text;
	background-clip: text;
	filter: drop-shadow(0 2px 2px hsla(290, 100%, 20%, 1));
}

#finish::before {
	content: "";
	display: block;
	height: 0.25rem;
	position: absolute;
	top: 0.5rem;
	left: 50%;
	transform: translateX(-50%);
	width: calc(100% - 7.5rem);
	background: #fff;
	border-radius: 100%;
	
	opacity: 0.7;
	background-image: linear-gradient(-270deg, rgba(255,255,255,0.00) 0%, #FFFFFF 20%, #FFFFFF 80%, rgba(255,255,255,0.00) 100%);
}

#finish::after {
	content: "";
	display: block;
	height: 0.25rem;
	position: absolute;
	bottom: 0.75rem;
	left: 50%;
	transform: translateX(-50%);
	width: calc(100% - 7.5rem);
	background: #fff;
	border-radius: 100%;
	
	filter: blur(1px);
	opacity: 0.05;
	background-image: linear-gradient(-270deg, rgba(255,255,255,0.00) 0%, #FFFFFF 20%, #FFFFFF 80%, rgba(255,255,255,0.00) 100%);
}

ol{
  padding-left: 0;
  margin-left: 0;
  margin-right: 0;
  text-align: center;
  list-style-position: inside;
}
li{
 line-height: 2.2;
 font-size: max(1.5vw, 11px);
 
}

mark{
 background-color: white;
 font-weight: bolder;
}
mark.red{
 color: red
}

mark.yellow{
 color: rgb(245,199,26)
}

mark.green{
 color: green
}
</style>