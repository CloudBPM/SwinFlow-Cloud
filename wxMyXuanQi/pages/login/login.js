// pages/login/login.js

const md5 = require('../../resources/md5/md5.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    userPwd: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // 事件处理函数
  phoneLogin: function() {
    wx.navigateTo({
      url: '../phoneLogin/phoneLogin'
    })
  },
  zhuce: function () {
    wx.navigateTo({
      url: '../zhuce/zhuce'
    })
  },
  //获取用户输入的用户名
  userNameInput: function(e) {
    this.setData({
      userName: e.detail.value
    })
  },
  passWdInput: function(e) {
    this.setData({
      userPwd: e.detail.value
    })
  },
  login: function() {
    var that = this;
    let ma5Pwd = md5.md5(this.data.userPwd);
    console.log("用户名：" + this.data.userName + " 密码：" + ma5Pwd); 
    wx.request({
      url: 'http://paas.xuanqiyun.com:30005/login/Authenticate',
      // 'http://paas.xuanqiyun.com:30004/login/requestVerifyCodeService',
      method:'POST',
      data:{
        username: this.data.userName,
        password: ma5Pwd,
        loginType: 'Android'
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success:function(data){
        let status = data.data.status;
        if (status == 1){
          wx.redirectTo({
            url: '../index/index'
          })
        }else{
          wx.showModal({
            title: '温馨提示',
            content: '用户名或者密码不正确。',
            success: function (res) {
              if (res.confirm) { //这里是点击了确定以后
                console.log('用户点击确定')
              } else { //这里是点击了取消以后
                console.log('用户点击取消')
              }
            }
          })
        }
        console.log(data);
      }
    })
  }
})