import axios from 'axios'
import qs from 'qs'
import Ajax from '../axios/axiosConfig.js'
import { Toast } from 'mint-ui'
import { MessageBox } from 'mint-ui';

const state = {	//定义常量，资源库
	lng : "",			//经度
	lat : "",			//纬度
	poleNum : "",		//灯杆号
	poleId : "",		//灯杆id
	poleData : "",		//灯杆数据
	gatewayData : [],	//网关数据
	deviceData	: [""],	//设备数据
	deviceFlag : false,	//保存设备的标识	
	glqData : [] ,		//用电管理器
	
//	adddeviceData : [],	//新增设备保存
	updateDeviceArr : [],   //设备更改保存
	gatewayNum : [""],		//网关数量
	gatewayArr : [],		//网关传到新增页面的网关
	imgsArr : [],		//获取实拍图片
	imgList : [],       //添加图片
	submintFlag : false,	//是否可以提交 (灯杆查询结束后才可以提交信息)
	codeHideFlag : false,	//与隐藏扫码标识
	updateDeviceIndex : "",       //要修改的设备信息下标
	fileIds:"" ,          //图片id
	glqNum :[]
}

const actions = {
	queryPoleData({commit},data){	//查询灯杆信息
		Ajax.queryPoleData(data).then(function(res){
			commit('setPoleData', res);
		}.bind(this))
	},
	savePoleData({commit},data){	//保存灯杆信息
		Ajax.savePoleData(data).then(function(res){
			commit("setSavePoleData",res);
			commit("checkGateway",res);	//保存网关信息
			commit("getDeviceData",res);	//保存设备信息
			commit("checkGlq");    
		}.bind(this));
	},
	savePolePoint({commit},data){	//保存灯杆经纬度
		let poleNum = {
			dgh : this.state.main_store.poleNum
		}
		Ajax.savePolePoint(data).then(function(res){
			this.dispatch("queryPoleData",poleNum);	//查询灯杆信息
		}.bind(this))
		.catch(function(){
			MessageBox.alert("请求失败，请检查网络", '网络错误');
		})
	},
	saveGateway({commit},data){	//保存物联网关
		let poleNum = {
			dgh : this.state.main_store.poleNum
		}
		Ajax.saveGateway(data).then(function(res){
			if(res != "fail"){
				this.dispatch("queryPoleData",poleNum);	//查询灯杆信息
			}else{
				MessageBox.alert("物联网管提交失败,请检查后重新提交", '提交失败');
			}
		}.bind(this))
		.catch(function(){
			MessageBox.alert("请求失败，请检查网络", '网络错误');
		})
	},
	saveGlq({commit},data){	//保存管理器
		let poleNum = {
			dgh : this.state.main_store.poleNum
		}
		Ajax.saveGlq(data).then(function(res){
			if(res != "fail"){
				this.dispatch("queryPoleData",poleNum);	//查询灯杆信息
			}else{
				MessageBox.alert("用电管理器提交失败,请检查后重新提交", '提交失败');
			}
		}.bind(this))
		.catch(function(){
			MessageBox.alert("请求失败，请检查网络", '网络错误');
		})
	},
	saveDevice({commit},data){	//保存设备信息
		let poleNum = {
			dgh : this.state.main_store.poleNum
		}
		Ajax.saveDevice(data).then(function(res){
			debugger
			if(res != "fail"){ 
				this.dispatch("queryPoleData",poleNum);	//查询灯杆信息
			}else{
				MessageBox.alert("设备提交失败,请检查后重新提交", '提交失败');
			}
		}.bind(this))
		.catch(function(){
			MessageBox.alert("请求失败，请检查网络", '网络错误');
		})
	},
	queryTp({commit},data){	//查询图片信息
		let poleNum = {
			dgh : this.state.main_store.poleNum
		}
		Ajax.queryTp(data).then(function(res){
			if(res != "fail"){ 
					commit('getImgsArr', res)
					commit("delImgList")
			}
		}.bind(this))
		.catch(function(){
			MessageBox.alert("请求失败，请检查网络", '网络错误');
		})
	}
}

const mutations = {	
	ScanState(state){ //箭头打开扫码
		state.codeHideFlag = false
	},
	delImgList(state){	//清空上传图片数组
		state.imgList = []
	},
	getImgsArr(state,res){
		state.imgsArr = []
		if(res.data != null){
			var res = res.data.filePath.split(',')
			for(var i = 0;i<res.length;i++){
				state.imgsArr.push({
					src:res[i]
				})
			}
		}
	},
	addImgs(state,res){ //添加img
		state.imgsArr.push(res)
	},
	imgListAdd(state,res){
		state.imgList.push(res)
	},
	setPoleNum(state,res){	//设置灯杆号
		state.poleNum = res;
	},
	setpoint(state,res){	//设置灯杆经纬度
		state.lng = res.lng;
		state.lat = res.lat;
	},
	setSavePoleData(state,res){	//设置灯杆Id
		state.poleId = res;
	},
	addGlq(state){
		state.glqNum = [];
	},
	setGatewayNum(state,res){
		state.gatewayNum = [];
	},
	addGlq(state,res) {
		state.glqNum.push("")
	},
	setGatewayNum(state,res){	//设置物联网关输入框个数
		let $state = this.state.main_store;
		let num = $state.gatewayNum.length
		let gatewayNumArr = $state.gatewayNum;
		gatewayNumArr.push("");
		state.gatewayNum = gatewayNumArr;
	},
	setGatewayNumArr(state,res){	//失去焦点设置网关号
		let index = res;
		let name = 'wg' + index;
		var inputVal = document.getElementById(name).value;
		var iptZcbh = inputVal.substring(0,7)+'-'+inputVal.substring(7)
		let data = {
			zchm : iptZcbh,
			type : '1'
		}
		if(inputVal != ""){
			Ajax.checkGateway(data).then(function(res){		//验证物联网关是否存在
			if(res != null){
				let arr = state.gatewayNum;
				arr[index] = inputVal
				state.gatewayNum = arr;
			}else{
				MessageBox.alert("输入的物联网关编号有误,请核对", '错误提示');
			}
			}.bind(this));
		}
		
	},
	setGlqNum(state,res){    //失去焦点设置用电管理器号
		let index = res;
		let name = 'glq' + index;
		var inputVal = document.getElementById(name).value;
		var iptZcbh = inputVal.substring(0,7)+'-'+inputVal.substring(7)
		let data = {
			zchm : iptZcbh,
			type : '2'
		}
		if(inputVal != ""){
			Ajax.checkGateway(data).then(function(res){		//验证物联网关是否存在
			if(res != null){
				let arr = state.glqNum;
				arr[index] = inputVal
				state.glqNum = arr;
			}else{
				MessageBox.alert("输入的用电管理器编号有误,请核对", '错误提示');
			}
			}.bind(this));
		}
	},
	computedWg(state,res){	//往新增页面传递物联网关号码	
		state.deviceFlag = true;
		let arr = state.gatewayNum;
		let newArr = [];
		for(let i =0;i < arr.length;i++){
			if(arr[i] != ""){
				newArr.push(arr[i]);
			}
		}
		let gatewayData = state.gatewayData;	//老数据
		for(let j =0; j < gatewayData.length; j++){
			newArr.push(gatewayData[j].sbbh);
		}
		state.gatewayArr = newArr;
		if(newArr[0] != "" && newArr[0] != undefined){
			this.commit("setwlwgNum",newArr[0]);
		}
		
	},
	removeGatewayNumArr(state,res){	//删除物联网关输入框
		Array.prototype.remove=function(obj){
			for(let i =0;i <this.length;i++){
				let temp = this[i]; 
				if(!isNaN(obj)){
					temp=i; 
				} 
				if(temp == obj){
					for(let j = i;j <this.length;j++){
						this[j]=this[j+1]; 
					} 
					this.length = this.length-1; 
				} 
			} 
		} 
		let index = res;
		let name = 'wg' + index;
    	let oldArr = state.gatewayNum;
    	let newarr = new Array();
    	for(let i = 0; i < oldArr.length; i++) {
    		newarr[i] = oldArr[i];
    	}
		newarr.remove(index);    	
    	state.gatewayNum = newarr;
	},
	removeGlqNumArr(state,res){	//删除用电管理器输入框
		Array.prototype.remove=function(obj){
			for(let i =0;i <this.length;i++){
				let temp = this[i]; 
				if(!isNaN(obj)){
					temp=i; 
				} 
				if(temp == obj){
					for(let j = i;j <this.length;j++){
						this[j]=this[j+1]; 
					} 
					this.length = this.length-1; 
				} 
			} 
		} 
		let index = res;
		let name = 'glq' + index;
    	let oldArr = state.glqNum;
    	let newarr = new Array();
    	for(let i = 0; i < oldArr.length; i++) {
    		newarr[i] = oldArr[i];
    	}
		newarr.remove(index);    	
    	state.glqNum = newarr;
	},
	setAddDevice(state,res){	//新增设备页面设置
		//先判断设备类型是否存在    再去push
		if(res.sblx != ""){
			window.history.back();
			let deviceData = state.deviceData;	//老数据
			if(deviceData[0] == ''){
				deviceData = []
			}
			deviceData.push(res);
			state.deviceData = deviceData;	//展示新的设备
			
//			let newdata = state.adddeviceData;	//新增设备保存
//			newdata.push(res);
//			state.adddeviceData = newdata;	
		}else{
			Toast("请选择设备类型");
		}
		
	},
	updateDevice(state,res){
		debugger
		if(res.sblx != ""){
			let deviceDataIndex = state.deviceData[state.updateDeviceIndex];
			deviceDataIndex.sblx = res.sblx;
	  		deviceDataIndex.sblxStr = res.sblxStr;
	  		deviceDataIndex.sbmc = res.sbmc;
	  		deviceDataIndex.txlx = res.txlx;
	  		deviceDataIndex.txfs = res.txfs	;			//通讯方式
			deviceDataIndex.jdwlxh = res.jdwlxh;	//lan口
			deviceDataIndex.ckh = res.ckh;				//485串口
			deviceDataIndex.ydlx = res.ydlx;				//用电类型
			deviceDataIndex.kzhlh = res.kzhlh;				//电口
			deviceDataIndex.ccbh = res.ccbh	;			//出厂编号
			deviceDataIndex.sswlwg = res.sswlwg;
			if(deviceDataIndex.id!= false){
				state.updateDeviceArr.push(deviceDataIndex)	
			}
				
		}
		else{
			Toast("请选择设备类型");
		}
	},
	setPoleData(state,res){	//灯杆信息查询结果
		let dgObj = res.data.dgObj;
		let wgArry = res.data.wgArry;
		let wlsbArry = res.data.wlsbArry;
		let ydArry = res.data.ydArry;
		if(res.errCode == 0){	//有数据
			if(wlsbArry.length == 0){
				wlsbArry = [""]
			};
			state.poleData = dgObj;
			state.gatewayData = wgArry;
			state.glqData = ydArry;
			state.deviceData = wlsbArry;
			state.poleId = dgObj.dgId;		//灯杆id
			state.lng = dgObj.jd;
			state.lat = dgObj.wd;
			if(state.poleId != ""){ //查询图片
				var data = {
					dgId : state.poleId
				} 
				this.dispatch("queryTp",data)
			}
			if(wgArry.length==0){
				state.gatewayNum =[""]
			}else{
				state.gatewayNum = [];		
			}//添加万联网关输入框
			state.glqNum = []
			state.codeHideFlag = true;	//隐藏扫码标识
		}else{
			state.poleData = "";
			state.gatewayData = "";
			state.glqData = "";
			state.deviceData = [""];
			state.poleId = "";
			state.lng = "";
			state.lat = "";
			state.gatewayNum = [""];//添加万联网关输入框
			state.imgsArr = []		
			state.imgList = []	
			state.glqNum = [];
			state.codeHideFlag = true   //显示扫码标识
			Toast("无灯杆信息");
		}
		state.submintFlag = true;	//灯杆查询结束标志
		state.deviceFlag = false;	//保存设备标识
		state.adddeviceData = [];	//新增数据存储----
	},
	submitPoleData(state,res){	//提交信息
		let $state = this.state.main_store;
		if($state.submintFlag){	//是否可以进行提交操作	
			if($state.poleId == ""){	//不存在
				if($state.lng != ""){
					this.commit("getPoleData");			//保存灯杆信息
				}else{	//经纬度为空
					Toast("请先定位");
				}
			}else{		//存在
				if($state.lng != ""){
					this.commit("getSavePolePoint");	//保存经纬度
					this.commit("getDeviceData");		//保存设备信息
					this.commit("updateDeviceData");     //修改设备保存
					this.commit("checkGateway");//验证网关唯一性并保存	
					this.commit("checkGlq");  //保存管理器
				}else{	//经纬度为空
					Toast("请先定位");
				}
			}
		}
	},
	getPoleData(state,res){		//保存灯杆数据
		let $state = this.state.main_store;
		let poledata = {														//灯杆保存信息
	    		userId : '001ADVH00001',	//登录的id
	    		userName : 'liuwei',		//登录的名字
	    		disbh : $state.poleId,				//灯杆id
	    		dgh : $state.poleNum,				//灯杆号
	    		dgmc : $state.poleNum,				//灯杆名称
	    		gzdlx : '1',				//
	    		zhcq : '110109',
	    		xzqh : '110109',
	    		ssdw : 'dG48wUroQA2tOhFo',
	    		gldw : 'dG48wUroQA2tOhFo',
	    		jdDou : $state.lng,
	    		wdDou : $state.lat,
	    		jjxId : '1',
	    		ldbld : '1',
	    		bz : '1'
    	}
		this.dispatch("savePoleData",poledata);
	},
	getSavePolePoint(state,res){	//保存经纬度
		let $state = this.state.main_store;
		let polePoint = {
			dgId : $state.poleId,
			jdDou : $state.lng,
    		wdDou : $state.lat
    	}
		this.dispatch("savePolePoint",polePoint);
	},
	checkGateway(state,res){		//验证物联网关唯一性
		let gatewayNum = state.gatewayNum;
		if(gatewayNum.length > 0){
			for(let i = 0; i < gatewayNum.length; i++) {
				if(gatewayNum[i] != ""){
					var iptZcbh = gatewayNum[i].substring(0,7)+'-'+gatewayNum[i].substring(7)
					let data = {
						zchm : iptZcbh,
						type : '1'
					}
					let wgData = {
						jsonStr:JSON.stringify([{
							userId : '001ADVH00001',
				    		userName : 'liuwei',
				    		zcbh : gatewayNum[i],
				    		pch : gatewayNum[i].substring(0,7),
				    		gxh1 : "",										//光纤号
				    		gxh2 : "",
				    		sbxh : '1',
				    		disbh : '',
				    		ssdw : 'dG48wUroQA2tOhFo',
				    		gldw : 'dG48wUroQA2tOhFo',
				    		azrq : "2018-05-28",
				    		bz : '1',
				    		dgId : state.poleId,
				    		dgmc : state.poleId,
				    		sswlwg : gatewayNum[i],	
				    		dgglqdz : 'beijing',
				    		sblx : '1',
				    		btl : '1',
				    		sbdz : 'beijing',
				    		gylx : '1',
				    		gybb : '1',
				    		cstd : '1',
				    		zcQzSyFlag : '0',
				    		updateFlag : '1'
						}])
					}
					
					Ajax.checkGateway(data).then(function(res){		//验证物联网关的唯一性
						debugger
						if(res != null){	//唯一
							this.dispatch("saveGateway",wgData);	//保存物联网关
						}
					}.bind(this));
				}
			}
		}
	},
	
	checkGlq(state){		//保存管理器
		let glqNum = state.glqNum;
		if(glqNum.length > 0){
			let nowDate = new Date();
			let year = nowDate.getFullYear();
			let month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1): nowDate.getMonth() + 1;
			let day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
			let time = year + "-" + month + "-" + day;	//当前日期
			let newYdArr = [];
			for(let i = 0; i < glqNum.length; i++) {
				if(glqNum[i] != ""){
					var iptZcbh = glqNum[i].substring(0,7)+'-'+glqNum[i].substring(7)
					let data = {
						zchm : iptZcbh,
						type : '2'
					}
					Ajax.checkGateway(data).then(function(res){		//验证用电管理器是否存在
						if(res != null){
							newYdArr.push({
								userId : '001ADVH00001',
								userName : 'liuwei',
								zcbh : glqNum[i],
								pch : glqNum[i].substring(0,7),
								gxh1 : "",										//光纤号
								gxh2 : "",
								sbxh : '1',
								disbh : '',
								ssdw : 'dG48wUroQA2tOhFo',
								gldw : 'dG48wUroQA2tOhFo',
								azrq : time,
								bz : '1',
								dgId : state.poleId,
								dgmc : state.poleId,
								sswlwg : "",	
								dgglqdz : state.gatewayData[0].sbbh.substring(0,7)+state.gatewayData[0].sbbh.substring(8),
								sblx : '1',
								btl : '1',
								sbdz : 'beijing',
								gylx : '1',
								gybb : '1',
								cstd : '1',
								txfs : '2',
								ckh : "",
								jdwlxh : '1',
								cstd : "1",
								zcQzSyFlag : '0',
								updateFlag : '1',
							})
							debugger
							let ydData = {
								"userId" : '001ADVH00001',
								"userName" : 'liuwei',
								jsonStr:JSON.stringify(newYdArr)
							};
							if(newYdArr.length>0){
								this.dispatch("saveGlq",ydData);	//保存用电管理器
							}
						}
					}.bind(this));
						
				}
			}

			
		}
	},

	getDeviceData(state,res){	//新增设备信息保存
		debugger
		if(state.deviceData[state.deviceData.length-1].id == false){
			let $addDevice = this.state.addDevice_store;	//新增设备的store
			let sbdata = state.deviceData.reverse();
			let nowDate = new Date();
			let year = nowDate.getFullYear();
			let month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1): nowDate.getMonth() + 1;
			let day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
			let time = year + "-" + month + "-" + day;	//当前日期
			let newSbArr = [];
			for(let i = 0; i < sbdata.length; i++) {
				if(sbdata[i].id == false){
					newSbArr.push({					//新增设备
						"zhcq" : "110109",
						"pch" : $addDevice.sswlwg.substring(0,7),
						"sbmc" : sbdata[i].sbmc,
						"sblx" : sbdata[i].sblx,
						"disbh" : "",	//设备id
						"ccbh" : sbdata[i].ccbh,						//--出厂编号
						"sccj" : "中国制造",							//--生产厂家
						"gxh1" : "",
						"gxhArr" : [],
						"ssdw" : 'dG48wUroQA2tOhFo',
						"gldw" : 'dG48wUroQA2tOhFo',
						"azrq" : time,
						"bz" : "",
						"dgId" : state.poleId, 
						"dgmc" : state.poleId,
						"xh" : "1",
						"sblxStr" : sbdata[i].sbmc,
						"cstd" : "",
						"ddkzqbh" : "1",				//--单灯控制器编号
						"gdglfs" : 1,					//供电管理方式
						"zcQzSyFlag" : '0',
						"updateFlag" : '1',
			  		    "sswlwg" : sbdata[i].sswlwg,								//物联网关
						"txfs" : sbdata[i].txfs,					//通讯方式
						"txlx" :sbdata[i].txfs,                  //通信类型
						"jdwlxh" : sbdata[i].jdwlxh ? sbdata[i].jdwlxh:"",				//lan口
						"ckh" : sbdata[i].ckh,					//485串口
						"ydlx" : sbdata[i].ydlx,					//用电类型
						"kzhlh" : sbdata[i].kzhlh,					//电口
						"zcQzSyFlag" : '0',
						"updateFlag" : '1',
					});
				}
			}
			debugger
				let data = {
				"userId" : '001ADVH00001',
	    		"userName" : 'liuwei',
				jsonStr:JSON.stringify(newSbArr.reverse())
				};
				//---添加设备--
				this.dispatch("saveDevice",data);	//保存设备
			
			
		}
	},
	
	updateDeviceData(state,res){	//更改设备信息保存
		if(state.updateDeviceArr.length !=0){
			let sbdata = state.updateDeviceArr
			let nowDate = new Date();
			let year = nowDate.getFullYear();
			let month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1): nowDate.getMonth() + 1;
			let day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
			let time = year + "-" + month + "-" + day;	//当前日期
			let updateSbArr = [];
			for(let i = 0; i < sbdata.length; i++) {
					updateSbArr.push({		
						"updateFlag" : '0',
						"zhcq" : "110109",
						"pch" : sbdata[i].sswlwg.substring(0,7),
						"sbmc" : sbdata[i].sbmc,
						"sblx" : sbdata[i].sblx,
						"disbh" : sbdata[i].id,	//设备id
						"ccbh" : sbdata[i].ccbh,						
						"sccj" : "中国制造",							
						"gxh1" : "",
						"gxhArr" : [],
						"ssdw" : 'dG48wUroQA2tOhFo',
						"gldw" : 'dG48wUroQA2tOhFo',
						"azrq" : time,
						"bz" : "",
						"dgId" : state.poleId, 
						"dgmc" : state.poleId,
						"xh" : "1",
						"sblxStr" : sbdata[i].sbmc,
						"cstd" : "",
						"ddkzqbh" : "1",				//--单灯控制器编号
						"gdglfs" : 1,					//供电管理方式
						"zcQzSyFlag" : '0',
			  		    "sswlwg" : sbdata[i].sswlwg,								//物联网关
						"txfs" : sbdata[i].txlx,					//通讯方式
						"txlx" :sbdata[i].txfs,                  //通信类型
						"jdwlxh" : sbdata[i].jdwlxh ? sbdata[i].jdwlxh:"",				//lan口
						"ckh" : sbdata[i].ckh,					//485串口
						"ydlx" : sbdata[i].ydlx,					//用电类型
						"kzhlh" : sbdata[i].kzhlh,					//电口
						"zcQzSyFlag" : '0',
						
					});
				
			}
			debugger
			let data = {
				"userId" : '001ADVH00001',
	    		"userName" : 'liuwei',
				jsonStr:JSON.stringify(updateSbArr)
			};
			//---添加设备--
			this.dispatch("saveDevice",data);	//保存设备
		}
		state.updateDeviceArr = []

	},
	
	toDevice(state,res){	//跳转设备修改页面
		let $state = this.state.main_store;
		$state.updateDeviceIndex=res;
		debugger
		state.deviceFlag = true;
		let index = res;	//设备下标
		let data = state.deviceData[index];
		this.commit("setDeviceData",data);	//修改设备
	}
	
}

export default {
	state,
    actions,
    mutations
}