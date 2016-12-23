define(["jquery", "text!./Gamification.css"], function($, cssContent) {'use strict';
	$("<style>").html(cssContent).appendTo("head");
	return {
		initialProperties : {
			version: 1,
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
					qWidth: 3,
					qHeight: 3333					
				}]
			},
		},
		definition : {
			type : "items",
			component : "accordion",
			items : {
				dimensions : {
					uses : "dimensions",
					min : 1,
					max : 2
				},
				measures : {
					uses : "measures",
					min : 1,
					max : 1
				},
				sorting : {
					uses : "sorting"
				},
				settings: {
					uses: "settings",
					items : {
						RaceSettings: {
							type: "items",
							label: "Race Settings",
							items: {
								RaceType:{
									ref: "racetype",
									translation: "Race Type",
									type: "number",
									component: "buttongroup",
									options: [ {
										value: 1,
										label: "Absolute"
									}, {
										value: 2,
										label: "Percentage"									
									}],
									defaultValue: 1,								
								},
								CustomFinish : {
									ref : "finishline",
									label : "Finish Line (1 = 100%)",
									type : "number",
									defaultValue : 1,
									show : function(data) {
										return data.racetype == 2;
									}
								},
								RaceModus: {
								  ref: "racemodus",
								  type: "string",
								  component: "dropdown",
								  label: "Race Modus",
								  options: 
									[ {
										value: "Horses",
										label: "Horses"
									}, {
										value: "Motorcycles",
										label: "Motorcycles"
									}, {
										value: "Athletics",
										label: "Athletics"
									}	
									],
								  defaultValue: "Horses"								  
							        },
								LabelColors: {
								  ref: "labelscolor",
								  type: "string",
								  component: "dropdown",
								  label: "Labels Color",
								  options: 
									[ {
										value: "White",
										label: "White"
									}, {
										value: "Cyan",
										label: "Cyan"
									}, {
										value: "Black",
										label: "Black"
									}, {
										value: "Gold",
										label: "Gold"
									}, {
										value: "GoldenRod",
										label: "GoldenRod"
									}, {
										value: "GreenYellow",
										label: "GreenYellow"
									}, {
										value: "Gainsboro",
										label: "Gainsboro"
									}, {
										value: "Lavender",
										label: "Lavender"
									}, {
										value: "LightYellow",
										label: "LightYellow"
									}	
									],
								  defaultValue: "White"								  
							        },
								RaceSpeed:{
									ref: "racespeed",
									translation: "Race Speed",
									type: "number",
									component: "buttongroup",
									options: [{
										value: 2500,
										label: "Slow"									
									}, {
										value: 1500,
										label: "Normal"									
									}, {
										value: 500,
										label: "Fast"									
									}],
									defaultValue: 1500,								
								},
							},
						},
						PlayersSettings: {
							type: "items",
							label: "Players Settings",
							items: {								
								AssociatePlayers : {
									ref : "associateplayers",
									type : "boolean",
									component : "switch",
									label : "Associate specific Players",
									options: [{
										value: true,
										label: "On"
									}, {
										value: false,
										label: "Off"
									}],
									defaultValue: false
								},
								Player0 : {
									ref : "player0",
									label : "Player 0",
									type : "string",
									defaultValue : '',
									show : function(data) {
										return data.associateplayers;
									}
								},
								Player1 : {
									ref : "player1",
									label : "Player 1",
									type : "string",
									defaultValue : '',
									show : function(data) {
										return data.associateplayers;
									}
								},
								Player2 : {
									ref : "player2",
									label : "Player 2",
									type : "string",
									defaultValue : '',
									show : function(data) {
										return data.associateplayers;
									}
								},
								Player3 : {
									ref : "player3",
									label : "Player 3",
									type : "string",
									defaultValue : '',
									show : function(data) {
										return data.associateplayers;
									}
								},
								Player4 : {
									ref : "player4",
									label : "Player 4",
									type : "string",
									defaultValue : '',
									show : function(data) {
										return data.associateplayers;
									}
								},
								Player5 : {
									ref : "player5",
									label : "Player 5",
									type : "string",
									defaultValue : '',
									show : function(data) {
										return data.associateplayers;
									}
								},
								Player6 : {
									ref : "player6",
									label : "Player 6",
									type : "string",
									defaultValue : '',
									show : function(data) {
										return data.associateplayers;
									}
								},
								Player7 : {
									ref : "player7",
									label : "Player 7",
									type : "string",
									defaultValue : '',
									show : function(data) {
										return data.associateplayers;
									}
								},
								Player8 : {
									ref : "player8",
									label : "Player 8",
									type : "string",
									defaultValue : '',
									show : function(data) {
										return data.associateplayers;
									}
								},
								Player9 : {
									ref : "player9",
									label : "Player 9",
									type : "string",
									defaultValue : '',
									show : function(data) {
										return data.associateplayers;
									}
								},								
							},
						},
					}	
				}
			}
		},
		snapshot : {
			canTakeSnapshot : false
		},
		paint : function($element, layout) {
			var MaxSize = Math.min($element.width(), $element.height());
			var Diameter = MaxSize * 0.65;
			var Offset = MaxSize * 0.35;
			var yWorking = MaxSize * 0.3;
			var FontSizeWorking = Math.floor(MaxSize * 0.05);
			var vRaceModus = this.backendApi.model.layout.racemodus;
			var vLabelColors = this.backendApi.model.layout.labelscolor;
			var vRaceSpeed = this.backendApi.model.layout.racespeed;
			var vRaceType = this.backendApi.model.layout.racetype;
			var vFinishLine = this.backendApi.model.layout.finishline;
			var html = "";
			var self = this;
			
			var Started = false;			
			var PlayersMatrixClean = new Array(10);
			
			
			
			var longitud = $element.width() * 0.85;
			var max = 0;
			var maxFormat = '0';
			var topgun = '';
			var associate = this.backendApi.model.layout.associateplayers;
			
			var plyrs = new Array();
			var vNumDimensions = this.backendApi.cacheCube.cubeWidth - 1;
			var vTotalElemsFirst = 0;
			
			if (vNumDimensions == 2) {
				var vTotalElemsSecond = layout.qHyperCube.qDimensionInfo[1].qCardinal;
				var SecondSingle = new Array();
				//console.log(vTotalElemsSecond);
				this.backendApi.eachDataRow(function(t, a) {
					
					if (!associate) {
						if((a[0].qElemNumber >= 0 || a[0].qElemNumber == -3) && plyrs.indexOf(a[0].qText)<0 && !isNaN(a[2].qNum)){
							plyrs.push(a[0].qText);
						}
					}
					
					if(a[1].qElemNumber >= 0){
						SecondSingle.push(a[1].qText);						
					}
				});
				SecondSingle = SecondSingle.filter(onlyUnique)
				
				//ojo NO hay que ordenarla, hay que respetar el orden en que el usuario manda la 2ª dimensión
				
				var vSecondSingleLength = SecondSingle.length;
				var vSecondDistance = 0;
				var vSecondSize = '';
				var vSecondRotate = '';
				
				if (vSecondSingleLength < 3) {
					vSecondDistance = 10;
					vSecondSize = '57px';
				}else{
					if (vSecondSingleLength < 5) {
						vSecondDistance = 3;
						vSecondSize = '57px';
					}else{
						if (vSecondSingleLength < 8) {
							vSecondDistance = 2;
							vSecondSize = '57px';
						}else{
							if (vSecondSingleLength < 13) {
								vSecondDistance = 1;
								vSecondSize = '30px';
							}else{
								if (vSecondSingleLength < 32) {
									vSecondDistance = 0.5;
									vSecondSize = '23px';
								}else{
									if (vSecondSingleLength < 54) {
										vSecondDistance = 0.25;
										vSecondSize = '15px';
										vSecondRotate = 'transform: rotate(270deg)';
										
									}else{
										vSecondDistance = 0.1;
										vSecondSize = '12px';
										vSecondRotate = 'transform: rotate(270deg)';
									}
								}							
							}
						}				
					}
				}
				
				
				
				if (associate) {
					plyrs[0] = this.backendApi.model.layout.player0;
					plyrs[1] = this.backendApi.model.layout.player1;
					plyrs[2] = this.backendApi.model.layout.player2;
					plyrs[3] = this.backendApi.model.layout.player3;
					plyrs[4] = this.backendApi.model.layout.player4;
					plyrs[5] = this.backendApi.model.layout.player5;
					plyrs[6] = this.backendApi.model.layout.player6;
					plyrs[7] = this.backendApi.model.layout.player7;
					plyrs[8] = this.backendApi.model.layout.player8;
					plyrs[9] = this.backendApi.model.layout.player9;
				}
				
				if (associate) {
					vTotalElemsFirst = 10;
				}else{
					vTotalElemsFirst = plyrs.length;
				}
				var PlayersMatrixGroup  = new Array(vTotalElemsFirst);
				var PlayersMatrixSecond = new Array(vTotalElemsFirst);
				var PlayersMatrixAnime  = new Array(vTotalElemsFirst);
				
				
				for (var ar =0;ar<vTotalElemsFirst;ar++) {
					PlayersMatrixGroup[ar] = new Array(3);
					PlayersMatrixSecond[ar] = new Array((vSecondSingleLength + 1));
					PlayersMatrixAnime[ar] = new Array((vSecondSingleLength + 1));
				}
			}
			
			
			
			var vDec  = layout.qHyperCube.qMeasureInfo[0].qNumFormat.qDec;
			var vnDec = layout.qHyperCube.qMeasureInfo[0].qNumFormat.qnDec;
			var vThou = layout.qHyperCube.qMeasureInfo[0].qNumFormat.qThou;
			var vFmt  = layout.qHyperCube.qMeasureInfo[0].qNumFormat.qFmt;
			vFmt = vFmt.slice(-1);
			
			if (associate && vNumDimensions == 1) {
				PlayersMatrixClean[0] = this.backendApi.model.layout.player0;
				PlayersMatrixClean[1] = this.backendApi.model.layout.player1;
				PlayersMatrixClean[2] = this.backendApi.model.layout.player2;
				PlayersMatrixClean[3] = this.backendApi.model.layout.player3;
				PlayersMatrixClean[4] = this.backendApi.model.layout.player4;
				PlayersMatrixClean[5] = this.backendApi.model.layout.player5;
				PlayersMatrixClean[6] = this.backendApi.model.layout.player6;
				PlayersMatrixClean[7] = this.backendApi.model.layout.player7;
				PlayersMatrixClean[8] = this.backendApi.model.layout.player8;
				PlayersMatrixClean[9] = this.backendApi.model.layout.player9;								
			}
			
			if (vNumDimensions == 2) {
				
				this.backendApi.eachDataRow(function(t, a) {		
					if (plyrs.indexOf(a[0].qText) >= 0) {
						PlayersMatrixGroup[plyrs.indexOf(a[0].qText)][0] = a[0].qText; //player name
						PlayersMatrixGroup[plyrs.indexOf(a[0].qText)][1] = a[0].qElemNumber; //player code
						
						if (!isNaN(PlayersMatrixGroup[plyrs.indexOf(a[0].qText)][2])) {
							PlayersMatrixGroup[plyrs.indexOf(a[0].qText)][2] = PlayersMatrixGroup[plyrs.indexOf(a[0].qText)][2] + a[2].qNum; //value
						}else{
							PlayersMatrixGroup[plyrs.indexOf(a[0].qText)][2] = a[2].qNum; //value
						}
						
							
						PlayersMatrixSecond[plyrs.indexOf(a[0].qText)][0] = a[0].qText; //player name
						PlayersMatrixAnime[plyrs.indexOf(a[0].qText)][0] = a[0].qText; //player name													
						PlayersMatrixSecond[plyrs.indexOf(a[0].qText)][((SecondSingle.indexOf(a[1].qText)) + 1)] = a[2].qNum; //value						
					}
				});
				
				//This is to prevent nulls instead 0
				for(var au =0;au<vTotalElemsFirst;au++){
					for(var au2 = 1;au2<(SecondSingle.length + 1);au2++){
						if(isNaN(PlayersMatrixSecond[au][au2])){
							PlayersMatrixSecond[au][au2] = 0;
						}					
					}
				}
				if (associate) { // in this case max 10 elems
					var PlayersMatrix = new Array(10);
					var PlayersMatrixTopGun = new Array(10);
					for(var aa=0;aa<vTotalElemsFirst;aa++){
						PlayersMatrix[aa] = new Array(5);
						PlayersMatrixTopGun[aa] = new Array(2);
					}
					
									
					for (var aio = 0;aio<vTotalElemsFirst;aio++) {
						if ((max==0 && !isNaN(PlayersMatrixGroup[aio][2])) || PlayersMatrixGroup[aio][2] > max) {
							max = PlayersMatrixGroup[aio][2];
							maxFormat = formatNumber(PlayersMatrixGroup[aio][2],vnDec,3,vThou,vDec,vFmt); 
							topgun = PlayersMatrixGroup[aio][0];
						}
						var indexClean = plyrs.indexOf(PlayersMatrixGroup[aio][0]);//OJO podría fallar si hay menos de 10
						if (indexClean >= 0) {
							PlayersMatrix[indexClean][0] = PlayersMatrixGroup[aio][0];
							PlayersMatrix[indexClean][1] = PlayersMatrixGroup[aio][1];
							PlayersMatrix[indexClean][2] = PlayersMatrixGroup[aio][2];
							PlayersMatrix[indexClean][3] = longitud;
							PlayersMatrix[indexClean][4] = formatNumber(PlayersMatrixGroup[aio][2],vnDec,3,vThou,vDec,vFmt);
							
							PlayersMatrixTopGun[indexClean][0] = PlayersMatrixGroup[aio][2];
							PlayersMatrixTopGun[indexClean][1] = formatNumber(PlayersMatrixGroup[aio][2],vnDec,3,vThou,vDec,vFmt); 
						}
						
					};
				}else{
					var PlayersMatrix = new Array(vTotalElemsFirst);
					var PlayersMatrixTopGun = new Array(vTotalElemsFirst);
					if (vTotalElemsFirst>10) {
						vTotalElemsFirst=10;
					}
					for (var aio = 0;aio<vTotalElemsFirst;aio++) {
						
						if ((max==0 && !isNaN(PlayersMatrixGroup[aio][2]))||PlayersMatrixGroup[aio][2]>max) {
							max = PlayersMatrixGroup[aio][2];
							maxFormat = formatNumber(PlayersMatrixGroup[aio][2],vnDec,3,vThou,vDec,vFmt); 
							topgun = PlayersMatrixGroup[aio][0];
						}
						PlayersMatrix[aio] = new Array(5);
						PlayersMatrixTopGun[aio] = new Array(2);
						//var indexClean = plyrs.indexOf(PlayersMatrixGroup[aio][0]);//OJO podría fallar si hay menos de 10
						//if (indexClean >= 0) {
							PlayersMatrix[aio][0] = PlayersMatrixGroup[aio][0];
							PlayersMatrix[aio][1] = PlayersMatrixGroup[aio][1];
							PlayersMatrix[aio][2] = PlayersMatrixGroup[aio][2];
							PlayersMatrix[aio][3] = longitud;
							PlayersMatrix[aio][4] = formatNumber(PlayersMatrixGroup[aio][2],vnDec,3,vThou,vDec,vFmt); 
							
							PlayersMatrixTopGun[aio][0] = PlayersMatrixGroup[aio][2];
							PlayersMatrixTopGun[aio][1] = formatNumber(PlayersMatrixGroup[aio][2],vnDec,3,vThou,vDec,vFmt);
						//}
					};
				}
			}else{ // in this case we have 1 dimension
			
				if (associate) {
					var PlayersMatrix = new Array(10);
					var PlayersMatrixTopGun = new Array(10);
					for(var aa=0;aa<10;aa++){
						PlayersMatrix[aa] = new Array(4);
						PlayersMatrixTopGun[aa] = new Array(2);
					}					
									
					this.backendApi.eachDataRow(function(t, a) {
						if ((max == 0 && !isNaN(a[1].qNum)) || a[1].qNum > max) {
							max = a[1].qNum;
							maxFormat = a[1].qText;
							topgun = a[0].qText;
						}
						var indexClean = PlayersMatrixClean.indexOf(a[0].qText);
						if(indexClean>=0){
							PlayersMatrix[indexClean][0] = a[0].qText;
							PlayersMatrix[indexClean][1] = a[0].qElemNumber;
							PlayersMatrix[indexClean][2] = a[1].qNum;
							PlayersMatrix[indexClean][3] = longitud;
							PlayersMatrix[indexClean][4] = a[1].qText;
							
							PlayersMatrixTopGun[indexClean][0] = a[0].qNum;
							PlayersMatrixTopGun[indexClean][1] = a[1].qText;
						}
					});
				}else{ //1 dim non asso
					var PlayersMatrix = new Array(this.backendApi.getRowCount());
					var PlayersMatrixTopGun = new Array(this.backendApi.getRowCount());
					this.backendApi.eachDataRow(function(t, a) {
						if ((max==0 && !isNaN(a[1].qNum)) || a[1].qNum>max) {
							max = a[1].qNum;
							maxFormat = a[1].qText;
							topgun = a[0].qText;
						}
						PlayersMatrix[t] = new Array(5);
						PlayersMatrixTopGun[t] = new Array(2);
						PlayersMatrix[t][0] = a[0].qText;
						PlayersMatrix[t][1] = a[0].qElemNumber;
						PlayersMatrix[t][2] = a[1].qNum;
						PlayersMatrix[t][3] = longitud;
						PlayersMatrix[t][4] = a[1].qText;
						
						PlayersMatrixTopGun[t][0] = a[0].qNum;
						PlayersMatrixTopGun[t][1] = a[1].qText;
					});
				}
			}
			
			var max2= 0;
			var max3= 0;
			
			
			var maxFormat2= 0;
			var maxFormat3= 0;
			
			var maxIndex = 0;
			
			var topgun2 = '';
			var topgun3 = '';
			var toplength = 10;
			var vMarginLeft = '';
			if (PlayersMatrix.length < 10 && !associate) {
				toplength = PlayersMatrix.length;
			}
			
			for (var i = 0; i < toplength; i++) {			
			    if (PlayersMatrix[i][2] > max || (PlayersMatrix[i][2] == max && PlayersMatrix[i][0] != topgun)) {
				
				maxIndex = i;
				maxFormat3 = maxFormat2;
				maxFormat2 = maxFormat;
				max3 = max2;
				max2 = max;
				max = PlayersMatrix[i][2];
				maxFormat = PlayersMatrix[i][4];
				topgun3 = topgun2;
				topgun2 = topgun;
				topgun = PlayersMatrix[i][0];
				
				if (vNumDimensions==1) {
					if (vRaceType==1) {
						PlayersMatrix[i][3] = longitud;	
					}else{
						if (PlayersMatrix[i][2]>=vFinishLine) {
							PlayersMatrix[i][3] = longitud;
						}else{
							PlayersMatrix[i][3] = longitud*(PlayersMatrix[i][2]/vFinishLine);
						}					
					}
				}
				
				
			    }else{
				if((PlayersMatrix[i][2] > max2 && PlayersMatrix[i][2] < max) || PlayersMatrix[i][0] == topgun2) {
					max3 = max2;
					max2 = PlayersMatrix[i][2];
					maxFormat3 = maxFormat2;
					maxFormat2 = PlayersMatrix[i][4];
					topgun3 = topgun2;
					topgun2 = PlayersMatrix[i][0];
				}else{
					if((PlayersMatrix[i][2] > max3 && PlayersMatrix[i][2] < max2) || PlayersMatrix[i][0] == topgun3) {
						max3 = PlayersMatrix[i][2];
						maxFormat3 = PlayersMatrix[i][4];
						topgun3 = PlayersMatrix[i][0];
					}	
				}
				if (vRaceType==1) {
					PlayersMatrix[i][3] = PlayersMatrix[i][2] / (max/longitud);
				}else{
					if (PlayersMatrix[i][2]>=vFinishLine) {
						PlayersMatrix[i][3] = longitud;						
					}else{
						PlayersMatrix[i][3] = longitud*(PlayersMatrix[i][2]/vFinishLine);
					}
				}	
			    }
			}			
			
			
			html += '<div id="mycontent" style="height:100%;overflow:auto;background-image: url(/Extensions/Gamification/img/'+vRaceModus+'/HorsesRace.png);' +
			'background-repeat:no-repeat;' +
			'-webkit-background-size:cover;' +
			'-moz-background-size:cover;' +
			'-o-background-size:cover;' +
			'background-size:cover;' +
			'background-position:center;">';
			for (var vs2 = 0;vs2<vSecondSingleLength;vs2++) {//here
				html += '<p id ="SecondElemName' + vs2 + '" style = "color:'+vLabelColors+
				';margin-top: 25%;opacity: 0.3;text-align: center;position: absolute;visibility: hidden;z-index: 0' +
				';margin-left:' + (((100/vSecondSingleLength) - vSecondDistance) * (vs2+1)) + '%' +
				';font-size: ' + vSecondSize + ';' +
				vSecondRotate +
				'">' + SecondSingle[vs2] + '</p>';				
			}
			
			html += '<p id ="winner" style = "color:'+vLabelColors+'">1st .' + topgun + ' -->' + maxFormat + '</p>' +
			'<p id ="winner2"style = "color:'+vLabelColors+'">2nd .' + topgun2 + ' -->' + maxFormat2 + '</p>' + 
			'<p id ="winner3"style = "color:'+vLabelColors+'">3rd .' + topgun3 + ' -->' + maxFormat3 + '</p>' +
			   '<div>' +
			  
				'<div id="start">' +
					'<img class="btnStart" src="/Extensions/Gamification/img/Karting_lights.png">' +
				'</div>' +
			  
				'<div id="restart">' +
				        '<img class="btnReStart" src="/Extensions/Gamification/img/StartRace.png">' +
				'</div>' +
			   '</div>'; 
			   
			   
			var horseImg = '';
			var vPlayer1 = '*free*'
			var vPlayerN = '*free*';
			if (!isNaN(PlayersMatrix[0][1])) {
				horseImg = 'Horse0';
				vPlayer1 = PlayersMatrix[0][0];
			}else{
				horseImg = 'HorsePhantom';
			}
			html += '<div>' +  
					'<img id="race-horse0" class="horse" style = "margin-top:5%" src="/Extensions/Gamification/img/'+vRaceModus+'/' + horseImg + '.png">' +
					'<span style = "color:'+vLabelColors+'">' + vPlayer1 +'</span>' +
					'<span id = "horseText0" style = "margin-top:5%;visibility:hidden;color:'+vLabelColors+'" class="horsetext">' + vPlayer1 + ' : '+ PlayersMatrix[0][4]+'</span>' +
				'</div>';
			for (var aa = 1;aa<toplength;aa++){
				var horseImgNumber = '';
				if (!isNaN(PlayersMatrix[aa][1])) {
					   horseImgNumber = aa;
					   vPlayerN = PlayersMatrix[aa][0];
				}else{
					   horseImgNumber = 'Phantom';
					   vPlayerN = '*free*';
				   }
				html += '<div>' +  
					'<img id="race-horse' + aa + '" class="horse" src="/Extensions/Gamification/img/'+vRaceModus+'/Horse' + horseImgNumber + '.png">' +
					'<span style = "color:'+vLabelColors+'">' + vPlayerN + '</span>' +
					'<span id = "horseText'+ horseImgNumber +'"class="horsetext" style ="visibility:hidden;color:'+vLabelColors+'">' + vPlayerN + ' : '+ PlayersMatrix[aa][4] + '</span>' +
				'</div>';
			}
			
			//html += '<div>' +  
			//		'<img id="race-horseTest" class="horse" style = "margin-bottom:5%" src="/Extensions/Gamification/img/'+vRaceModus+'/' + horseImg + '.png">' +
			//	'</div>';
				
			   html +='</div>' +
			'</div>'; 
						
			function HorsePopupIn(xh){
				if (document.getElementById(xh)) {
					document.getElementById(xh).style.visibility = "visible";
					if (Started) {
						document.getElementById(xh).style.left = "-10%";	
					}else{
						document.getElementById(xh).style.left = "10%";	
					}
				}
			}
			function HorsePopupOut(xh){
				if (document.getElementById(xh)) {
					document.getElementById(xh).style.visibility = "hidden";
				}
			}
			function SelectHorse(sh){
				self.backendApi.selectValues(0,[sh],true);
				
			}
			function onStart(){ //PlayersMatrixSecond					
				
				Started = true;
				
				if (vNumDimensions == 1) {
					
					for(var va = 0; va < toplength; va++){
						var divName = "'#race-horse" + va + "'";
						var textName = "'#horseText" + va + "'";
						$(eval(divName)).css("transform", "translate(" + PlayersMatrix[va][3] + "px,0)");
						$(eval(textName)).css("transform", "translate(" + PlayersMatrix[va][3] + "px,0)");
					}
					
					setTimeout(function(){ document.getElementById('winner').style.visibility = 'visible'; }, 2000);
					setTimeout(function(){ document.getElementById('winner2').style.visibility = 'visible'; }, 2300);
					setTimeout(function(){ document.getElementById('winner3').style.visibility = 'visible'; }, 2600);
					
				}else{
					var vPlayersAnime1 = 0;
					var vPlayersAnime2 = 0;
					var vPlayersAnime3 = 0;
					var vPlayersAnime4 = 0;
					var divName = '';
					var textName = '';
					
					for(var va = 0; va < vTotalElemsFirst; va++){
						var vAcum = 0;
						if (vRaceType==1) {
							for(var va2 = 1;va2<(vSecondSingleLength + 1);va2++){
								vAcum += PlayersMatrixSecond[va][va2];
								PlayersMatrixAnime[va][va2] = Math.round(longitud * vAcum / max);
							}
							
						}else{
							for(var va2 = 1;va2<(vSecondSingleLength + 1);va2++){
								vAcum += PlayersMatrixSecond[va][va2];
								PlayersMatrixAnime[va][va2] = Math.round(longitud * vAcum / vFinishLine);							
							}
						}
						vAcum = 0;
						
						
						divName = "'#race-horse" + va + "'";
						textName = "'#horseText" + va + "'";
						
						$(eval(textName)).css("transform", "translate(" + PlayersMatrixAnime[va][vSecondSingleLength] + "px,0)");
																				
					}
					
					var logArray0 = 0;
					var logArray1 = 1;
					var logArray2 = 2;
					var logArray3 = 3;
					var logArray4 = 4;
					var logArray5 = 5;
					var logArray6 = 6;
					var logArray7 = 7;
					var logArray8 = 8;
					var logArray9 = 9;
					
					if (vTotalElemsFirst>0) {
						logArray0 = 0;
						iterateHorse0();    
						function iterateHorse0() {
							logArray0++;
							setTimeout(function(){
								$('#race-horse0').css("transform", "translate(" + PlayersMatrixAnime[0][logArray0] + "px,0)");
								if (logArray0<=vSecondSingleLength) {
								    iterateHorse0()
								}
								},vRaceSpeed
							);  						
						}
					}
					
										
					if (vTotalElemsFirst>1) {
						logArray1 = 0;
						iterateHorse1();    
						function iterateHorse1() {
							logArray1++;
							setTimeout(function(){
								$('#race-horse1').css("transform", "translate(" + PlayersMatrixAnime[1][logArray1] + "px,0)");
								if (logArray1<=vSecondSingleLength) {
								    iterateHorse1()
								}
								},vRaceSpeed
							);  						
						}
					}
					if (vTotalElemsFirst>2) {
						logArray2 = 0;
						iterateHorse2();    
						function iterateHorse2() {
							logArray2++;
							setTimeout(function(){
								$('#race-horse2').css("transform", "translate(" + PlayersMatrixAnime[2][logArray2] + "px,0)");
								if (logArray2<=vSecondSingleLength) {
								    iterateHorse2()
								}
								},vRaceSpeed
							);  						
						}
					}
					
					if (vTotalElemsFirst>3) {
						logArray3 = 0;
						iterateHorse3();    
						function iterateHorse3() {
							logArray3++;
							setTimeout(function(){
								$('#race-horse3').css("transform", "translate(" + PlayersMatrixAnime[3][logArray3] + "px,0)");
								if (logArray3<=vSecondSingleLength) {
								    iterateHorse3()
								}
								},vRaceSpeed
							);  						
						}
					}
					
					if (vTotalElemsFirst>4) {
						logArray4 = 0;
						iterateHorse4();    
						function iterateHorse4() {
							logArray4++;
							setTimeout(function(){
								$('#race-horse4').css("transform", "translate(" + PlayersMatrixAnime[4][logArray4] + "px,0)");
								if (logArray4<=vSecondSingleLength) {
								    iterateHorse4()
								}
								},vRaceSpeed
							);  						
						}
					}
					
					if (vTotalElemsFirst>5) {
						logArray5 = 0;
						iterateHorse5();    
						function iterateHorse5() {
							logArray5++;
							setTimeout(function(){
								$('#race-horse5').css("transform", "translate(" + PlayersMatrixAnime[5][logArray5] + "px,0)");
								if (logArray5<vSecondSingleLength) {
								    iterateHorse5()
								}
								},vRaceSpeed
							);  						
						}
					}
					
					if (vTotalElemsFirst>6) {
						logArray6 = 0;
						iterateHorse6();
						function iterateHorse6() {
							logArray6++;
							setTimeout(function(){
								$('#race-horse6').css("transform", "translate(" + PlayersMatrixAnime[6][logArray6] + "px,0)");
								if (logArray6<vSecondSingleLength) {
								    iterateHorse6()
								}
								},vRaceSpeed
							);  						
						}
					}
					
					
					if (vTotalElemsFirst>7) {
						logArray7 = 0;
						iterateHorse7();    
						function iterateHorse7() {
							logArray7++;
							setTimeout(function(){
								$('#race-horse7').css("transform", "translate(" + PlayersMatrixAnime[7][logArray7] + "px,0)");
								if (logArray7<=vSecondSingleLength) {
								    iterateHorse7()
								}
								},vRaceSpeed
							);  						
						}
					}
					
					if (vTotalElemsFirst>8) {
						logArray8 = 0;
						iterateHorse8();    
						function iterateHorse8() {
							logArray8++;
							setTimeout(function(){
								$('#race-horse8').css("transform", "translate(" + PlayersMatrixAnime[8][logArray8] + "px,0)");
								if (logArray8<=vSecondSingleLength) {
								    iterateHorse8()
								}
								},vRaceSpeed
							);  						
						}
					}
					
					if (vTotalElemsFirst>9) {
						logArray9 = 0;
						iterateHorse9();    
						function iterateHorse9() {
							logArray9++;
							setTimeout(function(){
								$('#race-horse9').css("transform", "translate(" + PlayersMatrixAnime[9][logArray9] + "px,0)");
								if (logArray9<=vSecondSingleLength) {
								    iterateHorse9()
								}
								},vRaceSpeed
							);  						
						}
					}
					var vSecondElemName = ''
					var logArraySecond = -1;
					if (vSecondSingleLength>0) {
						iterateSecond();    
						function iterateSecond() {
							logArraySecond++;
							setTimeout(function(){
								vSecondElemName = 'SecondElemName' + logArraySecond;
								
								setTimeout(function(){ document.getElementById(eval('vSecondElemName')).style.visibility = 'visible'; }, vRaceSpeed);
								if (logArraySecond<(vSecondSingleLength-1)) {
								    iterateSecond()
								}
								},vRaceSpeed
							);  						
						}
					}
					
					setTimeout(function(){ document.getElementById('winner').style.visibility = 'visible'; }, vRaceSpeed + (vRaceSpeed * vSecondSingleLength));//6500
					setTimeout(function(){ document.getElementById('winner2').style.visibility = 'visible'; }, vRaceSpeed + 300 + (vRaceSpeed * vSecondSingleLength));//6800
					setTimeout(function(){ document.getElementById('winner3').style.visibility = 'visible'; }, vRaceSpeed + 600 + (vRaceSpeed * vSecondSingleLength));//7100
				}															
			}
			
			function onReStart(){
				Started = false;
				var vSecondElemName = ''
				for(var vv2=0;vv2<vSecondSingleLength;vv2++){
					vSecondElemName = 'SecondElemName' + vv2;
					document.getElementById(eval('vSecondElemName')).style.visibility = 'hidden';					
				}
				
				document.getElementById('winner').style.visibility = 'hidden';
				document.getElementById('winner2').style.visibility = 'hidden';
				document.getElementById('winner3').style.visibility = 'hidden';
				
				for(var va = 0; va < toplength; va++){			   
					var divName = "'#race-horse" + va + "'";
					var textName = "'#horseText" + va + "'";
					$(eval(divName)).css("transform", "none");
					$(eval(textName)).css("transform", "none");
				}				
			}
			
			function formatNumber(numb,n, x, s, c, l) {
				if (!isNaN(numb)) {
					if (l=='%') {
						numb = numb * 100;
					}
					var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
					num = numb.toFixed(Math.max(0, ~~n));
					
					if (!isNaN(l)) {
						return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
					}else{
						return ((c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ',')) + ' ' + l);
					}
				}
			};
			
			function onlyUnique(value, index, self)
			{ 
				return self.indexOf(value) === index;
			};
			
			
				
			$element.html(html);
			$element.find('#start').on('qv-activate', onStart);
			$element.find('#restart').on('qv-activate', onReStart);
			
			document.getElementById("race-horse0").onmouseover = function() {HorsePopupIn("horseText0")};
			document.getElementById("race-horse0").onmouseout = function() {HorsePopupOut("horseText0")};
			document.getElementById("race-horse0").onclick = function() {SelectHorse(PlayersMatrix[0][1])};
			
			if (toplength>1) {
				document.getElementById("race-horse1").onmouseover = function() {HorsePopupIn("horseText1")};
				document.getElementById("race-horse1").onmouseout = function() {HorsePopupOut("horseText1")};
				document.getElementById("race-horse1").onclick = function() {SelectHorse(PlayersMatrix[1][1])};
			}
			
			if (toplength>2) {
				document.getElementById("race-horse2").onmouseover = function() {HorsePopupIn("horseText2")};
				document.getElementById("race-horse2").onmouseout = function() {HorsePopupOut("horseText2")};
				document.getElementById("race-horse2").onclick = function() {SelectHorse(PlayersMatrix[2][1])};
			}
			
			if (toplength>3) {
				document.getElementById("race-horse3").onmouseover = function() {HorsePopupIn("horseText3")};
				document.getElementById("race-horse3").onmouseout = function() {HorsePopupOut("horseText3")};
				document.getElementById("race-horse3").onclick = function() {SelectHorse(PlayersMatrix[3][1])};
			}
			
			if (toplength>4) {
				document.getElementById("race-horse4").onmouseover = function() {HorsePopupIn("horseText4")};
				document.getElementById("race-horse4").onmouseout = function() {HorsePopupOut("horseText4")};
				document.getElementById("race-horse4").onclick = function() {SelectHorse(PlayersMatrix[4][1])};
			}
			
			if (toplength>5) {
				document.getElementById("race-horse5").onmouseover = function() {HorsePopupIn("horseText5")};
				document.getElementById("race-horse5").onmouseout = function() {HorsePopupOut("horseText5")};
				document.getElementById("race-horse5").onclick = function() {SelectHorse(PlayersMatrix[5][1])};
			}
			
			if (toplength>6) {
				document.getElementById("race-horse6").onmouseover = function() {HorsePopupIn("horseText6")};
				document.getElementById("race-horse6").onmouseout = function() {HorsePopupOut("horseText6")};
				document.getElementById("race-horse6").onclick = function() {SelectHorse(PlayersMatrix[6][1])};
			}
			
			if (toplength>7) {
				document.getElementById("race-horse7").onmouseover = function() {HorsePopupIn("horseText7")};
				document.getElementById("race-horse7").onmouseout = function() {HorsePopupOut("horseText7")};
				document.getElementById("race-horse7").onclick = function() {SelectHorse(PlayersMatrix[7][1])};
			}
			
			if (toplength>8) {
				document.getElementById("race-horse8").onmouseover = function() {HorsePopupIn("horseText8")};
				document.getElementById("race-horse8").onmouseout = function() {HorsePopupOut("horseText8")};
				document.getElementById("race-horse8").onclick = function() {SelectHorse(PlayersMatrix[8][1])};
			}
			
			if (toplength>9) {
				document.getElementById("race-horse9").onmouseover = function() {HorsePopupIn("horseText9")};
				document.getElementById("race-horse9").onmouseout = function() {HorsePopupOut("horseText9")};
				document.getElementById("race-horse9").onclick = function() {SelectHorse(PlayersMatrix[9][1])};
			}
		}
	};
});
