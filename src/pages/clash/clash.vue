<template>
	<div class="clash">
		<header class="head">
	    	<div class="back-btn" v-on:click="goBack"></div>
	    	<div class="head-title">设备信息</div>
	    	<div class="edit">编辑</div>
    	</header>
    	<div class="section">
    		<div class="clash-device">
    			<div class="title">已有信息</div>
    			<div class="device-list">
					<div class="list-item">
						<div class="item-left">
							<div class="check active"></div>
	    					<span class="item-title">设备名称</span>
						</div>
						<div class="item-right">
							<div class="right-top">123123132</div>
							<div class="right-bottom">
								<div class="device-icon pic1"></div>
								<div class="device-msg">
									<p class="wk-msg">网口: <span>6</span></p>
									<p class="yd-msg">交流: <span>1</span></p>
								</div>
							</div>
						</div>
					</div> 
    			</div>
    		</div>
    		
    		<div class="clash-device">
    			<div class="title">新信息</div>
    			<div class="device-list">
					<div class="list-item">
						<div class="item-left">
							<div class="check active"></div>
	    					<span class="item-title">设备名称</span>
						</div>
						<div class="item-right">
							<div class="right-top">123123132</div>
							<div class="right-bottom">
								<div class="device-icon pic1"></div>
								<div class="device-msg">
									<p class="wk-msg">网口: <span>6</span> </p>
									<p class="yd-msg">交流: <span>1</span> </p>
								</div>
							</div>
						</div>
					</div> 
					
    			</div>
    		</div>
    		
    	</div>
    	<div class="bottom-btn-box padding-top">
		    	<div class="btn btn-default cancel" @click="cancelClick" >取消</div>
		    	<div class="btn btn-blue" @click="replaceClick" >替换</div>
		</div>
	</div>
</template>

<script>
	export default {
	  data () {
	    return {
	      
	    }
	  },
	  methods:{
	  	goBack(){
	  		window.history.back();
	  	},
	  	cancelClick(){
	  		this.$router.push('/')
	  	},
	  	replaceClick(){
	  		this.$router.push('/')
	  	}
	  }
 	}
	
</script>

<style scoped>
	.clash{
		height: 100%;
		background: white
	}
	.head{
		height: 1.77rem; 
		background: #0c1234;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.36rem 0.40rem 0.3rem 0.40rem;
	}
	.head .back-btn{
		width: 0.40rem;
		height: 0.62rem;
		background: url(../../assets/back_bg.png) no-repeat;
    	background-size: 100% 100%;
	}
	.head .head-title{
		height: 0.50rem;
		color: #fff;
		font-size: 0.50rem;
	}
	.head .edit{
		width: 0.90rem;
		height: 0.50rem;
		color: #fff;
		font-size: 0.42rem;
	}
	.section{
		background: white;
	}
	.title{
		padding: 0 .5rem;
		text-align: left;
		height: 1.2rem;
		line-height: 1.2rem;
		background: #f7f7f7;
		color: #000;
	}
	.device-list .list-item{
		display: flex;
		justify-content: flex-start;
		padding: .4rem .5rem;
		border: 1px solid #f7f7f7;
	}
	.item-left{
		display: flex;
		width: 4rem;
		color: #bbbcc2;
	}
	.item-left .check{
		width: 0.40rem;
		height: 0.40rem;
		margin-right: 0.35rem;
		margin-top: 0.1rem;
		background: url(../../assets/icon.png) no-repeat;
		background-size: 100% 100%;
	}
	.item-right .device-icon{
		width: 1rem;
		height: 1rem;
	}
	.item-right .right-bottom{
		margin-top: 0.6rem;
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}
	.item-right .right-top{
		text-align: left;
		
	}
	.item-right .right-bottom .device-msg{
		margin-left: .6rem;
	}
	
	.padding-top{
		padding-top: 1.22rem;
	}
	.bottom-btn-box{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.btn{
		width: 4.65rem;
		height: 1.00rem;
		border: 1px solid #217bea;
		font-size: 0.36rem;
		line-height: 1.00rem;
		text-align: center;
	}
	.btn-default{
		background: #fff;
		color: #217bea;
	}
	.btn-blue{
		background: #217bea; 
		color: #fff;
	}
	.cancel{
		margin-right: 0.30rem;
	}
	.box:last-of-type{
		border-bottom: 1px solid #f7f7f7;
	}
</style>