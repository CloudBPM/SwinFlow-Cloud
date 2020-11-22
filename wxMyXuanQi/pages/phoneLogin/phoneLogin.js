// pages/phoneLogin/phoneLogin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:"验证码",
    isDisabled: true,
    phoneNumber:'',
    phoneNumberCorrect: false,  //记录手机号正确
    verifyCode:'',
    verifyCodeCorrect:false   //记录验证码格式正确

  },
  //获取用户输入的手机号
  phoneInput: function (e) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    this.setData({
      phoneNumber: e.detail.value,
    })
    if (myreg.test(this.data.phoneNumber)){
      console.log("手机号正确");
      this.setData({
        isDisabled: false,
        phoneNumberCorrect:true
      })
    }else{
      this.setData({
        isDisabled: true,
        phoneNumberCorrect: false
      })
      if (this.data.phoneNumber.length == 11){
        console.log("手机号不存在") //记得加弹框
      }
    }
  },
  verifyCode: function(e) {
    var patt = new RegExp("^[0-9]{6}$");
    this.setData({
      verifyCode: e.detail.value,
    })
    if (patt.test(this.data.verifyCode)) {
      console.log("验证码格式正确");
      this.setData({
        verifyCodeCorrect: true
      })
      
    } else {
      this.setData({
        verifyCodeCorrect: false
      })
    }

  },
  //事件处理函数
  getCode: function (evt) {
    var time = 60;
    var timer = null;
    var that = this;
    this.setData({
      text: "60秒",
      isDisabled: true,
    });
    timer = setInterval(function () {
      time--;
      that.setData({
        text: time + "秒",
      });
      if (time == 0) {
        that.setData({
          text: "重新发送",
          isDisabled: false,
        });
        clearInterval(timer);
      }
    }, 1000)

    // 获取验证码
    wx.request({
      url: 'http://paas.xuanqiyun.com:8088/api/service0/api5',
      // url: 'http://192.168.1.54:8088/api/service0/api5',
      method: 'POST',
      data: {
        // api:1,
        phoneNumber:this.data.phoneNumber
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (data) {
        
        console.log(data);
        
        //发送验证码成功
      }
    })
  },
  userlogin: function () {
    wx.navigateTo({
      url: '../login/login'
    })
  },
  login: function () {
    console.log("点击登录按钮");
    if (this.data.phoneNumberCorrect && this.data.verifyCodeCorrect) {
      console.log("可以登录");
      console.log(this.data.phoneNumber);
      console.log(this.data.verifyCode);
      // var mobile = this.data.phoneNumber;
      // mobile = mobile.replace(/\s+/g, "");
      // var code = this.data.verifyCode;
      // code = code.replace(/\s+/g, "");
      wx.request({
        url: 'http://paas.xuanqiyun.com:8088/api/service0/api6',
        method: 'POST',
        data: {
          // api: 4,
          phoneNumber: this.data.phoneNumber,
          code: this.data.verifyCode
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (data) {
          console.log(data);
          if (data.data.status == 3 || data.data.status == 4) {
            //3为未存在用户，然后注册成功
            //4为登录成功
            console.log("登录成功");
            wx.redirectTo({
              url: '../index/index'
            })
          }
        }
      })
      
    } else {
      //弹框提示验证码输入不正确
      console.log("手机号或验证码不正确");
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})