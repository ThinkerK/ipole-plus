import fetch from './ajax.js'
export default {
	queryPoleData(data){ // 查询灯杆信息
		return fetch('/dawhAppController/mxmx/queryDgDataStateAPP', data)
	},
	savePoleData(data){	//保存灯杆信息
		return fetch("/dawhAppController/mxmx/saveDawhXx",data)
	},
	savePolePoint(data){	//保存灯杆经纬度
		return fetch("dawhAppController/mxmx/updateDgJwdforDgId",data)
	},
	checkGateway(data){	//验证物联网关唯一性
		return fetch("/dawhAppController/mxmx/queryJbxxByZcbh",data)
	},
	saveGateway(data){		//保存物联网关信息
		return fetch("/dawhAppController/mxmx/saveWlwgXx",data)
	},
	saveGlq(data){		//保存用电管理器信息
		return fetch("/dawhAppController/mxmx/saveYdglqXx",data)
	},
	saveDevice(data){	//保存设备
		return fetch("/dawhAppController/mxmx/saveJrsbXx",data)
	},
	getwkData(data){	//查询网口信息
		return fetch('/dawhAppController/mxmx/queryDkhByPch',data)
	},
	queryTp(data){	//查询实拍图信息
		return fetch('/dawhAppController/mxmx/queryPictureByDgId',data)
	},
	saveTp(data){	//保存实拍图片
		return fetch('/Uploadmxmx/defaultPathUpload',data)
	}
}
